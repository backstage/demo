import { badgesPlugin } from './plugins';

import { ProxiedSignInPage } from '@backstage/core-components';
import { FlatRoutes } from '@backstage/core-app-api';
import { CatalogIndexPage, catalogPlugin } from '@backstage/plugin-catalog';
import { default as alphaCatalogPlugin } from '@backstage/plugin-catalog/alpha';
import { catalogGraphPlugin } from '@backstage/plugin-catalog-graph';
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

import { GraphiQLPage } from '@backstage-community/plugin-graphiql';

import {
  SettingsLayout,
  UserSettingsPage,
} from '@backstage/plugin-user-settings';
import { apertureTheme } from './theme/aperture';
import { apis } from './apis';

import { orgPlugin } from '@backstage/plugin-org';

import { CssBaseline } from '@material-ui/core';
import { HomepageCompositionRoot, VisitListener } from '@backstage/plugin-home';
import { CustomizableHomePage } from './components/home/CustomizableHomePage';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import {
  ExpandableNavigation,
  LightBox,
  ReportIssue,
  TextSize,
} from '@backstage/plugin-techdocs-module-addons-contrib';
import { Mermaid } from 'backstage-plugin-techdocs-addon-mermaid';
import { SignalsDisplay } from '@backstage/plugin-signals';
import { NotificationSettings } from './components/settings/NotificationSettings';

// New Frontend System Imports
import { createApp } from '@backstage/frontend-defaults';
import {
  compatWrapper,
  convertLegacyApp,
  convertLegacyAppOptions,
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';
import {
  AppRootElementBlueprint,
  createFrontendModule,
  SignInPageBlueprint,
  ThemeBlueprint,
} from '@backstage/frontend-plugin-api';
import { rootNav } from './components/Root';
import {
  EntityKindPicker,
  EntityTypePicker,
  UserListPicker,
  EntityOwnerPicker,
  EntityLifecyclePicker,
  EntityTagPicker,
  EntityProcessingStatusPicker,
  EntityNamespacePicker,
} from '@backstage/plugin-catalog-react';

const routes = (
  <FlatRoutes>
    <Route path="/" element={<Navigate to="catalog" />} />
    <Route path="/home" element={<HomepageCompositionRoot />}>
      <CustomizableHomePage />
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
        <Mermaid />
      </TechDocsAddons>
    </Route>

    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/graphiql" element={<GraphiQLPage />} />

    <Route path="/settings" element={<UserSettingsPage />}>
      <SettingsLayout.Route path="/notifications" title="Notifications">
        <NotificationSettings />
      </SettingsLayout.Route>
    </Route>
  </FlatRoutes>
);

const legacyFeatures = convertLegacyApp(routes);

const signalsDisplayExtension = AppRootElementBlueprint.make({
  name: 'signals-display-extension',
  params: {
    element: compatWrapper(<SignalsDisplay />),
  },
});

const visitListenerExtension = AppRootElementBlueprint.make({
  name: 'visit-listener-extension',
  params: {
    element: <VisitListener />,
  },
});

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
        <UnifiedThemeProvider theme={apertureTheme} noCssBaseline>
          <CssBaseline />
          {children}
        </UnifiedThemeProvider>
      ),
    },
  },
});

const catalogPluginOverride = alphaCatalogPlugin.withOverrides({
  extensions: [
    alphaCatalogPlugin.getExtension('page:catalog').override({
      params: {
        loader: async () =>
          compatWrapper(
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
            />,
          ),
      },
    }),
  ],
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
        rootNav,
        signalsDisplayExtension,
        visitListenerExtension,
      ],
    }),
    catalogPluginOverride,
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
