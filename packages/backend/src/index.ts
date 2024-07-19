import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage-community/plugin-badges-backend'));
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));
backend.add(import('@internal/plugin-catalog-backend-module-backstage'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage-community/plugin-explore-backend'));

// TODO:(awanlin) removeed when this has been resolved
// https://github.com/thefrontside/playhouse/issues/405
// eslint-disable-next-line
backend.add(import('@frontside/backstage-plugin-graphql-backend'));
// eslint-disable-next-line
backend.add(
  import('@frontside/backstage-plugin-graphql-backend-module-catalog'),
);

backend.add(import('@backstage/plugin-kubernetes-backend/alpha'));
backend.add(import('@backstage/plugin-proxy-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@internal/plugin-scaffolder-backend-module-github-pages'));
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-explore/alpha'));

// TODO:(awanlin) enable when issue causing crashes is resolved
// https://github.com/backstage/backstage/issues/23047
// backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));

backend.add(import('@backstage/plugin-techdocs-backend/alpha'));
backend.add(import('./extensions/docsBuildStrategy'));
backend.add(import('@backstage-community/plugin-todo-backend'));

backend.start();
