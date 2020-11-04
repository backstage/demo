import {
  createApiFactory,
  githubAuthApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
  GithubAuth,
  configApiRef,
} from '@backstage/core';

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
];
