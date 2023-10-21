import { legacyPlugin } from '@backstage/backend-common';
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(legacyPlugin('todo', import('./plugins/auth')));
backend.add(import('@backstage/plugin-badges-backend'));
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
backend.add(legacyPlugin('todo', import('./plugins/explore')));
backend.add(import('@backstage/plugin-proxy-backend/alpha'));
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-explore/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));
backend.add(import('@backstage/plugin-todo-backend'));

backend.start();