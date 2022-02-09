import { DockerContainerRunner } from '@backstage/backend-common';
import {
  createRouter,
  Generators,
  Preparers,
  Publisher,
} from '@backstage/plugin-techdocs-backend';
import Docker from 'dockerode';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
  discovery,
  reader,
  cache,
}: PluginEnvironment): Promise<Router> {
  const preparers = await Preparers.fromConfig(config, {
    logger,
    reader,
  });

  const dockerClient = new Docker();
  const containerRunner = new DockerContainerRunner({ dockerClient });

  const generators = await Generators.fromConfig(config, {
    logger,
    containerRunner,
  });

  const publisher = await Publisher.fromConfig(config, {
    logger,
    discovery,
  });

  await publisher.getReadiness();

  return await createRouter({
    preparers,
    generators,
    publisher,
    logger,
    config,
    discovery,
    cache,
  });
}
