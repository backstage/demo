/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import {
  CacheManager,
  DatabaseManager,
  HostDiscovery,
  ServerTokenManager,
  UrlReaders,
  createServiceBuilder,
  getRootLogger,
  loadBackendConfig,
  notFoundHandler,
} from '@backstage/backend-common';

import { Config } from '@backstage/config';
import { PluginEnvironment } from './types';
import Router from 'express-promise-router';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { TaskScheduler } from '@backstage/backend-tasks';
import app from './plugins/app';
import auth from './plugins/auth';
import badges from './plugins/badges';
import catalog from './plugins/catalog';
import explore from './plugins/explore';
import proxy from './plugins/proxy';
import search from './plugins/search';
import techdocs from './plugins/techdocs';
import todo from './plugins/todo';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
import graphql from './plugins/graphql';

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  root.info(`Created UrlReader ${reader}`);
  const discovery = HostDiscovery.fromConfig(config);
  const tokenManager = ServerTokenManager.noop();
  const databaseManager = DatabaseManager.fromConfig(config);
  const permissions = ServerPermissionClient.fromConfig(config, {
    discovery,
    tokenManager,
  });
  const cacheManager = CacheManager.fromConfig(config);
  const taskScheduler = TaskScheduler.fromConfig(config, { databaseManager });
  const identity = DefaultIdentityClient.create({
    discovery,
  });

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const database = databaseManager.forPlugin(plugin);
    const cache = cacheManager.forPlugin(plugin);
    const scheduler = taskScheduler.forPlugin(plugin);

    return {
      logger,
      cache,
      database,
      config,
      reader,
      discovery,
      tokenManager,
      permissions,
      scheduler,
      identity,
    };
  };
}

async function main() {
  const config = await loadBackendConfig({
    argv: process.argv,
    logger: getRootLogger(),
  });
  const createEnv = makeCreateEnv(config);

  const catalogEnv = createEnv('catalog');
  const authEnv = createEnv('auth');
  const proxyEnv = createEnv('proxy');
  const searchEnv = createEnv('search');
  const techdocsEnv = createEnv('techdocs');
  const todoEnv = createEnv('todo');
  const appEnv = createEnv('app');
  const badgesEnv = createEnv('badges');
  const exploreEnv = createEnv('explore');
  const graphqlEnv = createEnv('graphql');

  const apiRouter = Router();
  apiRouter.use('/catalog', await catalog(catalogEnv));
  apiRouter.use('/auth', await auth(authEnv));
  apiRouter.use('/search', await search(searchEnv));
  apiRouter.use('/techdocs', await techdocs(techdocsEnv));
  apiRouter.use('/todo', await todo(todoEnv));
  apiRouter.use('/proxy', await proxy(proxyEnv));
  apiRouter.use('/badges', await badges(badgesEnv));
  apiRouter.use('/explore', await explore(exploreEnv));
  apiRouter.use('/graphql', await graphql(graphqlEnv));
  apiRouter.use(notFoundHandler());

  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('/api', apiRouter)
    .addRouter('', await app(appEnv));

  await service.start().catch(err => {
    console.log(err);
    process.exit(1);
  });
}

module.hot?.accept();
main().catch(error => {
  console.error('Backend failed to start up', error);
  process.exit(1);
});
