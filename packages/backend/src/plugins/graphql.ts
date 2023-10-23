import { createRouter } from '@frontside/backstage-plugin-graphql-backend';
import {
  createCatalogLoader,
  Catalog,
} from '@frontside/backstage-plugin-graphql-backend-module-catalog';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  catalogClient,
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    modules: [Catalog()],
    logger,
    loaders: { ...createCatalogLoader(catalogClient) },
  });
}
