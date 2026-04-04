import { HomePageWidgetBlueprint } from '@backstage/plugin-home-react/alpha';
import homePlugin from '@backstage/plugin-home/alpha';

import { tools } from '../components/home/shared';

// page:home in NFS is already a customizable widget grid. Register the widgets
// that don't have built-in NFS extensions yet, and override the toolkit with
// the app's custom tools.
export const homeWidgetsOverride = homePlugin.withOverrides({
  extensions: [
    // Override home-page-widget:home/toolkit with custom tools
    HomePageWidgetBlueprint.make({
      name: 'toolkit',
      params: {
        components: async () => {
          const { HomePageToolkit } = await import('@backstage/plugin-home');
          return { Content: () => <HomePageToolkit tools={tools} /> };
        },
        layout: { width: { defaultColumns: 4 }, height: { defaultRows: 4 } },
      },
    }),
    HomePageWidgetBlueprint.make({
      name: 'search-bar',
      params: {
        components: async () => {
          const { HomePageSearchBar } =
            await import('@backstage/plugin-search');
          return { Content: HomePageSearchBar };
        },
        layout: { width: { defaultColumns: 24 }, height: { defaultRows: 2 } },
      },
    }),
    HomePageWidgetBlueprint.make({
      name: 'recently-visited',
      params: {
        components: async () => {
          const { HomePageRecentlyVisited } =
            await import('@backstage/plugin-home');
          return { Content: HomePageRecentlyVisited };
        },
        layout: { width: { defaultColumns: 5 }, height: { defaultRows: 4 } },
      },
    }),
    HomePageWidgetBlueprint.make({
      name: 'top-visited',
      params: {
        components: async () => {
          const { HomePageTopVisited } = await import('@backstage/plugin-home');
          return { Content: HomePageTopVisited };
        },
        layout: { width: { defaultColumns: 5 }, height: { defaultRows: 4 } },
      },
    }),
    // TODO(awanlin): HomePageCompanyLogo has no NFS home-page-widget equivalent yet
  ],
});
