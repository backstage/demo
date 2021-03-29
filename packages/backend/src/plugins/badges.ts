import {
  createRouter,
  createDefaultBadgeFactories,
} from '@backstage/plugin-badges-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  config,
  discovery,
}: PluginEnvironment) {
  return await createRouter({
    config,
    discovery,
    badgeFactories: createDefaultBadgeFactories(),
  });
}
