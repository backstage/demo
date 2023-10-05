import { createRouter } from '@backstage/plugin-search-backend';
import {
  IndexBuilder,
  LunrSearchEngine,
} from '@backstage/plugin-search-backend-node';
import { PluginEnvironment } from '../types';
import { DefaultCatalogCollatorFactory } from '@backstage/plugin-search-backend-module-catalog';
import { DefaultTechDocsCollatorFactory } from '@backstage/plugin-search-backend-module-techdocs';
import { ToolDocumentCollatorFactory } from '@backstage/plugin-search-backend-module-explore';

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

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    types: indexBuilder.getDocumentTypes(),
    permissions,
    config,
    logger,
  });
}
