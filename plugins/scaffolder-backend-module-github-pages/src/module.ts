import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createGithubPagesAction } from './actions';
import {
  DefaultGithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';

/**
 * @public
 * The GitHub Module for the Scaffolder Backend
 */
export const githubPagesModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'github-pages',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ scaffolder, config }) {
        const integrations = ScmIntegrations.fromConfig(config);
        const githubCredentialsProvider =
          DefaultGithubCredentialsProvider.fromIntegrations(integrations);

        scaffolder.addActions(
          createGithubPagesAction({
            integrations,
            githubCredentialsProvider,
          }),
        );
      },
    });
  },
});
