import {
  createApiFactory,
  githubAuthApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
  GithubAuth,
  configApiRef,
} from '@backstage/core';

import {
  costInsightsApiRef,
  ExampleCostInsightsClient,
} from '@backstage/plugin-cost-insights';

export const apis = [
  createApiFactory({
    api: githubAuthApiRef,
    deps: {
      configApi: configApiRef,
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      GithubAuth.create({
        discoveryApi,
        oauthRequestApi,
        defaultScopes: ['read:user'],
        environment: configApi.getString('auth.environment'),
      }),
  }),
  createApiFactory(costInsightsApiRef, new ExampleCostInsightsClient()),
];
