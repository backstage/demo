import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  NotificationSendOptions,
  NotificationService,
} from '@backstage/plugin-notifications-node';

import express from 'express';
import Router from 'express-promise-router';

const TEST_NOTIFICATION: NotificationSendOptions = {
  recipients: { type: 'entity', entityRef: 'user:default/guest' },
  payload: {
    title: 'Test Notification',
    severity: 'normal',
    topic: 'Sending Test',
  },
};

export async function createRouter({
  config,
  logger,
  notifications,
}: {
  config: Config;
  logger: LoggerService;
  notifications: NotificationService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.post('/test', async (_req, res) => {
    if (config.getBoolean('notificationsTester.enabled')) {
      logger.info(`Sending test notification`);
      notifications.send(TEST_NOTIFICATION);
    } else {
      logger.info(`Tested currently disabled, no notification sent`);
    }

    res.status(200);
  });

  return router;
}
