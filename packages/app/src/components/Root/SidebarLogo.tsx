import {
  Link,
  sidebarConfig,
  useSidebarOpenState,
} from '@backstage/core-components';
import { NavLink } from 'react-router-dom';
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';
import { ApertureLogoFull } from './ApertureLogoFull';
import { ApertureLogoIcon } from './ApertureLogoIcon';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import styles from './SidebarLogo.module.css';

export const SidebarLogo = () => {
  const { isOpen } = useSidebarOpenState();
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = appThemeApi.getActiveThemeId();

  const fullLogo = themeId === 'aperture' ? <ApertureLogoFull /> : <LogoFull />;
  const iconLogo = themeId === 'aperture' ? <ApertureLogoIcon /> : <LogoIcon />;

  return (
    <div
      className={styles.root}
      style={{
        width: sidebarConfig.drawerWidthClosed,
        height: 3 * sidebarConfig.logoHeight,
      }}
    >
      <Link
        component={NavLink}
        to="/catalog"
        underline="none"
        style={{
          width: sidebarConfig.drawerWidthClosed,
          marginLeft: themeId === 'aperture' ? 15 : 24,
        }}
      >
        {isOpen ? fullLogo : iconLogo}
      </Link>
    </div>
  );
};
