import { FrontendFeature } from '@backstage/frontend-plugin-api';
import catalogPlugin from '@backstage/plugin-catalog/alpha';

import { entityOverviewLayoutExtension } from '../components/catalog/EntityOverviewLayout';
import { badgesContextMenuItem } from './badges';

export const catalogNavItemOverride: FrontendFeature =
  catalogPlugin.withOverrides({
    extensions: [entityOverviewLayoutExtension, badgesContextMenuItem],
  });
