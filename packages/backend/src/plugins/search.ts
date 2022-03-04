import { useHotCleanup } from '@backstage/backend-common';
import { createRouter } from '@backstage/plugin-search-backend';
import {
  IndexBuilder,
  LunrSearchEngine,
} from '@backstage/plugin-search-backend-node';
import { PluginEnvironment } from '../types';
import { DefaultCatalogCollatorFactory } from '@backstage/plugin-catalog-backend';
import { DefaultTechDocsCollatorFactory } from '@backstage/plugin-techdocs-backend';

export default async function createPlugin({
  config,
  logger,
  discovery,
  tokenManager,
  permissions,
}: PluginEnvironment) {
  const searchEngine = new LunrSearchEngine({ logger });
  const indexBuilder = new IndexBuilder({ logger, searchEngine });

  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    factory: DefaultCatalogCollatorFactory.fromConfig(config, {
      discovery,
      tokenManager,
    }),
  });

  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    factory: DefaultTechDocsCollatorFactory.fromConfig(config, {
      discovery,
      logger,
      tokenManager,
    }),
  });

  const { scheduler } = await indexBuilder.build();

  scheduler.start();
  useHotCleanup(module, () => scheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    types: indexBuilder.getDocumentTypes(),
    permissions,
    config,
    logger,
  });
}
