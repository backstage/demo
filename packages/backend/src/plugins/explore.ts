import {
  createRouter,
  StaticExploreToolProvider,
} from '@backstage/plugin-explore-backend';
import { ExploreTool } from '@backstage/plugin-explore-common';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

// List of tools you want to surface in the Explore plugin "Tools" page.
const tools: ExploreTool[] = [
  {
    title: 'Tech Radar',
    description:
      'Tech Radar is a list of technologies, complemented by an assessment result, called ring assignment.',
    url: '/tech-radar',
    image: '/tech-radar.png',
    tags: ['standards', 'landscape'],
  },
  {
    title: 'Cost Insights',
    description: 'Insights into cloud costs for your organization.',
    url: '/cost-insights',
    image: '/google-cloud.png',
    tags: ['cloud', 'finops'],
  },
  {
    title: 'GraphiQL',
    description:
      'Integrates GraphiQL as a tool to browse GraphiQL endpoints inside Backstage.',
    url: '/graphiql',
    image: '/graphiql.png',
    tags: ['graphql', 'dev'],
  },
];

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    toolProvider: StaticExploreToolProvider.fromData(tools),
  });
}
