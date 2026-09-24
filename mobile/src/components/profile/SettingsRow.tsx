import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps, ReactNode } from 'react'
import { Pressable, StyleSheet, Switch, View } from 'react-native'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { select, tap } from '@/lib/haptics'
import { useThemeColors, useElevation } from '@/theme/ThemeProvider'

type Base = { icon: ComponentProps<typeof Ionicons>['name']; label: string; hint?: string; danger?: boolean }

/** Grouped list container for settings rows (one surface, hairline dividers). */
export function SettingsGroup({ children }: { children: ReactNode }) {
  const c = useThemeColors()
  const lift = useElevation()
  // shadow outside, clipping inside (iOS drops shadows on clipped views)
  return (
    <View style={[styles.shadowWrap, lift]}>
      <View style={[styles.group, { backgroundColor: c.surface, borderColor: c.border }]}>{children}</View>
    </View>
  )
}

function Leading({ icon, danger }: Pick<Base, 'icon' | 'danger'>) {
  const c = useThemeColors()
  return (
    <View style={[styles.icon, { backgroundColor: danger ? 'rgba(239,68,68,0.12)' : c.accentSoft }]}>
      <Ionicons name={icon} size={17} color={danger ? c.danger : c.accent} />
    </View>
  )
}

/** Tappable row with an optional trailing value and chevron. */
export function LinkRow({ icon, label, hint, value, danger, onPress, first }: Base & { value?: string; onPress: () => void; first?: boolean }) {
  const c = useThemeColors()
  return (
    <Pressable
      onPress={() => {
        tap()
        onPress()
      }}
      style={({ pressed }) => [styles.row, !first && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }, pressed && { backgroundColor: c.surfaceElevated }]}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityHint={hint}
    >
      <Leading icon={icon} danger={danger} />
      <View style={styles.text}>
        <Text variant="bodyStrong" color={danger ? 'danger' : 'text'}>
          {label}
        </Text>
        {hint && (
          <Text variant="caption" color="textTertiary">
            {hint}
          </Text>
        )}
      </View>
      {value && (
        <Text variant="small" color="textSecondary" numberOfLines={1} style={styles.value}>
          {value}
        </Text>
      )}
      {!danger && <Ionicons name="chevron-forward" size={16} color={c.textTertiary} />}
    </Pressable>
  )
}

/** Row with an on/off switch. */
export function SwitchRow({ icon, label, hint, value, onChange, first }: Base & { value: boolean; onChange: (v: boolean) => void; first?: boolean }) {
  const c = useThemeColors()
  return (
    <View style={[styles.row, !first && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }]}>
      <Leading icon={icon} />
      <View style={styles.text}>
        <Text variant="bodyStrong">{label}</Text>
        {hint && (
          <Text variant="caption" color="textTertiary">
            {hint}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={(v) => {
          select()
          onChange(v)
        }}
        trackColor={{ false: c.borderStrong, true: c.accent }}
        thumbColor="#FFFFFF"
        {...({ activeThumbColor: '#FFFFFF' } as object)}
        accessibilityLabel={label}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  shadowWrap: { borderRadius: radius.xl },
  group: { borderWidth: 1, borderRadius: radius.xl, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingHorizontal: space[4], paddingVertical: space[3], minHeight: 58 },
  icon: { width: 34, height: 34, borderRadius: radius.md + 2, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, minWidth: 0 },
  value: { maxWidth: '40%' },
})
