import { useHotCleanup } from '@backstage/backend-common';
import { createRouter } from '@backstage/plugin-search-backend';
import {
  IndexBuilder,
  LunrSearchEngine,
} from '@backstage/plugin-search-backend-node';
import { PluginEnvironment } from '../types';
import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';

export default async function createPlugin({
  logger,
  discovery,
}: PluginEnvironment) {
  const searchEngine = new LunrSearchEngine({ logger });
  const indexBuilder = new IndexBuilder({ logger, searchEngine });

  indexBuilder.addCollator({
    type: 'software-catalog',
    defaultRefreshIntervalSeconds: 600,
    collator: new DefaultCatalogCollator({ discovery }),
  });

  const { scheduler } = await indexBuilder.build();

  scheduler.start();
  useHotCleanup(module, () => scheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    logger,
  });
}
