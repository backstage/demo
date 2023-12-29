import { techdocsBuildsExtensionPoint } from '@backstage/plugin-techdocs-backend';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { Entity } from '@backstage/catalog-model';
import { DocsBuildStrategy } from '@backstage/plugin-techdocs-node';

export class CustomDocsBuildStrategy implements DocsBuildStrategy {
  private readonly config: Config;

  private constructor(config: Config) {
    this.config = config;
  }

  static fromConfig(config: Config): CustomDocsBuildStrategy {
    return new CustomDocsBuildStrategy(config);
  }

  async shouldBuild(params: { entity: Entity }): Promise<boolean> {
    return (
      // We only want to build for the `backstage-demo` entity as it is
      // intended as an example of the out of the box setup for TechDocs
      this.config.getString('techdocs.builder') === 'local' &&
      params.entity.metadata.name === 'backstage-demo'
    );
  }
}

export const docsBuildStrategy = createBackendModule({
  pluginId: 'techdocs',
  moduleId: 'custom-build-strategy',
  register(env) {
    env.registerInit({
      deps: {
        builds: techdocsBuildsExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ builds, config }) {
        builds.setBuildStrategy(CustomDocsBuildStrategy.fromConfig(config));
      },
    });
  },
});
