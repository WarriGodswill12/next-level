import { StyleSheet, View } from 'react-native'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { select } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'
import { PressableScale } from './PressableScale'
import { Text } from './Text'

type Props<T extends string> = { options: { value: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }

/** Segmented control: one active segment raised on the surface. */
export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  const c = useThemeColors()
  return (
    <View style={[styles.wrap, { backgroundColor: c.track, borderColor: c.border }]} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.value === value
        return (
          <PressableScale
            key={o.value}
            scaleTo={0.96}
            onPress={() => {
              select()
              onChange(o.value)
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={o.label}
            style={[styles.seg, on && { backgroundColor: c.surfaceElevated, borderColor: c.border }]}
          >
            <Text style={styles.label} color={on ? 'text' : 'textSecondary'}>
              {o.label}
            </Text>
            {o.count !== undefined && (
              <Text variant="eyebrow" color={on ? 'accent' : 'textTertiary'}>
                {o.count}
              </Text>
            )}
          </PressableScale>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', borderWidth: 1, borderRadius: radius.lg, padding: 4, gap: 4 },
  seg: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 40, borderRadius: radius.md, borderWidth: 1, borderColor: 'transparent' },
  label: { fontFamily: fonts.bodySemi, fontSize: 14 },
})
