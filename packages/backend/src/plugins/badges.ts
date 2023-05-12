import {
  createRouter,
  createDefaultBadgeFactories,
} from '@backstage/plugin-badges-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    config: env.config,
    discovery: env.discovery,
    badgeFactories: createDefaultBadgeFactories(),
    tokenManager: env.tokenManager,
    logger: env.logger,
    identity: env.identity,
  });
}

