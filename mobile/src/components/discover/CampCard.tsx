import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, View } from 'react-native'
import { PressableScale } from '@/components/PressableScale'
import { Text } from '@/components/Text'
import { brand, radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Camp } from '@/data/demo'
import { select, tap } from '@/lib/haptics'
import { sportById } from '@/lib/sports'
import { useThemeColors, useElevation } from '@/theme/ThemeProvider'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

/** Parse an ISO day as a local date (avoids UTC shifting the day). */
export const campDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, m! - 1, d!)
}

export function DateStub({ iso, large }: { iso: string; large?: boolean }) {
  const d = campDate(iso)
  return (
    <View style={[styles.stub, large && styles.stubLarge]}>
      <LinearGradient colors={[brand.navy2, brand.navy]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
      <Text variant="eyebrow" color="#8FA6D6">
        {MONTHS[d.getMonth()]}
      </Text>
      <Text style={[styles.day, large && styles.dayLarge]} color="#FFFFFF">
        {d.getDate()}
      </Text>
      <Text variant="eyebrow" color="rgba(255,255,255,0.6)">
        {WEEKDAYS[d.getDay()]}
      </Text>
    </View>
  )
}

type Props = { k: Camp; interested: boolean; onToggle: () => void; onPress: () => void }

/** Ticket-style event card: date stub, perforation, details, interested toggle (sibling, not nested). */
export function CampCard({ k, interested, onToggle, onPress }: Props) {
  const c = useThemeColors()
  const lift = useElevation()
  return (
    // shadow on the outer view; clipping on the inner (iOS drops shadows on clipped views)
    <View style={[styles.shadowWrap, lift]}>
    <View style={[styles.ticket, { backgroundColor: c.surface, borderColor: c.border }]}>
      <PressableScale
        onPress={() => {
          tap()
          onPress()
        }}
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityLabel={`${k.name}, ${campDate(k.date).toDateString()}, ${k.location}`}
        style={styles.main}
      >
        <DateStub iso={k.date} />
        {/* perforation between stub and body */}
        <View style={styles.perf}>
          {Array.from({ length: 7 }).map((_, i) => (
            <View key={i} style={[styles.hole, { backgroundColor: c.border }]} />
          ))}
        </View>
        <View style={styles.body}>
          <Text variant="eyebrow" color="accent" numberOfLines={1}>
            {sportById(k.sport)?.label} · {k.level}
          </Text>
          <Text style={styles.name} numberOfLines={2}>
            {k.name}
          </Text>
          <View style={styles.meta}>
            <Ionicons name="location-outline" size={13} color={c.textTertiary} />
            <Text variant="small" color="textSecondary" numberOfLines={1} style={styles.flex}>
              {k.host} · {k.location}
            </Text>
          </View>
        </View>
      </PressableScale>
      <Pressable
        onPress={() => {
          select()
          onToggle()
        }}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityState={{ selected: interested }}
        accessibilityLabel={interested ? `Not interested in ${k.name}` : `Interested in ${k.name}`}
        style={[styles.star, interested ? { backgroundColor: brand.gold, borderColor: brand.gold } : { borderColor: c.border, backgroundColor: c.surfaceElevated }]}
      >
        <Ionicons name={interested ? 'star' : 'star-outline'} size={16} color={interested ? '#1A1300' : c.textSecondary} />
      </Pressable>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  shadowWrap: { borderRadius: radius.xl },
  ticket: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius.xl, overflow: 'hidden', paddingRight: space[3] },
  main: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  stub: { width: 72, alignItems: 'center', justifyContent: 'center', paddingVertical: space[3], overflow: 'hidden' },
  stubLarge: { width: 96, borderRadius: radius.lg, paddingVertical: space[4] },
  day: { fontFamily: fonts.display, fontSize: 34, lineHeight: 36 },
  dayLarge: { fontSize: 48, lineHeight: 50 },
  perf: { width: 6, justifyContent: 'space-evenly', alignItems: 'center', marginLeft: -3 },
  hole: { width: 6, height: 6, borderRadius: 3 },
  body: { flex: 1, minWidth: 0, paddingVertical: space[3], paddingHorizontal: space[3], gap: 3 },
  name: { fontFamily: fonts.displayHeavy, fontSize: 21, lineHeight: 22, textTransform: 'uppercase' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  flex: { flex: 1 },
  star: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
})
