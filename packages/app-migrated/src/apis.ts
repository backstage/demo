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
  githubAuthApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
  errorApiRef,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { GithubAuth } from '@backstage/core-app-api';
import { visitsApiRef, VisitsWebStorageApi } from '@backstage/plugin-home';

// New Frontend System imports
import { ApiBlueprint } from '@backstage/frontend-plugin-api';

const scmIntegrationsApi = ApiBlueprint.make({
  name: 'scm-integrations',
  params: define =>
    define({
      api: scmIntegrationsApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
    }),
});

const scmAuthApi = ApiBlueprint.make({
  name: 'scm-auth',
  params: define => define(ScmAuth.createDefaultApiFactory()),
});

const githubAuthApi = ApiBlueprint.make({
  name: 'github-auth',
  params: define =>
    define({
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
});

const graphQlBrowseApi = ApiBlueprint.make({
  name: 'graphql-browse',
  params: define =>
    define({
      api: graphQlBrowseApiRef,
      deps: {
        errorApi: errorApiRef,
        graphGithubAuthApi: githubAuthApiRef,
        discoveryApi: discoveryApiRef,
      },
      factory: ({ errorApi, graphGithubAuthApi, discoveryApi }) =>
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
            githubAuthApi: graphGithubAuthApi,
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
});

const costInsightsApi = ApiBlueprint.make({
  name: 'cost-insights',
  params: define =>
    define({
      api: costInsightsApiRef,
      deps: {},
      factory: ({}) => new ExampleCostInsightsClient(),
    }),
});

const visitsApi = ApiBlueprint.make({
  name: 'visits',
  params: define =>
    define({
      api: visitsApiRef,
      deps: {
        identityApi: identityApiRef,
        errorApi: errorApiRef,
      },
      factory: ({ identityApi, errorApi }) =>
        VisitsWebStorageApi.create({ identityApi, errorApi }),
    }),
});

export const apis = [
  scmIntegrationsApi,
  scmAuthApi,
  githubAuthApi,
  graphQlBrowseApi,
  costInsightsApi,
  visitsApi,
];
