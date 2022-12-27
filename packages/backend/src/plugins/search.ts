import { useHotCleanup } from '@backstage/backend-common';
import { createRouter } from '@backstage/plugin-search-backend';
import {
  IndexBuilder,
  LunrSearchEngine,
} from '@backstage/plugin-search-backend-node';
import { PluginEnvironment } from '../types';
import { DefaultCatalogCollatorFactory } from '@backstage/plugin-catalog-backend';
import { DefaultTechDocsCollatorFactory } from '@backstage/plugin-techdocs-backend';
import { ToolDocumentCollatorFactory } from '@backstage/plugin-explore-backend';

export default async function createPlugin({
  config,
  logger,
  discovery,
  tokenManager,
  permissions,
  scheduler,
}: PluginEnvironment) {
  const searchEngine = new LunrSearchEngine({ logger });
  const indexBuilder = new IndexBuilder({ logger, searchEngine });
  const schedule = scheduler.createScheduledTaskRunner({
    frequency: { minutes: 10 },
    timeout: { minutes: 10 },
    initialDelay: { seconds: 3 },
  });
  indexBuilder.addCollator({
    schedule,
    factory: DefaultCatalogCollatorFactory.fromConfig(config, {
      discovery,
      tokenManager,
    }),
  });

  indexBuilder.addCollator({
    schedule,
    factory: DefaultTechDocsCollatorFactory.fromConfig(config, {
      discovery,
      logger,
      tokenManager,
    }),
  });

  indexBuilder.addCollator({
    schedule,
    factory: ToolDocumentCollatorFactory.fromConfig(config, {
      discovery: discovery,
      logger: logger,
    }),
  });

  const { scheduler: indexScheduler } = await indexBuilder.build();
  indexScheduler.start();
  useHotCleanup(module, () => indexScheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    types: indexBuilder.getDocumentTypes(),
    permissions,
    config,
    logger,
  });
}
