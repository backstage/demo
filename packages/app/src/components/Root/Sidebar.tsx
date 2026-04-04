import {
  Sidebar,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarScrollWrapper,
  SidebarSpace,
} from '@backstage/core-components';
import { NavContentBlueprint } from '@backstage/plugin-app-react';
import { SidebarSearchModal } from '@backstage/plugin-search';
import { UserSettingsSignInAvatar } from '@backstage/plugin-user-settings';
import { MyGroupsSidebarItem } from '@backstage/plugin-org';
import { SidebarLogo } from './SidebarLogo';
import {
  RiExchangeLine,
  RiGroupLine,
  RiMenuLine,
  RiSearchLine,
} from '@remixicon/react';

const MuiToBuiIcon = () => <RiExchangeLine size={20} />;
const GroupIcon = () => <RiGroupLine size={20} />;

export const SidebarContent = NavContentBlueprint.make({
  params: {
    component: ({ navItems }) => {
      const nav = navItems.withComponent(item => (
        <SidebarItem icon={() => item.icon} to={item.href} text={item.title} />
      ));

      nav.take('page:search'); // Using search modal instead
      nav.take('page:cost-insights'); // Removed from sidebar
      nav.take('page:graphiql'); // Removed from sidebar
      nav.take('page:kubernetes'); // Removed from sidebar
      nav.take('page:catalog-graph'); // Removed from sidebar

      return (
        <Sidebar>
          <SidebarLogo />
          <SidebarGroup label="Search" icon={<RiSearchLine />} to="/search">
            <SidebarSearchModal />
          </SidebarGroup>
          <SidebarDivider />
          <SidebarGroup label="Menu" icon={<RiMenuLine />}>
            {nav.take('page:home')}
            {nav.take('page:catalog')}
            <MyGroupsSidebarItem
              singularTitle="My Group"
              pluralTitle="My Groups"
              icon={GroupIcon}
            />
            {nav.take('page:api-docs')}
            {nav.take('page:techdocs')}
            {nav.take('page:scaffolder')}
            {nav.take('page:explore')}
            <SidebarDivider />
            <SidebarScrollWrapper>
              {nav.take('page:tech-radar')}
              <SidebarItem
                icon={MuiToBuiIcon}
                to="/mui-to-bui"
                text="MUI to BUI"
              />
              {nav.rest({ sortBy: 'title' })}
            </SidebarScrollWrapper>
          </SidebarGroup>
          <SidebarSpace />
          <SidebarDivider />
          {nav.take('page:notifications')}
          <SidebarDivider />
          <SidebarGroup
            label="Settings"
            icon={<UserSettingsSignInAvatar />}
            to="/settings"
          >
            {nav.take('page:user-settings')}
          </SidebarGroup>
        </Sidebar>
      );
    },
  },
});
