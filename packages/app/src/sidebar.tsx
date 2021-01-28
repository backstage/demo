import React, { FC, useContext } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import MapIcon from '@material-ui/icons/MyLocation';
import MoneyIcon from '@material-ui/icons/MonetizationOn';
import { Link, makeStyles } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import { Settings as SidebarSettings } from '@backstage/plugin-user-settings';
import { graphiQLRouteRef } from '@backstage/plugin-graphiql';
import {
  Sidebar,
  SidebarItem,
  SidebarDivider,
  sidebarConfig,
  SidebarContext,
  SidebarSpace,
} from '@backstage/core';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo: FC<{}> = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useContext(SidebarContext);

  return (
    <div className={classes.root}>
      <Link
        component={NavLink}
        to="/"
        underline="none"
        className={classes.link}
      >
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const AppSidebar = () => (
  <Sidebar>
    <SidebarLogo />
    <SidebarDivider />
    {/* Global nav, not org-specific */}
    <SidebarItem icon={HomeIcon} to="./" text="Home" />
    <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
    <SidebarDivider />
    <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
    <SidebarItem
      icon={graphiQLRouteRef.icon!}
      to={graphiQLRouteRef.path}
      text={graphiQLRouteRef.title}
    />
    <SidebarItem icon={MoneyIcon} to="cost-insights" text="Cost Insights" />
    {/* End global nav */}
    <SidebarDivider />
    <SidebarSpace />
    <SidebarDivider />
    <SidebarSettings />
  </Sidebar>
);
