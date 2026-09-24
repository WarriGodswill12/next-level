import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { StyleSheet, View } from 'react-native'
import { Skeleton } from '@/components/Skeleton'
import { Text } from '@/components/Text'
import { space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Delta } from '@/data/demo'
import { useThemeColors } from '@/theme/ThemeProvider'

type Item = { icon: ComponentProps<typeof Ionicons>['name']; label: string; value: string; delta?: Delta }

/** Flat, always-visible metric row with thin dividers — no card around it. */
export function StatsStrip({ items, loading }: { items: Item[]; loading?: boolean }) {
  const c = useThemeColors()
  return (
    <View style={[styles.row, { borderColor: c.border }]}>
      {items.map((it, i) => (
        <View
          key={it.label}
          style={[styles.col, i === 0 ? styles.first : { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: c.border }]}
          accessible
          accessibilityLabel={loading ? `${it.label}, loading` : `${it.label}: ${it.value}${it.delta ? `, ${it.delta.dir} ${it.delta.text} this week` : ''}`}
        >
          <View style={styles.label}>
            <Ionicons name={it.icon} size={13} color={c.textSecondary} />
            <Text variant="eyebrow" color="textSecondary">
              {it.label}
            </Text>
          </View>
          {loading ? (
            <>
              <Skeleton width={56} height={30} style={styles.sk} />
              <Skeleton width={36} height={10} style={styles.sk} />
            </>
          ) : (
            <>
              <Text style={styles.value}>{it.value}</Text>
              {it.delta ? (
                <View style={styles.delta}>
                  <Ionicons name={it.delta.dir === 'up' ? 'caret-up' : 'caret-down'} size={10} color={it.delta.dir === 'up' ? c.success : c.danger} />
                  <Text variant="caption" color={it.delta.dir === 'up' ? 'success' : 'danger'} style={styles.deltaText}>
                    {it.delta.text}
                  </Text>
                  <Text variant="caption" color="textTertiary">
                    wk
                  </Text>
                </View>
              ) : (
                <Text variant="caption" color="textTertiary">
                  this season
                </Text>
              )}
            </>
          )}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: space[4] },
  col: { flex: 1, paddingHorizontal: space[3], gap: 2 },
  first: { paddingLeft: 0 },
  label: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  value: { fontFamily: fonts.display, fontSize: 34, lineHeight: 36 },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  deltaText: { fontFamily: fonts.bodySemi },
  sk: { marginTop: 6 },
})
