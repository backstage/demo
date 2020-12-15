import {
  createRouter,
  DirectoryPreparer,
  Preparers,
  Generators,
  TechdocsGenerator,
  CommonGitPreparer,
  UrlPreparer,
  Publisher,
} from '@backstage/plugin-techdocs-backend';
import { PluginEnvironment } from '../types';
import Docker from 'dockerode';

export default async function createPlugin({
  logger,
  config,
  discovery,
  reader,
}: PluginEnvironment) {
  const generators = new Generators();
  const techdocsGenerator = new TechdocsGenerator(logger, config);
  generators.register('techdocs', techdocsGenerator);

  const preparers = new Preparers();

  const directoryPreparer = new DirectoryPreparer(logger);
  preparers.register('dir', directoryPreparer);

  const commonGitPreparer = new CommonGitPreparer(logger);
  preparers.register('github', commonGitPreparer);
  preparers.register('gitlab', commonGitPreparer);
  preparers.register('azure/api', commonGitPreparer);

  const urlPreparer = new UrlPreparer(reader, logger);
  preparers.register('url', urlPreparer);

  const publisher = Publisher.fromConfig(config, logger, discovery);

  const dockerClient = new Docker();

  return await createRouter({
    preparers,
    generators,
    publisher,
    dockerClient,
    logger,
    config,
    discovery,
  });
}
