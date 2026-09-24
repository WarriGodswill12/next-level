import { Ionicons } from '@expo/vector-icons'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Avatar } from '@/components/Avatar'
import { PressableScale } from '@/components/PressableScale'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Prospect } from '@/data/demo'
import { tap } from '@/lib/haptics'
import { useThemeColors, useElevation } from '@/theme/ThemeProvider'

/** Horizontal strip of saved prospects; empty state nudges the first save. */
export function SavedAthletesList({ items, onOpen }: { items: Prospect[]; onOpen: (p: Prospect) => void }) {
  const c = useThemeColors()
  const lift = useElevation()

  if (!items.length) {
    return (
      <View style={[styles.empty, { borderColor: c.borderStrong }]}>
        <Ionicons name="bookmark-outline" size={20} color={c.textTertiary} />
        <Text variant="small" color="textSecondary" style={styles.flex}>
          Tap the bookmark on any athlete to start your board.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.row}>
      {items.map((p) => (
        <PressableScale
          key={p.id}
          onPress={() => {
            tap()
            onOpen(p)
          }}
          accessibilityRole="button"
          accessibilityLabel={`${p.name}, ${p.position}, class of ${p.classYear}`}
          style={[styles.chip, { backgroundColor: c.surface, borderColor: c.border }, lift]}
        >
          <Avatar name={p.name} size={52} verified ring={c.surface} />
          <Text variant="label" numberOfLines={1} style={styles.name}>
            {p.name.split(' ')[0]}
          </Text>
          <Text style={styles.pos} color="accent">
            {p.position} · ’{p.classYear.slice(2)}
          </Text>
        </PressableScale>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -space[5] },
  row: { gap: space[3], paddingHorizontal: space[5] },
  chip: { width: 96, alignItems: 'center', paddingVertical: space[3], paddingHorizontal: space[2], borderRadius: radius.xl, borderWidth: 1, gap: 4 },
  name: { marginTop: space[1] },
  pos: { fontFamily: fonts.display, fontSize: 14, lineHeight: 16 },
  empty: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[4], borderWidth: 1.5, borderStyle: 'dashed', borderRadius: radius.xl },
  flex: { flex: 1 },
})
