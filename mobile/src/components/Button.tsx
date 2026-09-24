import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps, ReactNode } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { brand, radius, shadows, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { tap } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'
import { PressableScale } from './PressableScale'
import { Text } from './Text'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'onBrand' | 'apple'

type Props = {
  label: string
  onPress?: () => void
  variant?: Variant
  icon?: ComponentProps<typeof Ionicons>['name']
  /** Icon after the label (e.g. arrow-forward). */
  trailingIcon?: ComponentProps<typeof Ionicons>['name']
  loading?: boolean
  disabled?: boolean
  size?: 'md' | 'lg'
  style?: StyleProp<ViewStyle>
  accessibilityHint?: string
  leading?: ReactNode
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  trailingIcon,
  loading,
  disabled,
  size = 'lg',
  style,
  accessibilityHint,
  leading,
}: Props) {
  const c = useThemeColors()
  const inactive = disabled || loading

  const look: Record<Variant, { bg: string; fg: string; border?: string }> = {
    primary: { bg: brand.blue, fg: '#FFFFFF' },
    secondary: { bg: c.surfaceElevated, fg: c.text, border: c.border },
    outline: { bg: 'transparent', fg: c.text, border: c.borderStrong },
    ghost: { bg: 'transparent', fg: c.accent },
    onBrand: { bg: '#FFFFFF', fg: brand.navy },
    apple: { bg: c.text, fg: c.background },
  }
  const v = look[variant]

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={() => {
        tap()
        onPress?.()
      }}
      style={[
        styles.base,
        size === 'md' && styles.md,
        { backgroundColor: v.bg, borderColor: v.border ?? 'transparent', borderWidth: v.border ? 1 : 0 },
        variant === 'primary' && !inactive && shadows.glow,
        inactive && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.row}>
          {leading}
          {icon && <Ionicons name={icon} size={19} color={v.fg} />}
          <Text style={[styles.label, size === 'md' && styles.labelMd, { color: v.fg }]}>{label}</Text>
          {trailingIcon && <Ionicons name={trailingIcon} size={18} color={v.fg} />}
        </View>
      )}
    </PressableScale>
  )
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: radius.xl,
    paddingHorizontal: space[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  md: {
    minHeight: 46,
    borderRadius: radius.lg,
    paddingHorizontal: space[5],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  labelMd: {
    fontSize: 15,
  },
  disabled: {
    opacity: 0.45,
  },
})
