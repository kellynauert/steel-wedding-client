import { createMuiTheme } from '@material-ui/core/styles';
import NimbusRoman from './fonts/NimbusRomNo9L-Reg-webfont.woff';
import NimbusRomanItalic from './fonts/NimbusRomNo9L-RegIta-webfont.woff';
import NimbusRomanBold from './fonts/NimbusRomNo9L-Med-webfont.woff';
import NimbusRomanItalicBold from './fonts/NimbusRomNo9L-MedIta-webfont.woff';
import Notera from './fonts/Notera_PersonalUseOnly.woff';

import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
} from '@material-ui/core/colors';

const notera = {
  fontFamily: 'Notera',
  src: `
   local('Notera'),
    local('Notera Personal Use Only'),
    url(${Notera}) format('woff')
  `,
};
const nimbusRoman = {
  fontFamily: 'Nimbus Roman',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('NimbusRoman'),
    local('NimbusRoman-Regular'),
    url(${NimbusRoman}) format('woff')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};
const nimbusRomanBold = {
  fontFamily: 'Nimbus Roman Bold',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 600,
  src: `
    local('NimbusRomanBold'),
    local('NimbusRoman-Bold'),
    url(${NimbusRomanBold}) format('woff')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const nimbusRomanItalic = {
  fontFamily: 'Nimbus Roman Italic',
  fontStyle: 'italic',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('NimbusRomanItalic'),
    local('NimbusRoman-Italic'),
    url(${NimbusRomanItalic}) format('woff')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};
const nimbusRomanItalicBold = {
  fontFamily: 'Nimbus Roman Italic Bold',
  fontStyle: 'italic',
  fontDisplay: 'swap',
  fontWeight: 600,
  src: `
    local('NimbusRomanItalicBold'),
    local('NimbusRoman-ItalicBold'),
    url(${NimbusRomanItalicBold}) format('woff')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const base = createMuiTheme({
  palette: {
    primary: {
      main: red[100],
      light: red[50],
      dark: red[200],
    },
    secondary: {
      main: lightGreen[400],
    },
    warning: {
      main: '#FEAD11' /* yellow */,
    },
    info: {
      main: '#00FDA3' /* lime green, cyan */,
    },
    success: {
      main: '#21BA45' /* green */,
    },
    background: {
      default: '#F9F9F9',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontSize: 14,

    h1: {
      fontSize: '28px !important',
      fontFamily: ['Nimbus Roman Bold', 'sans-serif'].join(','),
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      opacity: '90%',
    },
    h2: {
      fontSize: '22px !important',
      fontWeight: '600',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      opacity: '90%',
      fontFamily: ['Nimbus Roman Bold', 'sans-serif'].join(','),
    },
    h3: {
      fontSize: '16px !important',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      opacity: '90%',
      fontFamily: ['Nimbus Roman', 'sans-serif'].join(','),
    },
    h4: {
      fontSize: '15px !important',
      fontWeight: '600',
      letterSpacing: '.03em',
      opacity: '90%',
    },
    h5: {
      fontSize: '14px !important',
      fontWeight: '600',
      letterSpacing: '.03em',
      opacity: '90%',
    },
    h6: {
      fontFamily: ['Notera', 'serif'].join(','),
      fontSize: '36px !important',
      // letterSpacing: '.03em',
      opacity: '90%',
      lineHeight: '36px',
    },
    subtitle1: {
      fontSize: '16px !important',
      textTransform: 'uppercase',
      opacity: '90%',
      letterSpacing: '.1em',
      fontFamily: ['Nimbus Roman Bold', 'sans-serif'].join(','),
    },
    body1: {
      fontSize: '16px !important',
      fontFamily: ['Nimbus Roman Italic', 'sans-serif'].join(','),
    },
    subtitle2: {
      fontSize: '16px !important',
      fontFamily: ['Nimbus Roman Italic', 'sans-serif'].join(','),
      opacity: '90%',
    },
    body2: {
      fontSize: '14px !important',
      opacity: '90%',
    },
    caption: {
      fontSize: '13px !important',
      opacity: '90%',
    },
    button: {
      fontSize: '14px !important',
      textTransform: 'uppercase',
      opacity: '90%',
      letterSpacing: '.1em',
      fontFamily: ['Nimbus Roman Bold', 'sans-serif'].join(','),
    },
  },
});
const theme = createMuiTheme(base, {
  base,
  overrides: {
    MuiDialogActions: {
      root: {
        borderTop: '1px solid rgba(255, 255, 255, 0.37)',
        padding: '8px 24px',
      },
    },
    MuiDataGrid: {
      root: { justifyContent: 'center' },
    },
    MuiTableRow: {
      root: { verticalAlign: 'baseline' },
    },
    MuiCssBaseline: {
      '@global': {
        '@font-face': [
          nimbusRomanItalic,
          nimbusRoman,
          nimbusRomanBold,
          nimbusRomanItalicBold,
          notera,
        ],
      },
    },
    MuiDialogContent: {
      root: {
        backgroundImage: "url('./assets/pinkbg.png')",
        backgroundBlendMode: 'overlay',
        backgroundColor: base.palette.primary.light,
      },
    },
    MuiCard: {
      root: {
        borderRadius: '4px',
      },
    },
    MuiCardContent: {
      root: {
        '&:last-child': { paddingBottom: 16 },
      },
    },
    MuiAppBar: {
      root: {
        flexDirection: 'row !important',
        color: 'white',
      },
    },
  },
});
export default theme;
