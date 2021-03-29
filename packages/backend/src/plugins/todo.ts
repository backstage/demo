import { CatalogClient } from '@backstage/catalog-client';
import {
  createRouter,
  TodoReaderService,
  TodoScmReader,
} from '@backstage/plugin-todo-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  reader,
  config,
  discovery,
}: PluginEnvironment): Promise<Router> {
  const todoReader = TodoScmReader.fromConfig(config, {
    logger,
    reader,
  });
  const catalogClient = new CatalogClient({ discoveryApi: discovery });
  const todoService = new TodoReaderService({
    todoReader,
    catalogClient,
  });

  return await createRouter({ todoService });
}
