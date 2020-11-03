import { useHotCleanup, NotAllowedError } from '@backstage/backend-common';
import {
  CatalogBuilder,
  createRouter,
  runPeriodically,
} from '@backstage/plugin-catalog-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(env: PluginEnvironment) {
  const builder = new CatalogBuilder(env);
  const {
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
  } = await builder.build();

  useHotCleanup(
    module,
    runPeriodically(() => higherOrderOperation.refreshAllLocations(), 100000),
  );

  const catalogRouter = await createRouter({
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    logger: env.logger,
  });

  const router = Router();

  router.post('*', () => {
    throw new NotAllowedError(
      'This operation is disabled for the demo deployment',
    );
  });

  router.delete('*', () => {
    throw new NotAllowedError(
      'This operation is disabled for the demo deployment',
    );
  });

  router.use(catalogRouter);

  return router;
}
