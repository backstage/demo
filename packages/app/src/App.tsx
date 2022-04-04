import React from 'react';
import { Navigate, Route } from 'react-router';
import { ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  catalogPlugin,
  CatalogEntityPage,
  CatalogIndexPage,
} from '@backstage/plugin-catalog';
import {
  CostInsightsLabelDataflowInstructionsPage,
  CostInsightsPage,
  CostInsightsProjectGrowthInstructionsPage,
} from '@backstage/plugin-cost-insights';
import { explorePlugin, ExplorePage } from '@backstage/plugin-explore';
import { GraphiQLPage } from '@backstage/plugin-graphiql';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import {
  CatalogGraphPage,
  catalogGraphPlugin,
} from '@backstage/plugin-catalog-graph';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { Root } from './components/Root';
import { searchPage } from './components/search/SearchPage';
import * as plugins from './plugins';

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { FlatRoutes } from '@backstage/core-app-api';
import { createApp } from '@backstage/app-defaults';
import { orgPlugin } from '@backstage/plugin-org';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { apertureTheme } from './theme/aperture';
import { darkTheme, lightTheme } from '@backstage/theme';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  bindRoutes({ bind }) {
    bind(explorePlugin.externalRoutes, {
      catalogEntity: catalogPlugin.routes.catalogEntity,
    });
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
        <ThemeProvider theme={lightTheme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
    {
      id: 'dark',
      title: 'Dark',
      variant: 'dark',
      Provider: ({ children }) => (
        <ThemeProvider theme={darkTheme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
    {
      id: 'aperture',
      title: 'Aperture',
      variant: 'light',
      Provider: ({ children }) => (
        <ThemeProvider theme={apertureTheme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      ),
    },
  ],
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = (
  <FlatRoutes>
    <Navigate key="/" to="catalog" replace />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
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

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
);

export default App;
