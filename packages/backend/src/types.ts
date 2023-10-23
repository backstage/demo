import {
  PluginCacheManager,
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  TokenManager,
  UrlReader,
} from '@backstage/backend-common';

import { Config } from '@backstage/config';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { Logger } from 'winston';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { PluginTaskScheduler } from '@backstage/backend-tasks';

export type PluginEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
  cache: PluginCacheManager;
  config: Config;
  reader: UrlReader;
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  scheduler: PluginTaskScheduler;
  permissions: PermissionEvaluator;
  identity: IdentityApi;
};
