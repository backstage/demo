import { badgesPlugin } from './plugins';

import {
  AlertDisplay,
  OAuthRequestDialog,
  ProxiedSignInPage,
} from '@backstage/core-components';
import { AppRouter, FeatureFlagged, FlatRoutes } from '@backstage/core-app-api';
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
import React from 'react';
import { Root } from './components/Root';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage-community/plugin-tech-radar';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apertureTheme } from './theme/aperture';
import { apis } from './apis';
import { createApp } from '@backstage/app-defaults';
import { entityPage } from './components/catalog/EntityPage';
import { orgPlugin } from '@backstage/plugin-org';
import { searchPage } from './components/search/SearchPage';
import { CssBaseline } from '@material-ui/core';
import { HomepageCompositionRoot, VisitListener } from '@backstage/plugin-home';
import { HomePage } from './components/home/HomePage';
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
import { Mermaid } from 'backstage-plugin-techdocs-addon-mermaid';
import { SignalsDisplay } from '@backstage/plugin-signals';

const app = createApp({
  apis,
  plugins: [badgesPlugin],
  components: {
    SignInPage: props => <ProxiedSignInPage {...props} provider="guest" />,
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(scaffolderPlugin.externalRoutes, {
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(catalogGraphPlugin.externalRoutes, {
      catalogEntity: catalogPlugin.routes.catalogEntity,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
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

const routes = (
  <FlatRoutes>
    <Route path="/" element={<Navigate to="catalog" />} />
    <FeatureFlagged with="customizable-home-page-preview">
      <Route path="/home" element={<HomepageCompositionRoot />}>
        <CustomizableHomePage />
      </Route>
    </FeatureFlagged>
    <FeatureFlagged without="customizable-home-page-preview">
      <Route path="/home" element={<HomepageCompositionRoot />}>
        <HomePage />
      </Route>
    </FeatureFlagged>
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
        <Mermaid />
      </TechDocsAddons>
    </Route>
    ;
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/graphiql" element={<GraphiQLPage />} />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/notifications" element={<NotificationsPage />} />
  </FlatRoutes>
);

export default app.createRoot(
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
