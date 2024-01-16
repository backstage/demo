import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  DocsBuildStrategy,
  techdocsBuildsExtensionPoint,
} from '@backstage/plugin-techdocs-node';

export default createBackendModule({
  pluginId: 'techdocs',
  moduleId: 'customBuildStrategy',
  register(env) {
    env.registerInit({
      deps: {
        techdocs: techdocsBuildsExtensionPoint,
      },
      async init({ techdocs }) {
        const docsBuildStrategy: DocsBuildStrategy = {
          shouldBuild: async params =>
            params.entity.metadata?.annotations?.['demo.backstage.io/techdocs-builder'] === 'local',
        };

        techdocs.setBuildStrategy(docsBuildStrategy);
      },
    });
  },
});
