import { useHotCleanup } from '@backstage/backend-common';
import { createRouter } from '@backstage/plugin-search-backend';
import { IndexBuilder } from '@backstage/plugin-search-backend-node';
import { PluginEnvironment } from '../types';
import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';

export default async function createPlugin({
  logger,
  discovery,
}: PluginEnvironment) {
  const indexBuilder = new IndexBuilder({ logger });

  indexBuilder.addCollator({
    type: 'software-catalog',
    defaultRefreshIntervalSeconds: 600,
    collator: new DefaultCatalogCollator(discovery),
  });

  // TODO: Move refresh loop logic into the builder.
  const timerId = setInterval(() => {
    indexBuilder.build();
  }, 60000);
  useHotCleanup(module, () => clearInterval(timerId));

  return await createRouter({
    logger,
  });
}
