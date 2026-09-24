/**
 * Next Level design tokens.
 * Colour roles follow the design handoff (section 2); every themed component
 * reads them through useThemeColors() rather than importing raw hex values.
 */

export const brand = {
  /** The one accent colour across the app. */
  blue: '#0B5FFF',
  /** Fixed brand chrome (auth headers, hero accents) — identical in light and dark. */
  navy: '#0B1530',
  navy2: '#13224A',
  gold: '#E3B341',
  white: '#FFFFFF',
} as const

export const palette = {
  blue: {
    50: '#E8F0FF',
    100: '#CCDDFF',
    200: '#99BBFF',
    300: '#6699FF',
    400: '#3B82F6',
    500: '#0B5FFF',
    600: '#094ECC',
    700: '#073B99',
    800: '#052766',
    900: '#021433',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  status: {
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    success: '#28C76F',
  },
} as const

export type ThemeColors = {
  background: string
  surface: string
  surfaceElevated: string
  border: string
  borderStrong: string
  text: string
  textSecondary: string
  textTertiary: string
  textInverse: string
  accent: string
  accentSoft: string
  accentPressed: string
  danger: string
  success: string
  warning: string
  /** Recessed track behind segmented controls and toggles. */
  track: string
}

/**
 * Light theme. Deliberately a cool off-white page with pure-white cards (the handoff table
 * had white on #FAFAFA, which reads flat): cards separate from the page, and light-only
 * card shadows (useElevation) add depth. Roles and names are unchanged.
 */
export const lightColors: ThemeColors = {
  background: '#F3F4F7',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E3E6EC',
  borderStrong: '#CDD2DA',
  text: '#0A0A0A',
  textSecondary: '#5F6673',
  textTertiary: '#8C93A0',
  textInverse: '#FFFFFF',
  accent: '#0B5FFF',
  accentSoft: '#E8F0FF',
  accentPressed: '#094ECC',
  danger: '#EF4444',
  success: '#28C76F',
  warning: '#F59E0B',
  track: '#E6E8ED',
}

export const darkColors: ThemeColors = {
  background: '#0B0B0C',
  surface: '#161617',
  surfaceElevated: '#1F1F21',
  border: '#2A2A2C',
  borderStrong: '#3A3A3D',
  text: '#F5F5F5',
  textSecondary: '#A8A8A8',
  textTertiary: '#6E6E70',
  textInverse: '#0A0A0A',
  accent: '#3B82F6',
  accentSoft: '#132038',
  accentPressed: '#0B5FFF',
  danger: '#EF4444',
  success: '#28C76F',
  warning: '#F59E0B',
  track: '#161617',
}

/** Spacing scale — use space[n], never raw numbers. */
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const

export const shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2, elevation: 1 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.16, shadowRadius: 24, elevation: 10 },
  /** Soft lift for cards on the light page (light mode only, via useElevation). */
  card: { shadowColor: '#0B1530', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 2 },
  /** Brand-blue glow under primary actions and hero objects. */
  glow: { shadowColor: '#0B5FFF', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.45, shadowRadius: 24, elevation: 12 },
} as const
