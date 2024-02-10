import { legacyPlugin } from '@backstage/backend-common';
import { createBackend } from '@backstage/backend-defaults';
import { graphqlPlugin } from '@frontside/backstage-plugin-graphql-backend';
import { graphqlModuleCatalog } from '@frontside/backstage-plugin-graphql-backend-module-catalog';

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
backend.add(import('@backstage/plugin-badges-backend'));
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(
    import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
  );
// TODO:(awanlin) replace when this is completed: https://github.com/backstage/backstage/pull/20551
backend.add(legacyPlugin('explore', import('./plugins/explore')));
// TODO:(awanlin) update with import when available
backend.add(graphqlPlugin);
backend.add(graphqlModuleCatalog());
backend.add(import('@backstage/plugin-kubernetes-backend/alpha'));
backend.add(import('@backstage/plugin-proxy-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'))
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-explore/alpha'));
// TODO:(awanlin) enable when issue causing crashes is resolved
// backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));

backend.add(import('@backstage/plugin-techdocs-backend/alpha'));
backend.add(import('./extensions/docsBuildStrategy'));

backend.add(import('@backstage/plugin-todo-backend'));

backend.start();
