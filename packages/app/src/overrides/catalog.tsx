import { FrontendFeature } from '@backstage/frontend-plugin-api';
import catalogPlugin from '@backstage/plugin-catalog/alpha';

import { badgesContextMenuItem } from './badges';

export const catalogNavItemOverride: FrontendFeature =
  catalogPlugin.withOverrides({
    extensions: [badgesContextMenuItem],
  });
