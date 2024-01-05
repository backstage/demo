import * as plugins from './plugins';

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
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
} from '@backstage/plugin-cost-insights';
import { ExplorePage } from '@backstage/plugin-explore';
import { Navigate, Route } from 'react-router';
import {
  TechDocsIndexPage,
  TechDocsReaderPage,
  techdocsPlugin,
} from '@backstage/plugin-techdocs';
import { UnifiedThemeProvider, themes } from '@backstage/theme';

import { ApiExplorerPage } from '@backstage/plugin-api-docs';
import { GraphiQLPage } from '@backstage/plugin-graphiql';
import React from 'react';
import { Root } from './components/Root';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apertureTheme } from './theme/aperture';
import { apis } from './apis';
import { createApp } from '@backstage/app-defaults';
import { entityPage } from './components/catalog/EntityPage';
import { orgPlugin } from '@backstage/plugin-org';
import { searchPage } from './components/search/SearchPage';
import CssBaseline from '@mui/material/CssBaseline';
import { HomepageCompositionRoot, VisitListener } from '@backstage/plugin-home';
import { HomePage } from './components/home/HomePage';
import { CustomizableHomePage } from './components/home/CustomizableHomePage';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
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
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/catalog"
      element={<CatalogIndexPage initiallySelectedFilter="all" />}
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
    />
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
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <VisitListener />
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
