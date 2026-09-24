import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Avatar } from '@/components/Avatar'
import { BrandBackdrop } from '@/components/BrandBackdrop'
import { Chip } from '@/components/Chip'
import { CampCard, campDate } from '@/components/discover/CampCard'
import { CampSheet, ProgramSheet } from '@/components/discover/DetailSheets'
import { ProgramCard } from '@/components/discover/ProgramCard'
import { PressableScale } from '@/components/PressableScale'
import { TabRootHeader } from '@/components/ScreenHeader'
import { SearchBar } from '@/components/SearchBar'
import { Segmented } from '@/components/Segmented'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Camp, Program } from '@/data/demo'
import { CAMPS, PROGRAMS } from '@/data/demo'
import { tap } from '@/lib/haptics'
import { sportById } from '@/lib/sports'
import { useChat } from '@/state/chat'
import { useSession } from '@/state/session'
import { useThemeColors } from '@/theme/ThemeProvider'

type Tab = 'programs' | 'camps' | 'coaches'
const LEVEL_FILTERS = ['All', 'NCAA D1', 'NCAA D2', 'NCAA D3', 'NAIA', 'JUCO']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function AthleteDiscover() {
  const c = useThemeColors()
  const s = useSession()
  const chat = useChat()
  const [tab, setTab] = useState<Tab>('programs')
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('All')
  const [mineOnly, setMineOnly] = useState(true)
  const [program, setProgram] = useState<Program | null>(null)
  const [camp, setCamp] = useState<Camp | null>(null)

  const mySport = s.athlete.sport
  const sportLabel = sportById(mySport)?.short ?? sportById(mySport)?.label
  const needle = q.trim().toLowerCase()
  const has = (...fields: string[]) => !needle || fields.join(' ').toLowerCase().includes(needle)

  const programs = PROGRAMS.filter(
    (p) => (level === 'All' || p.level === level) && (!mineOnly || !mySport || p.sports.includes(mySport)) && has(p.name, p.location, p.level),
  )
  const camps = [...CAMPS]
    .filter((k) => (!mineOnly || !mySport || k.sport === mySport) && has(k.name, k.host, k.location))
    .sort((a, b) => a.date.localeCompare(b.date))
  const coaches = PROGRAMS.flatMap((p) => p.coaches.map((co) => ({ ...co, program: p }))).filter((co) => has(co.name, co.title, co.program.name))

  // camps grouped under month headers
  const campGroups = useMemo(() => {
    const groups: { month: string; items: Camp[] }[] = []
    for (const k of camps) {
      const d = campDate(k.date)
      const label = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
      const g = groups[groups.length - 1]
      if (g?.month === label) g.items.push(k)
      else groups.push({ month: label, items: [k] })
    }
    return groups
  }, [camps])

  const nextCamp = [...CAMPS].filter((k) => !mySport || k.sport === mySport).sort((a, b) => a.date.localeCompare(b.date))[0]

  const message = (coach: { id: string; name: string }, p: Program) => {
    setProgram(null)
    setCamp(null)
    const id = chat.start({ id: coach.id, name: coach.name, subtitle: p.name })
    router.push({ pathname: '/chat/[id]', params: { id } })
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <TabRootHeader title="Discover" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <SearchBar value={q} onChangeText={setQ} placeholder="Programs, camps, coaches" label="Search programs, camps and coaches" />

        {/* featured: the next camp for your sport (Programs tab only, so it never repeats the camp list) */}
        {!needle && nextCamp && tab === 'programs' && (
          <PressableScale
            onPress={() => {
              tap()
              setCamp(nextCamp)
            }}
            accessibilityRole="button"
            accessibilityLabel={`Next up: ${nextCamp.name}`}
            style={styles.feature}
          >
            <BrandBackdrop glow={{ x: 0.9, y: 0.1 }} />
            <View style={styles.featureTop}>
              <View style={styles.live}>
                <View style={styles.liveDot} />
                <Text variant="eyebrow" color="#FFFFFF">
                  Next up{sportLabel ? ` · ${sportLabel}` : ''}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.featureName} color="#FFFFFF">
              {nextCamp.name}
            </Text>
            <Text variant="small" color="rgba(255,255,255,0.75)">
              {campDate(nextCamp.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {nextCamp.host}
            </Text>
          </PressableScale>
        )}

        <View style={styles.seg}>
          <Segmented<Tab>
            value={tab}
            onChange={setTab}
            options={[
              { value: 'programs', label: 'Programs', count: programs.length },
              { value: 'camps', label: 'Camps', count: camps.length },
              { value: 'coaches', label: 'Coaches', count: coaches.length },
            ]}
          />
        </View>

        {tab !== 'coaches' && !!mySport && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.chips}>
            <Chip multi label={`${sportLabel} only`} selected={mineOnly} onPress={() => setMineOnly((v) => !v)} />
            {tab === 'programs' && LEVEL_FILTERS.map((l) => <Chip key={l} label={l} selected={level === l} onPress={() => setLevel(l)} />)}
          </ScrollView>
        )}

        {tab === 'programs' && (
          <View style={styles.list}>
            {programs.map((p) => (
              <ProgramCard key={p.id} p={p} mySport={mySport} following={s.following.includes(p.id)} onToggleFollow={() => s.toggleFollow(p.id)} onPress={() => setProgram(p)} />
            ))}
            {!programs.length && <Empty text="No programs match. Try another level or turn off your sport filter." />}
          </View>
        )}

        {tab === 'camps' &&
          (campGroups.length ? (
            campGroups.map((g) => (
              <View key={g.month}>
                <Text variant="eyebrow" color="textTertiary" style={styles.month}>
                  {g.month}
                </Text>
                <View style={styles.list}>
                  {g.items.map((k) => (
                    <CampCard key={k.id} k={k} interested={s.interested.includes(k.id)} onToggle={() => s.toggleInterested(k.id)} onPress={() => setCamp(k)} />
                  ))}
                </View>
              </View>
            ))
          ) : (
            <Empty text="No upcoming camps match. Try turning off your sport filter." />
          ))}

        {tab === 'coaches' && (
          <View style={styles.coachList}>
            {coaches.map((co, i) => (
              <View key={co.id} style={[styles.coach, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }]}>
                <Avatar name={co.name} size={46} />
                <Pressable onPress={() => setProgram(co.program)} style={styles.flex} accessibilityRole="button" accessibilityLabel={`${co.name}, ${co.title} at ${co.program.name}`}>
                  <Text variant="bodyStrong">{co.name}</Text>
                  <Text variant="small" color="textSecondary" numberOfLines={1}>
                    {co.title}
                  </Text>
                  <Text variant="caption" color="textTertiary" numberOfLines={1}>
                    {co.program.name} · {co.program.level}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    tap()
                    message(co, co.program)
                  }}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Message ${co.name}`}
                  style={[styles.msgBtn, { backgroundColor: c.accentSoft }]}
                >
                  <Ionicons name="chatbubble-ellipses" size={17} color={c.accent} />
                </Pressable>
              </View>
            ))}
            {!coaches.length && <Empty text={`No coaches match “${q.trim()}”.`} />}
          </View>
        )}
      </ScrollView>

      <ProgramSheet
        p={program}
        following={!!program && s.following.includes(program.id)}
        onClose={() => setProgram(null)}
        onToggleFollow={() => program && s.toggleFollow(program.id)}
        onMessage={message}
      />
      <CampSheet k={camp} interested={!!camp && s.interested.includes(camp.id)} onClose={() => setCamp(null)} onToggle={() => camp && s.toggleInterested(camp.id)} onMessageHost={message} />
    </View>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <Text variant="body" color="textSecondary" align="center" style={styles.empty}>
      {text}
    </Text>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { paddingHorizontal: space[5], paddingBottom: space[10] },
  feature: { marginTop: space[4], borderRadius: radius['2xl'], overflow: 'hidden', padding: space[5], gap: space[1] },
  featureTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space[2] },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#28C76F' },
  featureName: { fontFamily: fonts.display, fontSize: 32, lineHeight: 32, textTransform: 'uppercase' },
  seg: { marginTop: space[5] },
  bleed: { marginHorizontal: -space[5], marginTop: space[3] },
  chips: { gap: space[2], paddingHorizontal: space[5] },
  list: { gap: space[3], marginTop: space[4] },
  month: { marginTop: space[5], marginBottom: -space[1] },
  coach: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3], marginTop: 2 },
  coachList: { marginTop: space[3] },
  msgBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  empty: { marginTop: space[8], paddingHorizontal: space[4] },
})
