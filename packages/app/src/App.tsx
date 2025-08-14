import { badgesPlugin } from './plugins';
// import {
//   CostInsightsLabelDataflowInstructionsPage,
//   CostInsightsPage,
//   CostInsightsProjectGrowthInstructionsPage,
// } from '@backstage-community/plugin-cost-insights';
import { default as catalogPluginAlpha } from '@backstage/plugin-catalog/alpha';
import { ExplorePage } from '@backstage-community/plugin-explore';
import { AppRouter, FeatureFlagged, FlatRoutes } from '@backstage/core-app-api';
import {
  AlertDisplay,
  OAuthRequestDialog,
  ProxiedSignInPage,
} from '@backstage/core-components';
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
  TechDocsIndexPage,
  TechDocsReaderPage,
  techdocsPlugin,
} from '@backstage/plugin-techdocs';
import { UnifiedThemeProvider, themes } from '@backstage/theme';
import { Navigate, Route } from 'react-router';

import { GraphiQLPage } from '@backstage-community/plugin-graphiql';
import { ApiExplorerPage } from '@backstage/plugin-api-docs';

import { TechRadarPage } from '@backstage-community/plugin-tech-radar';
import {
  compatWrapper,
  convertLegacyApp,
  convertLegacyAppOptions,
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';
import { createApp } from '@backstage/frontend-defaults';
import {
  EntityKindPicker,
  EntityLifecyclePicker,
  EntityNamespacePicker,
  EntityOwnerPicker,
  EntityProcessingStatusPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { HomepageCompositionRoot, VisitListener } from '@backstage/plugin-home';
import { NotificationsPage } from '@backstage/plugin-notifications';
import { orgPlugin } from '@backstage/plugin-org';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { SearchPage } from '@backstage/plugin-search';
import { SignalsDisplay } from '@backstage/plugin-signals';
import {
  ExpandableNavigation,
  LightBox,
  ReportIssue,
  TextSize,
} from '@backstage/plugin-techdocs-module-addons-contrib';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import {
  SettingsLayout,
  UserSettingsPage,
} from '@backstage/plugin-user-settings';
import { CssBaseline } from '@material-ui/core';
import { Mermaid } from 'backstage-plugin-techdocs-addon-mermaid';
import { apis } from './apis';
import { Root } from './components/Root';
import { entityPage } from './components/catalog/EntityPage';
import { CustomizableHomePage } from './components/home/CustomizableHomePage';
import { HomePage } from './components/home/HomePage';
import { searchPage } from './components/search/SearchPage';
import { NotificationSettings } from './components/settings/NotificationSettings';
import { apertureTheme } from './theme/aperture';
import {
  NavContentBlueprint,
  coreExtensionData,
  createExtension,
  createFrontendModule,
} from '@backstage/frontend-plugin-api';
import { Sidebar2 } from './components/Root/Root';

const routes = (
  <FlatRoutes>
    <Route path="/" element={<Navigate to="catalog" />} />
    <Route path="/home" element={<HomepageCompositionRoot />}>
      <HomePage />
    </Route>

    {/* <Route path="/create" element={<ScaffolderPage />} /> */}
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    {/* <Route
      path="/catalog"
      element={
        <CatalogIndexPage
          filters={
            <>
              <EntityKindPicker />
              <EntityTypePicker />
              <UserListPicker initialFilter="all" />
              <EntityOwnerPicker />
              <EntityLifecyclePicker
                initialFilter={['production', 'experimental']}
              />
              <EntityTagPicker />
              <EntityProcessingStatusPicker />
              <EntityNamespacePicker />
            </>
          }
        />
      }
    />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route> */}
    {/* <Route path="/cost-insights" element={<CostInsightsPage />} />
    <Route
      path="/cost-insights/investigating-growth"
      element={<CostInsightsProjectGrowthInstructionsPage />}
    />
    <Route
      path="/cost-insights/labeling-jobs"
      element={<CostInsightsLabelDataflowInstructionsPage />}
    /> */}

    {/* <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ExpandableNavigation />
        <LightBox />
        <ReportIssue />
        <TextSize />
        <Mermaid />
      </TechDocsAddons>
    </Route> */}
    {/* <Route path="/explore" element={<ExplorePage />} /> */}
    {/* <Route path="/graphiql" element={<GraphiQLPage />} /> */}
    {/* <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route> */}
    <Route path="/settings" element={<UserSettingsPage />}>
      <SettingsLayout.Route path="/notifications" title="Notifications">
        <NotificationSettings />
      </SettingsLayout.Route>
    </Route>
    {/* <Route path="/tech-radar" element={<TechRadarPage />} /> */}
    {/* <Route path="/catalog-graph" element={<CatalogGraphPage />} /> */}
    {/* <Route path="/notifications" element={<NotificationsPage />} /> */}
  </FlatRoutes>
);

const legacyFeatures = convertLegacyApp(routes, { entityPage });
// const legacyFeatures = convertLegacyApp(
//   <>
//     <AlertDisplay />
//     <OAuthRequestDialog />
//     <SignalsDisplay />
//     <AppRouter>
//       <VisitListener />
//       <Root>{routes}</Root>
//     </AppRouter>
//   </>,
// );

const optionsModule = convertLegacyAppOptions({
  apis,
  plugins: [badgesPlugin],
  components: {
    SignInPage: props => <ProxiedSignInPage {...props} provider="guest" />,
  },
  themes: [
    {
      id: 'light',
      title: 'Light',
      variant: 'light',
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={themes.light} children={children} />
      ),
    },
    {
      id: 'dark',
      title: 'Dark',
      variant: 'dark',
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={themes.dark} children={children} />
      ),
    },
    {
      id: 'aperture',
      title: 'Aperture',
      variant: 'light',
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={apertureTheme} noCssBaseline>
          <CssBaseline />
          {children}
        </UnifiedThemeProvider>
      ),
    },
  ],
});

const mod = createFrontendModule({
  pluginId: 'app',
  extensions: [
    NavContentBlueprint.make({
      params: {
        component: props => compatWrapper(<Sidebar2 items={props.items} />),
      },
    }),
  ],
});

const app = createApp({
  features: [catalogPluginAlpha, optionsModule, mod, ...legacyFeatures],
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
