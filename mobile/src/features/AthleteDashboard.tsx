import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useState } from 'react'
import { Share } from 'react-native'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { AthleteHeroCard } from '@/components/dashboard/AthleteHeroCard'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { AddGameSheet, HistorySheet } from '@/components/dashboard/MaxStatsSheets'
import { MaxStatsWidget } from '@/components/dashboard/MaxStatsWidget'
import { MessagesPreview } from '@/components/dashboard/MessagesPreview'
import { ProfileStrengthSheet } from '@/components/dashboard/ProfileStrengthSheet'
import { QuickUploads } from '@/components/dashboard/QuickUploads'
import { StatsStrip } from '@/components/dashboard/StatsStrip'
import { ProSheet, UpgradeStrip } from '@/components/dashboard/UpgradeStrip'
import { SectionHeader } from '@/components/SectionHeader'
import { ATHLETE_ACTIVITY, ATHLETE_NOTICES, ATHLETE_STRIP, SEASON_LINES, statKeysFor } from '@/data/demo'
import { success } from '@/lib/haptics'
import { pickProfilePhoto } from '@/lib/photo'
import { athleteChecklist, strengthOf } from '@/lib/profile'
import { sportById } from '@/lib/sports'
import { useChat } from '@/state/chat'
import { useSession } from '@/state/session'
import { DashboardScroll, Section } from './DashboardScroll'
import { useSimulatedLoad } from './useSimulatedLoad'

export function AthleteDashboard() {
  const s = useSession()
  const chat = useChat()
  const { loading, refreshing, refresh } = useSimulatedLoad()
  const uploads = s.uploads
  const [sheet, setSheet] = useState<null | 'strength' | 'addGame' | 'history' | 'pro'>(null)

  const a = s.athlete
  const sport = sportById(a.sport)
  const keys = statKeysFor(a.sport)
  const checklist = athleteChecklist({ name: s.name, athlete: a, maxStats: s.maxStats, hasUploads: uploads.length > 0, photo: s.photo, bio: s.bio })
  const strength = strengthOf(checklist)
  const location = [a.city, a.state].filter(Boolean).join(', ')

  const pick = async (kind: 'video' | 'photo') => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: kind === 'video' ? ['videos'] : ['images'], quality: 0.8 })
    if (res.canceled || !res.assets[0]) return
    const asset = res.assets[0]
    const secs = asset.duration ? Math.round(asset.duration / 1000) : undefined
    s.addUpload(
      {
        id: `local-${Date.now()}`,
        kind,
        title: kind === 'video' ? 'New highlight' : 'New photo',
        duration: secs !== undefined ? `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}` : undefined,
        tone: 'night',
        uri: kind === 'photo' ? asset.uri : undefined,
      },
    )
    success()
  }

  const share = () => {
    Share.share({ message: `Check out ${s.name}'s Next Level profile: ${a.position ?? ''} ${sport?.label ?? ''}, Class of ${a.classYear ?? ''}.` }).catch(() => {})
  }

  const onChecklistItem = (id: string) => {
    setSheet(null)
    if (id === 'maxstats') s.setupMaxStats()
    else if (id === 'film') pick('video')
    else if (id === 'photo') pickProfilePhoto().then((uri) => uri && s.setPhoto(uri))
    else router.push('/edit-profile')
  }

  const unreadMessages = chat.totalUnread

  return (
    <DashboardScroll
      refreshing={refreshing}
      onRefresh={refresh}
      header={<DashboardHeader name={s.name || 'Athlete'} subtitle={[a.position, sport?.label, a.classYear && `Class of ${a.classYear}`].filter(Boolean).join(' · ')} notices={ATHLETE_NOTICES} photo={s.photo} />}
    >
      <Section first>
        <AthleteHeroCard
          loading={loading || refreshing}
          name={s.name || 'Athlete'}
          number={a.jersey}
          position={a.position}
          location={location}
          sport={sport?.label}
          classYear={a.classYear}
          strength={strength}
          onEdit={() => router.push('/edit-profile')}
          onShare={share}
          onStrength={() => setSheet('strength')}
          photo={s.photo}
        />
      </Section>

      <Section>
        <SectionHeader title="MaxStats" meta="2026 season" />
        <MaxStatsWidget
          loading={loading}
          ready={s.maxStats}
          season={SEASON_LINES[a.sport ?? 'football'] ?? SEASON_LINES.football!}
          games={s.games}
          onSetup={s.setupMaxStats}
          onAddGame={() => setSheet('addGame')}
          onHistory={() => setSheet('history')}
        />
      </Section>

      <Section>
        <StatsStrip items={ATHLETE_STRIP} loading={loading || refreshing} />
      </Section>

      <Section>
        <SectionHeader title="Quick uploads" meta={`${uploads.length} items`} />
        <QuickUploads items={uploads} loading={loading} onUpload={pick} />
      </Section>

      <Section>
        <SectionHeader title="Messages" meta={unreadMessages ? `${unreadMessages} unread` : undefined} action="View all" onAction={() => router.push('/messages')} />
        <MessagesPreview items={chat.rows.slice(0, 3)} loading={loading} onOpen={(id) => router.push({ pathname: '/chat/[id]', params: { id } })} />
      </Section>

      <Section>
        <SectionHeader title="Activity" />
        <ActivityFeed items={ATHLETE_ACTIVITY} loading={loading} />
      </Section>

      {!s.upgradeDismissed && (
        <Section>
          <UpgradeStrip title="Go Pro" subtitle="Get more out of your recruiting profile." onPress={() => setSheet('pro')} onDismiss={s.dismissUpgrade} />
        </Section>
      )}

      <ProfileStrengthSheet visible={sheet === 'strength'} onClose={() => setSheet(null)} items={checklist} strength={strength} onItem={onChecklistItem} />
      <AddGameSheet visible={sheet === 'addGame'} onClose={() => setSheet(null)} keys={keys} onSave={s.logGame} />
      <ProSheet visible={sheet === 'pro'} onClose={() => setSheet(null)} />
      <HistorySheet visible={sheet === 'history'} onClose={() => setSheet(null)} keys={keys} games={s.games} />
    </DashboardScroll>
  )
}
