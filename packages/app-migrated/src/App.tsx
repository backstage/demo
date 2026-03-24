import { createApp } from '@backstage/frontend-defaults';
import { convertLegacyPlugin } from '@backstage/core-compat-api';
import {
  techDocsExpandableNavigationAddonModule,
  techDocsLightBoxAddonModule,
  techDocsReportIssueAddonModule,
  techDocsTextSizeAddonModule,
} from '@backstage/plugin-techdocs-module-addons-contrib/alpha';
import { badgesPlugin } from '@backstage-community/plugin-badges';

import { navModule } from './components/Root';
import { appOverride } from './overrides/app';
import { catalogNavItemOverride } from './overrides/catalog';
import { graphiqlOverride } from './overrides/graphiql';
import { homeWidgetsOverride } from './overrides/home';
import { userSettingsOverride } from './overrides/userSettings';

const convertedBadgesPlugin = convertLegacyPlugin(badgesPlugin, {
  extensions: [],
});

const app = createApp({
  features: [
    // App-level extensions
    appOverride,
    convertedBadgesPlugin,
    // TechDocs addon modules have no default export so won't be auto-discovered
    techDocsExpandableNavigationAddonModule,
    techDocsLightBoxAddonModule,
    techDocsReportIssueAddonModule,
    techDocsTextSizeAddonModule,
    // Nav module
    navModule,
    catalogNavItemOverride,
    graphiqlOverride,
    // Custom page overrides
    homeWidgetsOverride,
    userSettingsOverride,
  ],
});

export default app.createRoot();
