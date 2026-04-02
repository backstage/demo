import {
  Link,
  sidebarConfig,
  useSidebarOpenState,
} from '@backstage/core-components';
import { makeStyles, Theme } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';
import { ApertureLogoFull } from './ApertureLogoFull';
import { ApertureLogoIcon } from './ApertureLogoIcon';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';

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

export const SidebarLogo = () => {
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
        to="/catalog"
        underline="none"
        className={classes.link}
      >
        {isOpen ? fullLogo : iconLogo}
      </Link>
    </div>
  );
};
