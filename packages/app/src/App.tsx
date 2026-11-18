import { createApp } from '@backstage/frontend-defaults';
import { convertLegacyPlugin } from '@backstage/core-compat-api';
import { badgesPlugin } from '@backstage-community/plugin-badges';

import { navModule } from './components/Root';
import { appOverride } from './overrides/app';
import { catalogNavItemOverride } from './overrides/catalog';
import { appModuleHome } from './overrides/home';
import { userSettingsOverride } from './overrides/userSettings';

const convertedBadgesPlugin = convertLegacyPlugin(badgesPlugin, {
  extensions: [],
});

const app = createApp({
  features: [
    // App-level extensions
    appOverride,
    convertedBadgesPlugin,
    // Nav module
    navModule,
    catalogNavItemOverride,
    // Custom page overrides
    appModuleHome,
    userSettingsOverride,
  ],
});

export default app.createRoot();
