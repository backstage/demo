import { InputError } from '@backstage/errors';
import {
  ScmIntegrationRegistry,
  GithubCredentialsProvider,
  DefaultGithubCredentialsProvider,
} from '@backstage/integration';
import { parseRepoUrl } from '@backstage/plugin-scaffolder-node';
import { OctokitOptions } from '@octokit/core/dist-types/types';

const DEFAULT_TIMEOUT_MS = 60_000;

export async function getOctokitOptions(options: {
  integrations: ScmIntegrationRegistry;
  credentialsProvider?: GithubCredentialsProvider;
  token?: string;
  repoUrl: string;
}): Promise<OctokitOptions> {
  const { integrations, credentialsProvider, repoUrl, token } = options;
  const { owner, repo, host } = parseRepoUrl(repoUrl, integrations);

  const requestOptions = {
    // set timeout to 60 seconds
    timeout: DEFAULT_TIMEOUT_MS,
  };

  if (!owner) {
    throw new InputError(`No owner provided for repo ${repoUrl}`);
  }

  const integrationConfig = integrations.github.byHost(host)?.config;

  if (!integrationConfig) {
    throw new InputError(`No integration for host ${host}`);
  }

  // short circuit the `githubCredentialsProvider` if there is a token provided by the caller already
  if (token) {
    return {
      auth: token,
      baseUrl: integrationConfig.apiBaseUrl,
      previews: ['nebula-preview'],
      request: requestOptions,
    };
  }

  const githubCredentialsProvider =
    credentialsProvider ??
    DefaultGithubCredentialsProvider.fromIntegrations(integrations);

  // TODO(blam): Consider changing this API to take host and repo instead of repoUrl, as we end up parsing in this function
  // and then parsing in the `getCredentials` function too the other side
  const { token: credentialProviderToken } =
    await githubCredentialsProvider.getCredentials({
      url: `https://${host}/${encodeURIComponent(owner)}/${encodeURIComponent(
        repo,
      )}`,
    });

  if (!credentialProviderToken) {
    throw new InputError(
      `No token available for host: ${host}, with owner ${owner}, and repo ${repo}`,
    );
  }

  return {
    auth: credentialProviderToken,
    baseUrl: integrationConfig.apiBaseUrl,
    previews: ['nebula-preview'],
  };
}
