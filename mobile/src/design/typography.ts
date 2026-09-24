import type { TextStyle } from 'react-native'

/**
 * Brand typefaces (loaded in the root layout via expo-font).
 * Custom fonts on native are selected by family name per weight — never set
 * fontWeight alongside these, or Android falls back to the system font.
 */
export const fonts = {
  /** Condensed broadcast face: headlines, big numbers, name plates. */
  display: 'BigShouldersDisplay_900Black',
  displayHeavy: 'BigShouldersDisplay_800ExtraBold',
  displaySemi: 'BigShouldersDisplay_600SemiBold',
  /** Body copy and UI text. */
  body: 'Archivo_400Regular',
  bodyMedium: 'Archivo_500Medium',
  bodySemi: 'Archivo_600SemiBold',
  bodyBold: 'Archivo_700Bold',
  /** Scoreboard labels, eyebrows, stat keys. */
  mono: 'MartianMono_400Regular',
  monoMedium: 'MartianMono_500Medium',
} as const

export const fontAssets = {
  [fonts.display]: require('@expo-google-fonts/big-shoulders-display/BigShouldersDisplay_900Black.ttf'),
  [fonts.displayHeavy]: require('@expo-google-fonts/big-shoulders-display/BigShouldersDisplay_800ExtraBold.ttf'),
  [fonts.displaySemi]: require('@expo-google-fonts/big-shoulders-display/BigShouldersDisplay_600SemiBold.ttf'),
  [fonts.body]: require('@expo-google-fonts/archivo/400Regular/Archivo_400Regular.ttf'),
  [fonts.bodyMedium]: require('@expo-google-fonts/archivo/500Medium/Archivo_500Medium.ttf'),
  [fonts.bodySemi]: require('@expo-google-fonts/archivo/600SemiBold/Archivo_600SemiBold.ttf'),
  [fonts.bodyBold]: require('@expo-google-fonts/archivo/700Bold/Archivo_700Bold.ttf'),
  [fonts.mono]: require('@expo-google-fonts/martian-mono/400Regular/MartianMono_400Regular.ttf'),
  [fonts.monoMedium]: require('@expo-google-fonts/martian-mono/500Medium/MartianMono_500Medium.ttf'),
}

/** Size scale from the handoff (section 3). */
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
} as const

export const textStyles = {
  /** Hero headlines — welcome and reveal screens. */
  displayXL: { fontFamily: fonts.display, fontSize: 64, lineHeight: 58, textTransform: 'uppercase', letterSpacing: -0.5 },
  /** Screen titles on brand headers. */
  displayL: { fontFamily: fonts.display, fontSize: 48, lineHeight: 44, textTransform: 'uppercase', letterSpacing: -0.3 },
  /** Section and step titles. */
  displayM: { fontFamily: fonts.display, fontSize: 34, lineHeight: 32, textTransform: 'uppercase' },
  displayS: { fontFamily: fonts.displayHeavy, fontSize: 24, lineHeight: 24, textTransform: 'uppercase' },
  /** Scoreboard numbers. */
  stat: { fontFamily: fonts.display, fontSize: 40, lineHeight: 40 },
  title: { fontFamily: fonts.bodyBold, fontSize: fontSize.xl, lineHeight: 26, letterSpacing: -0.2 },
  subtitle: { fontFamily: fonts.bodySemi, fontSize: fontSize.lg, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.bodySemi, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.bodySemi, fontSize: 13, lineHeight: 18 },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 16 },
  /** Mono eyebrow — uppercase, tracked, used above titles and on scoreboards. */
  eyebrow: { fontFamily: fonts.monoMedium, fontSize: 10.5, lineHeight: 14, letterSpacing: 1.6, textTransform: 'uppercase' },
  mono: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 16, letterSpacing: 0.8 },
} satisfies Record<string, TextStyle>

export type TextVariant = keyof typeof textStyles
