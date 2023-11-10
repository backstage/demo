import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@frontside/backstage-plugin-graphql-backend';
import {
  createCatalogLoader,
  Catalog,
} from '@frontside/backstage-plugin-graphql-backend-module-catalog';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  discovery,
}: PluginEnvironment): Promise<Router> {
  const catalogClient = new CatalogClient({ discoveryApi: discovery });
  return await createRouter({
    modules: [Catalog()],
    logger,
    loaders: { ...createCatalogLoader(catalogClient) },
  });
}
