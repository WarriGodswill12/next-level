import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Image, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { BrandBackdrop } from '@/components/BrandBackdrop'
import { ShareSheet } from '@/components/profile/ShareSheet'
import { TabRootHeader } from '@/components/ScreenHeader'
import { Text } from '@/components/Text'
import { TradingCard } from '@/components/TradingCard'
import { brand, radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { SEASON_LINES } from '@/data/demo'
import { AboutBlock, ProfileActions, SectionLabel, SettingsSection } from '@/features/ProfileParts'
import { athleteCardData } from '@/lib/profile'
import { sportById } from '@/lib/sports'
import { useSession } from '@/state/session'
import { useThemeColors, useElevation } from '@/theme/ThemeProvider'

function Fact({ label, value, first }: { label: string; value?: string; first?: boolean }) {
  const c = useThemeColors()
  return (
    <View style={[styles.fact, !first && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: c.border }]}>
      <Text variant="eyebrow" color="textTertiary">
        {label}
      </Text>
      <Text variant="bodyStrong" color={value ? 'text' : 'textTertiary'} numberOfLines={2}>
        {value || 'Add'}
      </Text>
    </View>
  )
}

function AthleteProfile() {
  const c = useThemeColors()
  const lift = useElevation()
  const { width } = useWindowDimensions()
  const s = useSession()
  const [share, setShare] = useState(false)
  const a = s.athlete
  const sport = sportById(a.sport)
  const season = SEASON_LINES[a.sport ?? 'football'] ?? SEASON_LINES.football!
  const tile = (width - space[5] * 2 - space[2] * 2) / 3

  return (
    <>
      {/* the card carries name, position, class, location and measurables — nothing below repeats them */}
      <View style={styles.card}>
        <TradingCard
          width={Math.min(300, width - space[5] * 2 - space[8])}
          data={athleteCardData({ name: s.name, athlete: a, maxStats: s.maxStats, hasUploads: s.uploads.length > 0, photo: s.photo, bio: s.bio })}
        />
        <Text variant="eyebrow" color="textTertiary" style={styles.hint}>
          Tap your card to flip it
        </Text>
      </View>
      <ProfileActions onShare={() => setShare(true)} />

      <SectionLabel>About</SectionLabel>
      <AboutBlock />

      <SectionLabel action="Edit" onAction={() => router.push('/edit-profile')}>
        School & academics
      </SectionLabel>
      <View style={[styles.facts, { backgroundColor: c.surface, borderColor: c.border }, lift]}>
        <Fact first label="School" value={a.school} />
        <Fact label="GPA" value={a.gpa} />
      </View>

      {s.maxStats && (
        <>
          <SectionLabel>{`MaxStats · ${sport?.label ?? 'Season'}`}</SectionLabel>
          <View style={[styles.line, { backgroundColor: c.surface, borderColor: c.border }, lift]}>
            {season.map((st, i) => (
              <View key={st.key} style={[styles.cell, i > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: c.border }]}>
                <Text style={styles.value}>{st.value}</Text>
                <Text variant="eyebrow" color="textTertiary">
                  {st.key}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      <SectionLabel action="Manage" onAction={() => router.push('/home')}>
        {`Highlights · ${s.uploads.length}`}
      </SectionLabel>
      <View style={styles.grid}>
        {s.uploads.slice(0, 6).map((u) => (
          <View key={u.id} style={[styles.thumb, { width: tile, height: tile * 1.25 }]} accessibilityLabel={`${u.kind === 'video' ? 'Video' : 'Photo'}: ${u.title}`}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: u.tone === 'turf' ? '#1B6B38' : u.tone === 'court' ? '#8A5328' : brand.navy2 }]} />
            {u.uri && <Image source={{ uri: u.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />}
            {u.kind === 'video' && (
              <View style={styles.play}>
                <Ionicons name="play" size={13} color="#FFFFFF" />
              </View>
            )}
            {u.duration && (
              <Text style={styles.duration} color="#FFFFFF">
                {u.duration}
              </Text>
            )}
          </View>
        ))}
      </View>

      <ShareSheet visible={share} onClose={() => setShare(false)} name={s.name} subtitle={[a.position, sport?.label, a.classYear && `Class of ${a.classYear}`].filter(Boolean).join(' · ')} />
    </>
  )
}

function RecruiterProfile() {
  const c = useThemeColors()
  const lift = useElevation()
  const s = useSession()
  const [share, setShare] = useState(false)
  const r = s.recruiter

  return (
    <>
      <View style={styles.board}>
        <BrandBackdrop glow={{ x: 0.85, y: 0 }} />
        <Text variant="eyebrow" color="#8FA6D6">
          {[r.title, r.level].filter(Boolean).join(' · ') || 'Recruiter'}
        </Text>
        <Text style={styles.org} color="#FFFFFF">
          {r.organization || 'Your program'}
        </Text>
        <Text variant="small" color="rgba(255,255,255,0.72)">
          {s.name}
        </Text>
      </View>
      <ProfileActions onShare={() => setShare(true)} />

      <SectionLabel>About</SectionLabel>
      <AboutBlock />

      <SectionLabel action="Edit" onAction={() => router.push('/edit-profile')}>
        Recruiting focus
      </SectionLabel>
      <View style={[styles.focus, { backgroundColor: c.surface, borderColor: c.border }, lift]}>
        <Text variant="eyebrow" color="textTertiary">
          Sports
        </Text>
        <View style={styles.pills}>
          {(r.sports ?? []).map((id) => (
            <View key={id} style={[styles.pill, { backgroundColor: c.accentSoft }]}>
              <Ionicons name={sportById(id)?.icon ?? 'ellipse'} size={13} color={c.accent} />
              <Text variant="label" color="accent">
                {sportById(id)?.label}
              </Text>
            </View>
          ))}
        </View>
        <Text variant="eyebrow" color="textTertiary" style={styles.focusGap}>
          Class years
        </Text>
        <View style={styles.pills}>
          {[...(r.classYears ?? [])].sort().map((y) => (
            <View key={y} style={[styles.pill, { backgroundColor: c.surfaceElevated, borderColor: c.border, borderWidth: 1 }]}>
              <Text variant="label">{y}</Text>
            </View>
          ))}
        </View>
      </View>

      <ShareSheet visible={share} onClose={() => setShare(false)} name={s.name} subtitle={[r.title, r.organization].filter(Boolean).join(' · ')} />
    </>
  )
}

export default function Profile() {
  const c = useThemeColors()
  const { role } = useSession()
  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <TabRootHeader title="Profile" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {role === 'recruiter' ? <RecruiterProfile /> : <AthleteProfile />}
        <SettingsSection />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: space[5], paddingBottom: space[10] },
  card: { alignItems: 'center', paddingTop: space[2] },
  hint: { marginTop: space[3] },
  facts: { flexDirection: 'row', borderWidth: 1, borderRadius: radius.xl, paddingVertical: space[3] },
  fact: { flex: 1, paddingHorizontal: space[4], gap: 4 },
  line: { flexDirection: 'row', borderWidth: 1, borderRadius: radius.xl, paddingVertical: space[3] },
  cell: { flex: 1, alignItems: 'center' },
  value: { fontFamily: fonts.display, fontSize: 30, lineHeight: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  thumb: { borderRadius: radius.lg, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  play: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', paddingLeft: 2 },
  duration: { position: 'absolute', left: 6, bottom: 5, fontFamily: fonts.monoMedium, fontSize: 9 },
  board: { borderRadius: radius['2xl'], overflow: 'hidden', padding: space[5], gap: space[1] },
  org: { fontFamily: fonts.display, fontSize: 38, lineHeight: 38, textTransform: 'uppercase' },
  focus: { borderWidth: 1, borderRadius: radius.xl, padding: space[4] },
  focusGap: { marginTop: space[4] },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2], marginTop: space[2] },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.full, paddingHorizontal: space[3], paddingVertical: 6 },
})
