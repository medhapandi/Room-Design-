// ═══════════════════════════════════════════════════════
// Room Designer — Premium Design System
// ═══════════════════════════════════════════════════════

export const theme = {
  colors: {
    // ─── Primary Indigo / Violet ───────────────────────
    primary: '#6C5CE7',
    primaryLight: '#A29BFE',
    primaryDark: '#4834D4',
    primaryLighter: '#EEEDFF',
    primaryGhost: 'rgba(108, 92, 231, 0.08)',

    // ─── Secondary / Accent ───────────────────────────
    secondary: '#8B7FD4',
    accent: '#D63384',
    accentLight: '#F8D7E7',
    coral: '#FF6B6B',
    teal: '#00CEC9',

    // ─── Gradient Arrays ──────────────────────────────
    gradientPrimary: ['#6C5CE7', '#A29BFE'] as readonly [string, string],
    gradientAccent: ['#D63384', '#FD79A8'] as readonly [string, string],
    gradientSuccess: ['#00B894', '#55EFC4'] as readonly [string, string],
    gradientDanger: ['#E17055', '#FF7675'] as readonly [string, string],
    gradientDark: ['#2D1B69', '#6C5CE7'] as readonly [string, string],
    gradientWarm: ['#FDCB6E', '#E17055'] as readonly [string, string],
    gradientCool: ['#74B9FF', '#0984E3'] as readonly [string, string],
    gradientSubtle: ['#DFE6E9', '#FFEAA7'] as readonly [string, string],

    // ─── Surfaces ─────────────────────────────────────
    white: '#FFFFFF',
    background: '#F5F3FF',
    surface: '#FFFFFF',
    surfaceElevated: '#FEFEFE',
    card: '#FFFFFF',

    // ─── Text ─────────────────────────────────────────
    textPrimary: '#1A1035',
    textSecondary: '#6C6085',
    textLight: '#A09AAF',
    textOnPrimary: '#FFFFFF',
    textOnDark: '#F5F3FF',

    // ─── Status ───────────────────────────────────────
    success: '#00B894',
    successLight: '#E6FAF4',
    error: '#E17055',
    errorLight: '#FDEDEA',
    warning: '#FDCB6E',
    warningLight: '#FFF9E6',
    info: '#74B9FF',
    infoLight: '#EBF5FF',

    // ─── Borders / Dividers ───────────────────────────
    border: '#E8E4F0',
    divider: '#F0EDF5',

    // ─── Glass / Overlay ──────────────────────────────
    glass: 'rgba(255, 255, 255, 0.75)',
    glassDark: 'rgba(26, 16, 53, 0.6)',
    overlay: 'rgba(26, 16, 53, 0.45)',
    shadow: 'rgba(108, 92, 231, 0.12)',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    xxl: 32,
    round: 999,
  },

  typography: {
    h1: {
      fontSize: 30,
      fontWeight: '800' as const,
      color: '#1A1035',
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: '#1A1035',
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#1A1035',
      letterSpacing: 0,
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      color: '#6C6085',
      letterSpacing: 0.1,
    },
    bodyBold: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: '#1A1035',
      letterSpacing: 0.1,
    },
    caption: {
      fontSize: 13,
      fontWeight: '500' as const,
      color: '#A09AAF',
      letterSpacing: 0.2,
    },
    small: {
      fontSize: 11,
      fontWeight: '500' as const,
      color: '#A09AAF',
      letterSpacing: 0.3,
    },
    label: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: '#6C5CE7',
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
  },

  shadows: {
    small: {
      shadowColor: '#6C5CE7',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    medium: {
      shadowColor: '#6C5CE7',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    large: {
      shadowColor: '#6C5CE7',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 8,
    },
    glow: {
      shadowColor: '#6C5CE7',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 6,
    },
  },
};

// Import fonts
import fonts from './fonts';

// Extend theme with fonts
export const themeWithFonts = {
  ...theme,
  fonts,
};

export default theme;
