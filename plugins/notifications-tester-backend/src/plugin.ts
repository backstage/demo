import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { notificationService } from '@backstage/plugin-notifications-node';

/**
 * notificationsTesterPlugin backend plugin
 *
 * @public
 */
export const notificationsTesterPlugin = createBackendPlugin({
  pluginId: 'notifications-tester',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
        notifications: notificationService,
      },
      async init({ config, logger, notifications, httpRouter }) {
        httpRouter.use(
          await createRouter({
            config,
            logger,
            notifications,
          }),
        );
      },
    });
  },
});
