import { badgesPlugin } from './plugins';

import {
  AlertDisplay,
  OAuthRequestDialog,
  ProxiedSignInPage,
} from '@backstage/core-components';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogGraphPage,
  catalogGraphPlugin,
} from '@backstage/plugin-catalog-graph';
import {
  CostInsightsLabelDataflowInstructionsPage,
  CostInsightsPage,
  CostInsightsProjectGrowthInstructionsPage,
} from '@backstage-community/plugin-cost-insights';
import { ExplorePage } from '@backstage-community/plugin-explore';
import { Navigate, Route } from 'react-router';
import {
  TechDocsIndexPage,
  TechDocsReaderPage,
  techdocsPlugin,
} from '@backstage/plugin-techdocs';
import { UnifiedThemeProvider, themes } from '@backstage/theme';

import { ApiExplorerPage } from '@backstage/plugin-api-docs';
import { GraphiQLPage } from '@backstage-community/plugin-graphiql';

import { Root } from './components/Root';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage-community/plugin-tech-radar';
import {
  SettingsLayout,
  UserSettingsPage,
} from '@backstage/plugin-user-settings';
import { apertureTheme } from './theme/aperture';
import { apis } from './apis';

import { entityPage } from './components/catalog/EntityPage';
import { orgPlugin } from '@backstage/plugin-org';
import { searchPage } from './components/search/SearchPage';
import { HomepageCompositionRoot, VisitListener } from '@backstage/plugin-home';
import { CustomizableHomePage } from './components/home/CustomizableHomePage';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { NotificationsPage } from '@backstage/plugin-notifications';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import {
  ExpandableNavigation,
  LightBox,
  ReportIssue,
  TextSize,
} from '@backstage/plugin-techdocs-module-addons-contrib';
// TODO:(awanlin) enabled once TypeScript errors are resolved
// https://github.com/johanneswuerbach/backstage-plugin-techdocs-addon-mermaid/issues/78
// import { Mermaid } from 'backstage-plugin-techdocs-addon-mermaid';
import { SignalsDisplay } from '@backstage/plugin-signals';
import { NotificationSettings } from './components/settings/NotificationSettings';

// New Frontend System Imports
import { createApp } from '@backstage/frontend-defaults';
import {
  convertLegacyAppRoot,
  convertLegacyAppOptions,
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';
import { createFrontendModule } from '@backstage/frontend-plugin-api';

import {
  SignInPageBlueprint,
  ThemeBlueprint,
} from '@backstage/plugin-app-react';

const routes = (
  <FlatRoutes>
    <Route path="/" element={<Navigate to="catalog" />} />
    <Route path="/home" element={<HomepageCompositionRoot />}>
      <CustomizableHomePage />
    </Route>
    {/* <FeatureFlagged with="customizable-home-page-preview">
      <Route path="/home" element={<HomepageCompositionRoot />}>
        <CustomizableHomePage />
      </Route>
    </FeatureFlagged>
    <FeatureFlagged without="customizable-home-page-preview">
      <Route path="/home" element={<HomepageCompositionRoot />}>
        <HomePage />
      </Route>
    </FeatureFlagged> */}
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/catalog"
      element={
        <CatalogIndexPage
          initiallySelectedFilter="all"
          initiallySelectedNamespaces={['default']}
        />
      }
    />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/cost-insights" element={<CostInsightsPage />} />
    <Route
      path="/cost-insights/investigating-growth"
      element={<CostInsightsProjectGrowthInstructionsPage />}
    />
    <Route
      path="/cost-insights/labeling-jobs"
      element={<CostInsightsLabelDataflowInstructionsPage />}
    />
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ExpandableNavigation />
        <LightBox />
        <ReportIssue />
        <TextSize />
      </TechDocsAddons>
    </Route>

    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/graphiql" element={<GraphiQLPage />} />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />}>
      <SettingsLayout.Route path="/notifications" title="Notifications">
        <NotificationSettings />
      </SettingsLayout.Route>
    </Route>
    <Route path="/tech-radar" element={<TechRadarPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/notifications" element={<NotificationsPage />} />
  </FlatRoutes>
);

const legacyFeatures = convertLegacyAppRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <SignalsDisplay />
    <AppRouter>
      <VisitListener />
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);

const optionsModule = convertLegacyAppOptions({
  // TODO:(awanlin) the badges plugin doesn't support the new frontend system yet
  plugins: [badgesPlugin],
});

const proxiedSignInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props => (
      <ProxiedSignInPage {...props} provider="guest" />
    ),
  },
});

const lightThemeExtension = ThemeBlueprint.make({
  name: 'light',
  params: {
    theme: {
      id: 'light',
      title: 'Light',
      variant: 'light',
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={themes.light} children={children} />
      ),
    },
  },
});

const darkThemeExtension = ThemeBlueprint.make({
  name: 'dark',
  params: {
    theme: {
      id: 'dark',
      title: 'Dark',
      variant: 'dark',
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={themes.dark} children={children} />
      ),
    },
  },
});

const apertureThemeExtension = ThemeBlueprint.make({
  name: 'aperture',
  params: {
    theme: {
      id: 'aperture',
      title: 'Aperture',
      variant: 'light',
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={apertureTheme}>
          {children}
        </UnifiedThemeProvider>
      ),
    },
  },
});

const app = createApp({
  features: [
    optionsModule,
    ...legacyFeatures,
    createFrontendModule({
      pluginId: 'app',
      extensions: [
        ...apis,
        proxiedSignInPage,
        lightThemeExtension,
        darkThemeExtension,
        apertureThemeExtension,
      ],
    }),
  ],
  bindRoutes({ bind }) {
    bind(convertLegacyRouteRefs(catalogPlugin.externalRoutes), {
      createComponent: convertLegacyRouteRef(scaffolderPlugin.routes.root),
      viewTechDoc: convertLegacyRouteRef(techdocsPlugin.routes.docRoot),
      createFromTemplate: convertLegacyRouteRef(
        scaffolderPlugin.routes.selectedTemplate,
      ),
    });
    bind(convertLegacyRouteRefs(scaffolderPlugin.externalRoutes), {
      viewTechDoc: convertLegacyRouteRef(techdocsPlugin.routes.docRoot),
    });
    bind(convertLegacyRouteRefs(catalogGraphPlugin.externalRoutes), {
      catalogEntity: convertLegacyRouteRef(catalogPlugin.routes.catalogEntity),
    });
    bind(convertLegacyRouteRefs(orgPlugin.externalRoutes), {
      catalogIndex: convertLegacyRouteRef(catalogPlugin.routes.catalogIndex),
    });
  },
});

export default app.createRoot();
