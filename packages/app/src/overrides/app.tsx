import { FrontendFeature, PageBlueprint } from '@backstage/frontend-plugin-api';
import { ProxiedSignInPage } from '@backstage/core-components';
import {
  SignInPageBlueprint,
  ThemeBlueprint,
} from '@backstage/plugin-app-react';
import appPlugin from '@backstage/plugin-app';
import { UnifiedThemeProvider } from '@backstage/theme';
import { Navigate } from 'react-router-dom';

import { apertureTheme } from '../theme/aperture';
import { apertureBuiCss } from '../theme/apertureBui';

const proxiedSignInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props => (
      <ProxiedSignInPage {...props} provider="guest" />
    ),
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
          {/* BUI variables scoped to this theme — injected only while aperture is active */}
          <style>{apertureBuiCss}</style>
          {children}
        </UnifiedThemeProvider>
      ),
    },
  },
});

export const appOverride: FrontendFeature = appPlugin.withOverrides({
  extensions: [
    PageBlueprint.make({
      name: 'root-redirect',
      params: {
        path: '/',
        loader: async () => <Navigate to="/catalog" replace />,
      },
    }),
    proxiedSignInPage,
    apertureThemeExtension,
  ],
});
