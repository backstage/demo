import { useApi } from '@backstage/core-plugin-api';
import { dialogApiRef } from '@backstage/frontend-plugin-api';
import { EntityContextMenuItemBlueprint } from '@backstage/plugin-catalog-react/alpha';
import {
  useEntity,
  AsyncEntityProvider,
} from '@backstage/plugin-catalog-react';
import { EntityBadgesDialog } from '@backstage-community/plugin-badges';
import { RiMedalLine } from '@remixicon/react';

export const badgesContextMenuItem = EntityContextMenuItemBlueprint.make({
  name: 'badges',
  params: {
    icon: <RiMedalLine size={16} />,
    useProps: () => {
      const dialogApi = useApi(dialogApiRef);
      const { entity } = useEntity();
      return {
        title: 'Badges',
        onClick: async () => {
          dialogApi.showModal(({ dialog }) => (
            <AsyncEntityProvider entity={entity} loading={false}>
              <EntityBadgesDialog open onClose={() => dialog.close()} />
            </AsyncEntityProvider>
          ));
        },
      };
    },
  },
});
