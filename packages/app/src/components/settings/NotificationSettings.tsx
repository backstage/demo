import { Box, Button, Grid, Typography } from '@material-ui/core';
import {
  configApiRef,
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';

import { InfoCard } from '@backstage/core-components';
import React from 'react';
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
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={9}>
        <UserNotificationSettingsCard
          originNames={{ 'plugin:scaffolder': 'Scaffolder' }}
        />
      </Grid>
      {isEnabled && (
        <Grid item xs={3}>
          <InfoCard title="Send Test Notification">
            <Button
              variant="contained"
              color="primary"
              onClick={async () => await handleNotifyClick()}
            >
              Notify
            </Button>
            <Box pt={2}>
              <Typography variant="subtitle2">
                Note: this card is not part of the default Notifications Setting
                and was added to be able to try out the Notification system for
                this Demo site.
              </Typography>
            </Box>
          </InfoCard>
        </Grid>
      )}
    </Grid>
  );
};
