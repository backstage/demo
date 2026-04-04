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

import {
  ApiBlueprint,
  ExtensionDefinition,
} from '@backstage/frontend-plugin-api';

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

export const apis: ExtensionDefinition[] = [
  scmIntegrationsApi,
  scmAuthApi,
  githubAuthApi,
  visitsApi,
];
