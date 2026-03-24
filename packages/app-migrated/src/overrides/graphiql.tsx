import {
  ExtensionDefinition,
  FrontendFeature,
} from '@backstage/frontend-plugin-api';
import {
  graphQlBrowseApiRef,
  GraphQLEndpoints,
} from '@backstage-community/plugin-graphiql';
import graphiqlPlugin, {
  graphiqlBrowseApi,
} from '@backstage-community/plugin-graphiql/alpha';
import {
  errorApiRef,
  githubAuthApiRef,
  discoveryApiRef,
} from '@backstage/core-plugin-api';

// Override api:graphiql with custom endpoints — must live in the graphiql plugin
// so it replaces the plugin's own API rather than conflicting with it.
// Cast to ExtensionDefinition to avoid TS2589 from the override() generics.
export const graphiqlOverride: FrontendFeature = graphiqlPlugin.withOverrides({
  extensions: [
    graphiqlBrowseApi.override({
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
    }) as ExtensionDefinition,
  ],
});
