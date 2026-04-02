import catalogPlugin from '@backstage/plugin-catalog/alpha';

import { entityOverviewLayoutExtension } from '../components/catalog/EntityOverviewLayout';
import { badgesContextMenuItem } from './badges';

export const catalogNavItemOverride = catalogPlugin.withOverrides({
  extensions: [entityOverviewLayoutExtension, badgesContextMenuItem],
});
