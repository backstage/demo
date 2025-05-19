import {
  graphQlBrowseApiRef,
  GraphQLEndpoints,
} from '@backstage-community/plugin-graphiql';
import {
  costInsightsApiRef,
  ExampleCostInsightsClient,
} from '@backstage-community/plugin-cost-insights';
import {
  ScmAuth,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';

import {
  createApiFactory,
  githubAuthApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
  errorApiRef,
  configApiRef,
  AnyApiFactory,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { GithubAuth } from '@backstage/core-app-api';
import { visitsApiRef, VisitsWebStorageApi } from '@backstage/plugin-home';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),
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
  createApiFactory({
    api: graphQlBrowseApiRef,
    deps: {
      errorApi: errorApiRef,
      githubAuthApi: githubAuthApiRef,
      discoveryApi: discoveryApiRef,
    },
    factory: ({ errorApi, githubAuthApi, discoveryApi }) =>
      GraphQLEndpoints.from([
        GraphQLEndpoints.create({
          id: 'backstage',
          title: 'GraphQL Backend',
          url: discoveryApi.getBaseUrl('graphql'),
        }),
        GraphQLEndpoints.github({
          id: 'github',
          title: 'GitHub',
          errorApi,
          githubAuthApi,
        }),
        GraphQLEndpoints.create({
          id: 'gitlab',
          title: 'GitLab',
          url: 'https://gitlab.com/api/graphql',
        }),
        GraphQLEndpoints.create({
          id: 'swapi',
          title: 'SWAPI',
          url: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
        }),
      ]),
  }),
  createApiFactory(costInsightsApiRef, new ExampleCostInsightsClient()),
  createApiFactory({
    api: visitsApiRef,
    deps: {
      identityApi: identityApiRef,
      errorApi: errorApiRef,
    },
    factory: ({ identityApi, errorApi }) =>
      VisitsWebStorageApi.create({ identityApi, errorApi }),
  }),
];
