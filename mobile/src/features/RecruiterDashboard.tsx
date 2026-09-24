import { Feather, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Button } from '@/components/Button'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { MessagesPreview } from '@/components/dashboard/MessagesPreview'
import { StatsStrip } from '@/components/dashboard/StatsStrip'
import { AthleteRow, AthleteTile, AthleteTileSkeleton } from '@/components/recruiter/AthleteCard'
import { AthleteDetailSheet } from '@/components/recruiter/AthleteDetailSheet'
import { SavedAthletesList } from '@/components/recruiter/SavedAthletesList'
import { SectionHeader } from '@/components/SectionHeader'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import type { Prospect } from '@/data/demo'
import { PROSPECTS, RECRUITER_ACTIVITY, RECRUITER_NOTICES, RECRUITER_STRIP } from '@/data/demo'
import { select } from '@/lib/haptics'
import { useChat } from '@/state/chat'
import { useSession } from '@/state/session'
import { useThemeColors } from '@/theme/ThemeProvider'
import { DashboardScroll, Section } from './DashboardScroll'
import { useSimulatedLoad } from './useSimulatedLoad'

const PREVIEW = 4

function ViewToggle({ mode, onChange }: { mode: 'grid' | 'list'; onChange: (m: 'grid' | 'list') => void }) {
  const c = useThemeColors()
  return (
    <View style={[styles.toggle, { backgroundColor: c.track, borderColor: c.border }]} accessibilityRole="radiogroup">
      {(['grid', 'list'] as const).map((m) => {
        const on = mode === m
        return (
          <Pressable
            key={m}
            onPress={() => {
              select()
              onChange(m)
            }}
            style={[styles.toggleBtn, on && { backgroundColor: c.surfaceElevated, borderColor: c.border }]}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${m} view`}
          >
            <Feather name={m} size={15} color={on ? c.accent : c.textTertiary} />
          </Pressable>
        )
      })}
    </View>
  )
}

export function RecruiterDashboard() {
  const c = useThemeColors()
  const s = useSession()
  const chat = useChat()
  const { loading, refreshing, refresh } = useSimulatedLoad()
  const [mode, setMode] = useState<'grid' | 'list'>('grid')
  const [showAll, setShowAll] = useState(false)
  const [open, setOpen] = useState<Prospect | null>(null)

  const r = s.recruiter
  const matches = PROSPECTS.filter(
    (p) => (!r.sports?.length || r.sports.includes(p.sport)) && (!r.classYears?.length || r.classYears.includes(p.classYear)),
  )
  const recommended = (showAll ? PROSPECTS : matches).slice(0, PREVIEW)
  const saved = PROSPECTS.filter((p) => s.saved.includes(p.id))
  const unreadMessages = chat.totalUnread

  const card = (p: Prospect, i: number) =>
    mode === 'grid' ? (
      <AthleteTile key={p.id} p={p} saved={s.saved.includes(p.id)} onToggleSave={() => s.toggleSaved(p.id)} onPress={() => setOpen(p)} />
    ) : (
      <AthleteRow key={p.id} first={i === 0} p={p} saved={s.saved.includes(p.id)} onToggleSave={() => s.toggleSaved(p.id)} onPress={() => setOpen(p)} />
    )

  return (
    <DashboardScroll
      refreshing={refreshing}
      onRefresh={refresh}
      header={<DashboardHeader name={s.name || 'Coach'} subtitle={[r.title, r.organization].filter(Boolean).join(' · ')} notices={RECRUITER_NOTICES} />}
    >
      <Section first>
        <StatsStrip items={RECRUITER_STRIP} loading={loading || refreshing} />
      </Section>

      <Section>
        <SectionHeader
          title="Recommended"
          meta={loading ? undefined : `${showAll ? PROSPECTS.length : matches.length} athletes`}
          right={<ViewToggle mode={mode} onChange={setMode} />}
        />
        {loading ? (
          <View style={styles.grid}>
            <View style={styles.pair}>
              <AthleteTileSkeleton />
              <AthleteTileSkeleton />
            </View>
            <View style={styles.pair}>
              <AthleteTileSkeleton />
              <AthleteTileSkeleton />
            </View>
          </View>
        ) : recommended.length === 0 ? (
          <View style={[styles.empty, { borderColor: c.borderStrong }]}>
            <View style={[styles.emptyIcon, { backgroundColor: c.accentSoft }]}>
              <Ionicons name="people-outline" size={22} color={c.accent} />
            </View>
            <Text variant="displayS" align="center">
              No matches yet
            </Text>
            <Text variant="body" color="textSecondary" align="center">
              No athletes fit your sports and class years right now. Check back as new athletes join.
            </Text>
            <Button size="md" variant="secondary" label="Show all athletes" onPress={() => setShowAll(true)} style={styles.emptyCta} />
          </View>
        ) : mode === 'grid' ? (
          <View style={styles.grid}>
            {Array.from({ length: Math.ceil(recommended.length / 2) }).map((_, row) => (
              <View key={row} style={styles.pair}>
                {recommended.slice(row * 2, row * 2 + 2).map(card)}
                {recommended.length % 2 === 1 && row === Math.floor(recommended.length / 2) && <View style={styles.flex} />}
              </View>
            ))}
          </View>
        ) : (
          <View>{recommended.map(card)}</View>
        )}
        {!loading && recommended.length > 0 && (
          <Button variant="ghost" size="md" label="See all athletes" trailingIcon="arrow-forward" onPress={() => router.push('/discover')} style={styles.more} />
        )}
      </Section>

      <Section>
        <SectionHeader title="Your board" meta={`${saved.length} saved`} />
        <SavedAthletesList items={saved} onOpen={setOpen} />
      </Section>

      <Section>
        <SectionHeader title="Messages" meta={unreadMessages ? `${unreadMessages} unread` : undefined} action="View all" onAction={() => router.push('/messages')} />
        <MessagesPreview items={chat.rows.slice(0, 3)} loading={loading} onOpen={(id) => router.push({ pathname: '/chat/[id]', params: { id } })} />
      </Section>

      <Section>
        <SectionHeader title="Activity" />
        <ActivityFeed items={RECRUITER_ACTIVITY} loading={loading} />
      </Section>

      <AthleteDetailSheet
        prospect={open}
        saved={!!open && s.saved.includes(open.id)}
        onClose={() => setOpen(null)}
        onToggleSave={() => open && s.toggleSaved(open.id)}
        onContact={() => {
          if (!open) return
          const id = chat.start({ id: `new-${open.id}`, name: open.name, subtitle: `${open.position} · Class of ${open.classYear}`, personId: open.id })
          setOpen(null)
          router.push({ pathname: '/chat/[id]', params: { id } })
        }}
        onViewProfile={() => {
          const id = open?.id
          setOpen(null)
          if (id) router.push({ pathname: '/athlete/[id]', params: { id } })
        }}
      />
    </DashboardScroll>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  toggle: { flexDirection: 'row', borderWidth: 1, borderRadius: radius.md + 2, padding: 3, gap: 3 },
  toggleBtn: { width: 34, height: 30, borderRadius: radius.md, borderWidth: 1, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  grid: { gap: space[3] },
  pair: { flexDirection: 'row', gap: space[3] },
  more: { marginTop: space[2] },
  empty: { alignItems: 'center', gap: space[2], padding: space[6], borderWidth: 1.5, borderStyle: 'dashed', borderRadius: radius['2xl'] },
  emptyIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: space[1] },
  emptyCta: { marginTop: space[3] },
})
