import { SubPageBlueprint } from '@backstage/frontend-plugin-api';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';

// Add NotificationSettings as a sub-page under user-settings
export const userSettingsOverride = userSettingsPlugin.withOverrides({
  extensions: [
    SubPageBlueprint.make({
      name: 'notifications',
      params: {
        path: 'notifications',
        title: 'Notifications',
        loader: async () => {
          const { NotificationSettings } =
            await import('../components/settings/NotificationSettings');
          return <NotificationSettings />;
        },
      },
    }),
  ],
});
