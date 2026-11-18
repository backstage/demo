import { sidebarConfig, useSidebarOpenState } from '@backstage/core-components';
import { Link } from '@backstage/ui';
import { coreApis, useApi } from '@backstage/frontend-plugin-api';
import { ApertureLogoFull } from './ApertureLogoFull';
import { ApertureLogoIcon } from './ApertureLogoIcon';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import styles from './SidebarLogo.module.css';

export const SidebarLogo = () => {
  const { isOpen } = useSidebarOpenState();
  const appThemeApi = useApi(coreApis.appTheme);
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
        href="/catalog"
        standalone
        aria-label="Home"
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
