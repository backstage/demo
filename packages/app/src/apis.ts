import {
  ScmAuth,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';

import { githubAuthApiRef } from '@backstage/core-plugin-api';

import { GithubAuth } from '@backstage/core-app-api';
import {
  ApiBlueprint,
  coreApis,
  ExtensionDefinition,
} from '@backstage/frontend-plugin-api';

const scmIntegrationsApi = ApiBlueprint.make({
  name: 'scm-integrations',
  params: define =>
    define({
      api: scmIntegrationsApiRef,
      deps: { configApi: coreApis.config },
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
        configApi: coreApis.config,
        discoveryApi: coreApis.discovery,
        oauthRequestApi: coreApis.oauthRequest,
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

export const apis: ExtensionDefinition[] = [
  scmIntegrationsApi,
  scmAuthApi,
  githubAuthApi,
];
