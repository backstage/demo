import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { BackstageEntityProvider } from './provider/BackstageEntityProvider';

export const catalogModuleBackstageEntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'backstage-entity-provider',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        urlReader: coreServices.urlReader,
      },
      async init({ catalog, config, logger, scheduler, urlReader }) {
        catalog.addEntityProvider(
          BackstageEntityProvider.fromConfig(config, {
            logger: logger,
            urlReader,
            scheduler,
          }),
        );
      },
    });
  },
});
