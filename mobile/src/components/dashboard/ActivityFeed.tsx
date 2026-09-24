import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, View } from 'react-native'
import { Skeleton } from '@/components/Skeleton'
import { Text } from '@/components/Text'
import { brand, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Activity } from '@/data/demo'
import { useThemeColors } from '@/theme/ThemeProvider'

/** Timeline of recent events, joined by a thin rail like a play-by-play. */
export function ActivityFeed({ items, loading }: { items: Activity[]; loading?: boolean }) {
  const c = useThemeColors()
  const toneBg = { accent: c.accentSoft, success: 'rgba(40,199,111,0.14)', gold: 'rgba(227,179,65,0.16)' }
  const toneFg = { accent: c.accent, success: c.success, gold: brand.gold }

  if (loading) {
    return (
      <View>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.row}>
            <Skeleton width={34} height={34} radius={17} />
            <Skeleton width="70%" height={13} />
          </View>
        ))}
      </View>
    )
  }

  return (
    <View>
      {items.map((a, i) => (
        <View key={a.id} style={styles.row} accessible accessibilityLabel={`${a.bold} ${a.text}, ${a.time}`}>
          <View style={styles.railCol}>
            <View style={[styles.icon, { backgroundColor: toneBg[a.tone] }]}>
              <Ionicons name={a.icon} size={15} color={toneFg[a.tone]} />
            </View>
            {i < items.length - 1 && <View style={[styles.rail, { backgroundColor: c.border }]} />}
          </View>
          <View style={styles.body}>
            <Text variant="body" numberOfLines={2}>
              <Text variant="body" style={styles.bold}>
                {a.bold}
              </Text>{' '}
              <Text variant="body" color="textSecondary">
                {a.text}
              </Text>
            </Text>
            <Text variant="eyebrow" color="textTertiary">
              {a.time}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space[3], alignItems: 'flex-start', minHeight: 58 },
  railCol: { alignItems: 'center', alignSelf: 'stretch' },
  icon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  rail: { width: 1.5, flex: 1, marginVertical: 4 },
  body: { flex: 1, gap: 3, paddingTop: 6, paddingBottom: space[3] },
  bold: { fontFamily: fonts.bodySemi },
})
