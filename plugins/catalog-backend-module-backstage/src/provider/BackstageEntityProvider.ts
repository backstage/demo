import { Config } from '@backstage/config';
import {
  GithubCredentialsProvider,
  ScmIntegrations,
  GithubIntegrationConfig,
  GithubIntegration,
  SingleInstanceGithubCredentialsProvider,
} from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import lodash from 'lodash';
import yaml from 'yaml';
import fetch from 'node-fetch';
import * as uuid from 'uuid';
import { GithubRepository, PackageJson } from '../types';
import { ComponentEntity, Entity } from '@backstage/catalog-model';
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { sync as globSync } from 'glob';
import fs from 'fs-extra';
import path from 'path';
import { defaults } from '../constants';
import {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';

export class BackstageEntityProvider implements EntityProvider {
  private readonly logger: LoggerService;
  private readonly integration: GithubIntegrationConfig;
  private readonly urlReader: UrlReaderService;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;
  private readonly githubCredentialsProvider: GithubCredentialsProvider;
  private readonly config: Config;

  static fromConfig(
    config: Config,
    options: {
      logger: LoggerService;
      urlReader: UrlReaderService;
      scheduler: SchedulerService;
    },
  ): BackstageEntityProvider {
    const integrations = ScmIntegrations.fromConfig(config);
    const integration = integrations.github.byHost(defaults.host);

    if (!integration) {
      throw new Error(
        `There is no GitHub config that matches host ${defaults.host}. Please add a configuration entry for it under 'integrations.github'`,
      );
    }

    const configSchedule = readSchedulerServiceTaskScheduleDefinitionFromConfig(
      config.getConfig('catalog.providers.backstage.schedule'),
    );

    const taskRunner =
      options.scheduler.createScheduledTaskRunner(configSchedule);

    return new BackstageEntityProvider(
      integration,
      options.logger,
      taskRunner,
      options.urlReader,
      config,
    );
  }

  private constructor(
    integration: GithubIntegration,
    logger: LoggerService,
    taskRunner: SchedulerServiceTaskRunner,
    urlReader: UrlReaderService,
    config: Config,
  ) {
    this.integration = integration.config;
    this.logger = logger.child({
      target: this.getProviderName(),
    });
    this.urlReader = urlReader;
    this.scheduleFn = this.createScheduleFn(taskRunner);
    this.githubCredentialsProvider =
      SingleInstanceGithubCredentialsProvider.create(integration.config);
    this.config = config;
  }

  getProviderName(): string {
    return 'BackstageEntityProvider';
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    return await this.scheduleFn();
  }

  private createScheduleFn(
    taskRunner: SchedulerServiceTaskRunner,
  ): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: BackstageEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid.v4(),
          });
          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(`${this.getProviderName()} refresh failed, ${error}`);
          }
        },
      });
    };
  }

  async refresh(logger: LoggerService) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }
    const enabled = this.config.getBoolean(
      'catalog.providers.backstage.enabled',
    );
    if (!enabled) {
      logger.warn(
        'Backstage entity provider is currently disabled via config, exiting',
      );
      return;
    }

    const entities: Entity[] = [];

    const repositories = await this.getAllRepositories();

    for (const repository of repositories) {
      const readTreeResponse = await this.urlReader.readTree(
        `https://github.com/backstage/${repository.name}`,
      );

      const fileDir = await readTreeResponse.dir();
      const catalogInfoFiles = globSync(
        [
          'catalog-info.yaml',
          'packages/*/catalog-info.yaml',
          'plugins/*/catalog-info.yaml',
        ],
        { cwd: fileDir },
      );

      logger.info(
        `Found ${catalogInfoFiles.length} catalog-info.yaml files in the '${repository.name}' repository`,
      );

      if (!catalogInfoFiles) {
        // No catalog info files found, continue
        logger.warn(
          `No catalog-info.yaml file found in the '${repository.name}' repository, continuing`,
        );
        continue;
      }

      try {
        for (const catalogInfoFile of catalogInfoFiles) {
          const catalogInfoDir = path.join(fileDir, catalogInfoFile);
          const rawEntities = await this.parseEntityYaml(catalogInfoDir);
          const cleanEntities = this.cleanUpRawEntities(
            rawEntities,
            repository,
            catalogInfoFile,
          );

          const mappedEntities: Entity[] = [];
          for (const cleanEntity of cleanEntities) {
            switch (cleanEntity.kind) {
              case 'Component': {
                const mappedComponent = await this.componentMapper(
                  cleanEntity,
                  repository,
                  catalogInfoDir,
                );
                mappedEntities.push(mappedComponent);
                break;
              }

              default:
                mappedEntities.push(cleanEntity);
            }
          }

          entities.push(...mappedEntities);
        }
      } finally {
        await fs.remove(fileDir);
      }
    }

    if (entities.length > 0) {
      logger.info(
        `Attempting to apply mutations on ${
          entities.length
        } entities from the ${this.getProviderName()} provider`,
      );
      await this.connection.applyMutation({
        type: 'full',
        entities: entities.map(entity => ({
          entity,
          locationKey: this.getProviderName(),
        })),
      });
    } else {
      logger.warn(
        'No Backstage entities discovered, mutation not being attempted this run',
      );
    }

    logger.info(
      `Completed refreshing entities for the ${this.getProviderName()} provider`,
    );
  }

  private async getAllRepositories(): Promise<GithubRepository[]> {
    const host = this.integration.host;
    const orgUrl = `https://${host}/${defaults.organization}`;

    const credentials = await this.githubCredentialsProvider.getCredentials({
      url: orgUrl,
    });

    // TODO: (awanlin) - Default page size is 30, there are 23 repos as of April 12, 2024
    const ghApiUrl = `https://api.github.com/orgs/${defaults.organization}/repos`;
    const response = await fetch(ghApiUrl, {
      headers: {
        ...credentials?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Unable to retrieve list of repositories from: '${ghApiUrl}'`,
      );
    }

    const repositories = (await response.json()) as GithubRepository[];
    return repositories;
  }

  private async parseEntityYaml(catalogInfoDir: string): Promise<Entity[]> {
    let documents: yaml.Document.Parsed[];
    const entities: Entity[] = [];
    try {
      const data = await fs.readFile(catalogInfoDir);
      documents = yaml.parseAllDocuments(data.toString('utf8')).filter(d => d);
    } catch (e) {
      throw Error(`Failed to parse YAML at ${catalogInfoDir}, ${e}`);
    }

    for (const document of documents) {
      if (document.errors?.length) {
        throw Error(`YAML error at ${catalogInfoDir}, ${document.errors[0]}`);
      } else {
        const json = document.toJSON();
        if (lodash.isPlainObject(json)) {
          entities.push(json as Entity);
        } else if (json === null) {
          // Ignore null values, these happen if there is an empty document in the
          // YAML file, for example if --- is added to the end of the file.
        } else {
          throw Error(`Expected object at root, got ${typeof json}`);
        }
      }
    }

    return entities;
  }

  private cleanUpRawEntities(
    rawEntities: Entity[],
    repository: GithubRepository,
    catalogInfoFilePath: string,
  ) {
    const cleanEntities: Entity[] = [];
    const baseUrl = `https://github.com/backstage/${repository.name}`;
    const subPath =
      catalogInfoFilePath === 'catalog-info.yaml'
        ? ''
        : catalogInfoFilePath.replace('catalog-info.yaml', '').trim();

    for (const rawEntity of rawEntities) {
      const annotations: Record<string, string> =
        (rawEntity.metadata.annotations ??= {});

      annotations['backstage.io/managed-by-location'] =
        `url:${baseUrl}/blob/${repository.default_branch}/${catalogInfoFilePath}`;
      annotations['backstage.io/managed-by-origin-location'] =
        `url:${baseUrl}/blob/${repository.default_branch}/${catalogInfoFilePath}`;
      annotations['backstage.io/edit-url'] =
        `${baseUrl}/edit/${repository.default_branch}/${catalogInfoFilePath}`;
      annotations['backstage.io/view-url'] =
        `${baseUrl}/blob/${repository.default_branch}/${catalogInfoFilePath}`;
      annotations['backstage.io/source-location'] =
        `url:${baseUrl}/blob/${repository.default_branch}/${subPath}`;

      rawEntity.metadata.namespace = defaults.namespace;
      cleanEntities.push(rawEntity);
    }

    return cleanEntities;
  }

  private async componentMapper(
    entity: Entity,
    repository: GithubRepository,
    catalogInfoDir: string,
  ) {
    const componentEntity = entity as ComponentEntity;

    const dependsOn: string[] = [];
    switch (repository.language) {
      case 'TypeScript':
      case 'JavaScript': {
        const packageJsonDir = catalogInfoDir.replace(
          'catalog-info.yaml',
          'package.json',
        );
        const data = await fs.readFile(packageJsonDir);
        const packageJson = JSON.parse(data.toString('utf8')) as PackageJson;
        if (packageJson.dependencies) {
          const dependencies = Object.keys(packageJson.dependencies).filter(d =>
            d.startsWith('@backstage'),
          );
          dependencies.forEach((dep, index) => {
            dependencies[index] =
              `component:${defaults.namespace}/${dep.replace(
                '@backstage/',
                'backstage-',
              )}`;
          });
          dependsOn.push(...dependencies);
        }
        break;
      }
      default:
        break;
    }

    componentEntity.spec.dependsOn = dependsOn;
    return componentEntity;
  }
}
