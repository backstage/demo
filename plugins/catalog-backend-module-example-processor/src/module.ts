import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { ExampleProcessor } from './processor/ExampleProcessor';

export const catalogModuleExampleProcessor = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'example-processor',
  register(reg) {
    reg.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ catalog }) {
        catalog.addProcessor(new ExampleProcessor());
      },
    });
  },
});
