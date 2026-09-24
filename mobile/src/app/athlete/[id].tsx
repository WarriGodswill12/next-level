import { router, useLocalSearchParams } from 'expo-router'
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '@/components/Button'
import { SubHeader } from '@/components/ScreenHeader'
import { Text } from '@/components/Text'
import { TradingCard } from '@/components/TradingCard'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { PROSPECTS } from '@/data/demo'
import { sportById } from '@/lib/sports'
import { useChat } from '@/state/chat'
import { useSession } from '@/state/session'
import { useThemeColors } from '@/theme/ThemeProvider'

/** Full prospect profile (pushed sub-screen): their card, season line, bio, and actions. */
export default function AthleteProfile() {
  const c = useThemeColors()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { saved, toggleSaved } = useSession()
  const chat = useChat()
  const p = PROSPECTS.find((x) => x.id === id)

  if (!p) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        <SubHeader title="Athlete" />
        <Text variant="body" color="textSecondary" align="center" style={styles.missing}>
          This profile isn't available.
        </Text>
      </View>
    )
  }

  const isSaved = saved.includes(p.id)

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <SubHeader title={p.name} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[24] }]} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <TradingCard
            flippable={false}
            width={Math.min(300, width - space[5] * 2 - space[8])}
            data={{
              name: p.name,
              number: p.number,
              position: p.position,
              sport: sportById(p.sport)?.label ?? '',
              classYear: p.classYear,
              location: p.location,
              school: p.school,
              height: p.height,
              strength: 0,
              nextSteps: [],
            }}
          />
        </View>

        <Text variant="eyebrow" color="textTertiary" style={styles.label}>
          MaxStats · season
        </Text>
        <View style={[styles.line, { backgroundColor: c.surface, borderColor: c.border }]}>
          {p.line.map((st, i) => (
            <View key={st.key} style={[styles.cell, i > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: c.border }]}>
              <Text style={styles.value}>{st.value}</Text>
              <Text variant="eyebrow" color="textTertiary">
                {st.key}
              </Text>
            </View>
          ))}
        </View>

        <Text variant="eyebrow" color="textTertiary" style={styles.label}>
          About
        </Text>
        <Text variant="body" color="textSecondary">
          {p.bio}
        </Text>
        <Text variant="small" color="textTertiary" style={styles.meta}>
          {p.school}
        </Text>
      </ScrollView>

      <View style={[styles.bar, { backgroundColor: c.background, borderTopColor: c.border, paddingBottom: insets.bottom + space[3] }]}>
        <Button style={styles.flex} variant={isSaved ? 'secondary' : 'outline'} icon={isSaved ? 'bookmark' : 'bookmark-outline'} label={isSaved ? 'Saved' : 'Save'} onPress={() => toggleSaved(p.id)} />
        <Button style={styles.flex} icon="chatbubble-ellipses-outline" label="Message" onPress={() => {
            const cid = chat.start({ id: `new-${p.id}`, name: p.name, subtitle: `${p.position} · Class of ${p.classYear}`, personId: p.id })
            router.push({ pathname: '/chat/[id]', params: { id: cid } })
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { paddingHorizontal: space[5] },
  card: { alignItems: 'center', paddingVertical: space[3] },
  label: { marginTop: space[6], marginBottom: space[2] },
  line: { flexDirection: 'row', borderWidth: 1, borderRadius: radius.lg, paddingVertical: space[3] },
  cell: { flex: 1, alignItems: 'center' },
  value: { fontFamily: fonts.display, fontSize: 30, lineHeight: 32 },
  meta: { marginTop: space[2] },
  missing: { marginTop: space[10] },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: space[3], paddingHorizontal: space[5], paddingTop: space[3], borderTopWidth: StyleSheet.hairlineWidth },
})
