import { createRouter } from '@backstage/plugin-app-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({ logger }: PluginEnvironment) {
  return await createRouter({
    logger,
    appPackageName: 'app',
  });
}
