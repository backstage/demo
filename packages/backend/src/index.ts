import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage-community/plugin-badges-backend'));
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));
backend.add(import('@internal/plugin-catalog-backend-module-backstage'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage-community/plugin-explore-backend'));

backend.add(import('@frontside/backstage-plugin-graphql-backend'));
backend.add(
  import('@frontside/backstage-plugin-graphql-backend-module-catalog'),
);

backend.add(import('@backstage/plugin-kubernetes-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-explore'));

// TODO:(awanlin) enable when issue causing crashes is resolved
// https://github.com/backstage/backstage/issues/23047
// backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

backend.add(import('@backstage/plugin-techdocs-backend'));
backend.add(import('./extensions/docsBuildStrategy'));
backend.add(import('@backstage-community/plugin-todo-backend'));

backend.add(import('@backstage/plugin-events-backend'));
backend.add(import('@backstage/plugin-signals-backend'));
backend.add(import('@backstage/plugin-notifications-backend'));

backend.start();
