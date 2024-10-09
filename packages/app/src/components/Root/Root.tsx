import React, { PropsWithChildren } from 'react';
import Link from '@mui/material/Link';
import makeStyles from '@mui/styles/makeStyles';
import HomeIcon from '@mui/icons-material/Home';
import ExtensionIcon from '@mui/icons-material/Extension';
import MapIcon from '@mui/icons-material/MyLocation';
import LayersIcon from '@mui/icons-material/Layers';
import LibraryBooks from '@mui/icons-material/LibraryBooks';
import CreateComponentIcon from '@mui/icons-material/AddCircleOutline';
import MoneyIcon from '@mui/icons-material/MonetizationOn';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import { NavLink } from 'react-router-dom';
import { GraphiQLIcon } from '@backstage-community/plugin-graphiql';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  SidebarPage,
  sidebarConfig,
  SidebarItem,
  SidebarDivider,
  SidebarSpace,
  SidebarGroup,
  useSidebarOpenState,
} from '@backstage/core-components';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';
import { ApertureLogoFull } from './ApertureLogoFull';
import { ApertureLogoIcon } from './ApertureLogoIcon';
import CategoryIcon from '@mui/icons-material/Category';
import { MyGroupsSidebarItem } from '@backstage/plugin-org';
import GroupIcon from '@mui/icons-material/People';
import { NotificationsSidebarItem } from '@backstage/plugin-notifications';
import { Theme } from '@mui/material/styles';

const useSidebarLogoStyles = makeStyles<Theme, { themeId: string }>({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: props => ({
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: props.themeId === 'aperture' ? 15 : 24,
  }),
});

const SidebarLogo = () => {
  const { isOpen } = useSidebarOpenState();

  const appThemeApi = useApi(appThemeApiRef);
  const themeId = appThemeApi.getActiveThemeId();
  const classes = useSidebarLogoStyles({ themeId: themeId! });

  const fullLogo = themeId === 'aperture' ? <ApertureLogoFull /> : <LogoFull />;
  const iconLogo = themeId === 'aperture' ? <ApertureLogoIcon /> : <LogoIcon />;

  return (
    <div className={classes.root}>
      <Link
        component={NavLink}
        to="/"
        underline="none"
        className={classes.link}
      >
        {isOpen ? fullLogo : iconLogo}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
        <SidebarSearchModal />
      </SidebarGroup>
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarItem icon={HomeIcon} to="home" text="Home" />
        <SidebarItem icon={CategoryIcon} to="/" text="Catalog" />
        <MyGroupsSidebarItem
          singularTitle="My Group"
          pluralTitle="My Groups"
          icon={GroupIcon}
        />
        <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
        <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
        <SidebarItem icon={LayersIcon} to="explore" text="Explore" />
      </SidebarGroup>
      <SidebarDivider />
      <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
      <SidebarItem icon={MoneyIcon} to="cost-insights" text="Cost Insights" />
      <SidebarItem icon={GraphiQLIcon} to="graphiql" text="GraphiQL" />
      <SidebarSpace />
      <SidebarDivider />
      <NotificationsSidebarItem />
      <SidebarDivider />
      <SidebarGroup
        label="Settings"
        icon={<UserSettingsSignInAvatar />}
        to="/settings"
      >
        <SidebarSettings />
      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
);
