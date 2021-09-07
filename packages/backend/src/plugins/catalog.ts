import {
  CatalogBuilder,
  createRouter,
} from '@backstage/plugin-catalog-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);

  const {
    entitiesCatalog,
    locationAnalyzer,
    locationService,
    processingEngine,
  } = await builder.build();

  await processingEngine.start();

  return await createRouter({
    entitiesCatalog,
    locationAnalyzer,
    locationService,
    logger: env.logger,
    config: env.config,
  });
}
