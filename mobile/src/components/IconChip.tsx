import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { StyleSheet } from 'react-native'
import { radius } from '@/design/tokens'
import { tap } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'
import { PressableScale } from './PressableScale'

type Props = {
  icon: ComponentProps<typeof Ionicons>['name']
  onPress?: () => void
  label: string
  /** 'brand' sits on the fixed navy header, so it ignores the theme. */
  tone?: 'theme' | 'brand'
}

/** ~38px circular icon button (back, theme, close) — the handoff's chip convention. */
export function IconChip({ icon, onPress, label, tone = 'theme' }: Props) {
  const c = useThemeColors()
  const onBrand = tone === 'brand'
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      scaleTo={0.9}
      onPress={() => {
        tap()
        onPress?.()
      }}
      style={[
        styles.chip,
        onBrand
          ? { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.16)' }
          : { backgroundColor: c.surfaceElevated, borderColor: c.border },
      ]}
    >
      <Ionicons name={icon} size={18} color={onBrand ? '#FFFFFF' : c.text} />
    </PressableScale>
  )
}

const styles = StyleSheet.create({
  chip: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
