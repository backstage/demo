import {
  createBaseThemeOptions,
  pageTheme as defaultPageThemes,
  PageTheme,
  palettes,
  createUnifiedTheme,
} from '@backstage/theme';

import { alpha } from '@material-ui/core/styles';

const pageThemesFontColorOverride: Record<string, PageTheme> = {};
Object.keys(defaultPageThemes).map(key => {
  pageThemesFontColorOverride[key] = {
    ...defaultPageThemes[key],
    fontColor: '#172B4D',
  };
});

export const apertureTheme = createUnifiedTheme({
  ...createBaseThemeOptions({
    palette: {
      ...palettes.light,
      primary: {
        main: '#0052CC',
        light: '#4C9AFF',
        dark: '#172B4D',
      },
      secondary: {
        main: '#FF5630',
        light: '#FFAB00',
        dark: '#6554C0',
      },
      grey: {
        50: '#C1C7D0',
        100: '#7A869A',
        200: '#6B778C',
        300: '#5E6C84',
        400: '#505F79',
        500: '#42526E',
        600: '#344563',
        700: '#253858',
        800: '#172B4D',
        900: '#091E42',
      },
      error: {
        main: '#FF5630',
        light: '#FF8F73',
        dark: '#DE350B',
      },
      warning: {
        main: '#FFAB00',
        light: '#FFE380',
        dark: '#FF8B00',
      },
      success: {
        main: '#36B37E',
        light: '#79F2C0',
        dark: '#006644',
      },
      info: {
        main: '#0065FF',
        light: '#4C9AFF',
        dark: '#0747A6',
      },
      navigation: {
        ...palettes.light.navigation,
        background: '#172B4D',
        color: '#FFFFFF',
        indicator: '#2684FF',
        navItem: {
          hoverBackground: 'rgba(116,118,121,0.6)',
        },
      },
      text: {
        primary: '#172B48',
      },
      background: {
        default: '#FFFFFF',
      },
    },
  }),
  typography: {
    htmlFontSize: 16,
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: 54,
      fontWeight: 700,
      marginBottom: 10,
    },
    h2: {
      fontSize: 40,
      fontWeight: 700,
      marginBottom: 8,
    },
    h3: {
      fontSize: 32,
      fontWeight: 700,
      marginBottom: 6,
    },
    h4: {
      fontWeight: 700,
      fontSize: 28,
      marginBottom: 6,
    },
    h5: {
      fontWeight: 700,
      fontSize: 24,
      marginBottom: 4,
    },
    h6: {
      fontWeight: 700,
      fontSize: 20,
      marginBottom: 2,
    },
  },
  pageTheme: pageThemesFontColorOverride,
  defaultPageTheme: 'home',
  components: {
    BackstageHeader: {
      styleOverrides: {
        header: ({ theme }) => ({
          backgroundImage: 'unset',
          boxShadow: 'unset',
          paddingBottom: theme.spacing(1),
        }),
        title: ({ theme }) => ({
          color: theme.page.fontColor,
          fontWeight: 900,
        }),
        subtitle: ({ theme }) => ({
          color: alpha(theme.page.fontColor, 0.8),
        }),
        type: ({ theme }) => ({
          color: alpha(theme.page.fontColor, 0.8),
        }),
      },
    },
    BackstageHeaderTabs: {
      styleOverrides: {
        defaultTab: {
          fontSize: 'inherit',
          textTransform: 'none',
        },
      },
    },
    BackstageOpenedDropdown: {
      styleOverrides: {
        icon: {
          '& path': {
            fill: '#FFFFFF',
          },
        },
      },
    },
    BackstageTable: {
      styleOverrides: {
        root: {
          '&> :first-child': {
            borderBottom: '1px solid #D5D5D5',
            boxShadow: 'none',
          },
          '& th': {
            borderTop: 'none',
            textTransform: 'none !important',
          },
        },
      },
    },
    CatalogReactUserListPicker: {
      styleOverrides: {
        title: {
          textTransform: 'none',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        standardError: ({ theme }) => ({
          color: '#FFFFFF',
          backgroundColor: theme.palette.error.dark,
          '& $icon': {
            color: '#FFFFFF',
          },
        }),
        standardInfo: ({ theme }) => ({
          color: '#FFFFFF',
          backgroundColor: theme.palette.primary.dark,
          '& $icon': {
            color: '#FFFFFF',
          },
        }),
        standardSuccess: ({ theme }) => ({
          color: '#FFFFFF',
          backgroundColor: theme.palette.success.dark,
          '& $icon': {
            color: '#FFFFFF',
          },
        }),
        standardWarning: ({ theme }) => ({
          color: theme.palette.grey[700],
          backgroundColor: theme.palette.secondary.light,
          '& $icon': {
            color: theme.palette.grey[700],
          },
        }),
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '&[aria-expanded=true]': {
            backgroundColor: '#26385A',
            color: '#FFFFFF',
          },
          '&[aria-expanded=true] path': {
            fill: '#FFFFFF',
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(9,30,69,0.54)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 3,
          backgroundColor: theme.palette.grey[50],
          color: theme.palette.primary.dark,
          margin: 4,
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          '&[aria-expanded]': {
            backgroundColor: '#26385A',
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 10,
        },
        switchBase: {
          padding: 12,
        },
        thumb: {
          backgroundColor: '#FFFFFF',
          height: 14,
          width: 14,
        },
        track: {
          borderRadius: 9,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          transition: 'none',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        button: {
          textTransform: 'none',
        },
      },
    },
  },
});
