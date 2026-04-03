import { Box, Button, Grid, Text } from '@backstage/ui';
import {
  configApiRef,
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';

import { InfoCard } from '@backstage/core-components';

import { UserNotificationSettingsCard } from '@backstage/plugin-notifications';

export const NotificationSettings = () => {
  const config = useApi(configApiRef);
  const fetchApi = useApi(fetchApiRef);
  const discovery = useApi(discoveryApiRef);
  const errorApi = useApi(errorApiRef);

  const isEnabled =
    config.getOptionalBoolean('notificationsTester.enabled') ?? true;

  const handleNotifyClick = async () => {
    const notificationTesterUrl = await discovery.getBaseUrl(
      'notifications-tester',
    );
    const response = await fetchApi.fetch(`${notificationTesterUrl}/test`, {
      method: 'POST',
    });
    if (!response.ok) {
      errorApi.post(
        new Error(`Failed to send notification: ${response.status}`),
      );
    }
  };

  return (
    <Box pt="3" px="3">
      <Grid.Root columns="12" gap="2">
        <Grid.Item colSpan="9">
          <UserNotificationSettingsCard
            originNames={{ 'plugin:scaffolder': 'Scaffolder' }}
          />
        </Grid.Item>
        {isEnabled && (
          <Grid.Item colSpan="3">
            <InfoCard title="Send Test Notification">
              <Button
                variant="primary"
                onPress={() => void handleNotifyClick()}
              >
                Notify
              </Button>
              <Box pt="2">
                <Text variant="body-small">
                  Note: this card is not part of the default Notifications
                  Setting and was added to be able to try out the Notification
                  system for this Demo site.
                </Text>
              </Box>
            </InfoCard>
          </Grid.Item>
        )}
      </Grid.Root>
    </Box>
  );
};
