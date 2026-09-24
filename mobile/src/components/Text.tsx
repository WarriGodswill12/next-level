import { Text as RNText } from 'react-native'
import type { TextProps } from 'react-native'
import { textStyles } from '@/design/typography'
import type { TextVariant } from '@/design/typography'
import { useThemeColors } from '@/theme/ThemeProvider'
import type { ThemeColors } from '@/design/tokens'

type Props = TextProps & {
  variant?: TextVariant
  /** A semantic colour role, or any colour string. */
  color?: keyof ThemeColors | (string & {})
  align?: 'left' | 'center' | 'right'
}

/** Themed text: a typography variant plus a semantic colour role. */
export function Text({ variant = 'body', color = 'text', align, style, ...rest }: Props) {
  const c = useThemeColors()
  const resolved = color in c ? c[color as keyof ThemeColors] : color
  return <RNText {...rest} style={[textStyles[variant], { color: resolved, textAlign: align }, style]} />
}
