import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, View } from 'react-native'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Sheet } from '@/components/Sheet'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Camp, Program } from '@/data/demo'
import { PROGRAMS } from '@/data/demo'
import { tap } from '@/lib/haptics'
import { sportById } from '@/lib/sports'
import { useThemeColors } from '@/theme/ThemeProvider'
import { campDate, DateStub } from './CampCard'
import { Crest } from './Crest'
import { FollowButton } from './ProgramCard'

type Coach = { id: string; name: string; title: string }

function CoachRow({ coach, program, first, onMessage }: { coach: Coach; program: string; first: boolean; onMessage: () => void }) {
  const c = useThemeColors()
  return (
    <View style={[styles.coach, !first && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }]}>
      <Avatar name={coach.name} size={42} />
      <View style={styles.flex}>
        <Text variant="bodyStrong">{coach.name}</Text>
        <Text variant="small" color="textSecondary" numberOfLines={1}>
          {coach.title} · {program}
        </Text>
      </View>
      <Pressable
        onPress={() => {
          tap()
          onMessage()
        }}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Message ${coach.name}`}
        style={[styles.msgBtn, { backgroundColor: c.accentSoft }]}
      >
        <Ionicons name="chatbubble-ellipses" size={17} color={c.accent} />
      </Pressable>
    </View>
  )
}

export function ProgramSheet({
  p,
  following,
  onClose,
  onToggleFollow,
  onMessage,
}: {
  p: Program | null
  following: boolean
  onClose: () => void
  onToggleFollow: () => void
  onMessage: (coach: Coach, program: Program) => void
}) {
  const c = useThemeColors()
  return (
    <Sheet visible={!!p} onClose={onClose} footer={p && <FollowButton size="md" following={following} onPress={onToggleFollow} name={p.name} />}>
      {p && (
        <View>
          <View style={styles.banner}>
            <LinearGradient colors={p.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Crest short={p.short} colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']} size={64} />
            <View style={styles.flex}>
              <Text style={styles.bannerName} color="#FFFFFF" numberOfLines={2}>
                {p.name}
              </Text>
              <Text variant="small" color="rgba(255,255,255,0.78)">
                {p.level} · {p.location}
              </Text>
            </View>
          </View>
          <Text variant="body" color="textSecondary" style={styles.blurb}>
            {p.blurb}
          </Text>

          <Text variant="eyebrow" color="textTertiary" style={styles.label}>
            Sports recruited
          </Text>
          <View style={styles.pills}>
            {p.sports.map((s) => (
              <View key={s} style={[styles.pill, { borderColor: c.border, backgroundColor: c.surface }]}>
                <Ionicons name={sportById(s)?.icon ?? 'ellipse'} size={14} color={c.accent} />
                <Text variant="label">{sportById(s)?.label}</Text>
              </View>
            ))}
          </View>

          <Text variant="eyebrow" color="textTertiary" style={styles.label}>
            Coaching staff
          </Text>
          {p.coaches.map((co, i) => (
            <CoachRow key={co.id} coach={co} program={p.name} first={i === 0} onMessage={() => onMessage(co, p)} />
          ))}
        </View>
      )}
    </Sheet>
  )
}

export function CampSheet({
  k,
  interested,
  onClose,
  onToggle,
  onMessageHost,
}: {
  k: Camp | null
  interested: boolean
  onClose: () => void
  onToggle: () => void
  onMessageHost: (coach: Coach, program: Program) => void
}) {
  const c = useThemeColors()
  const host = k?.hostProgram ? PROGRAMS.find((p) => p.id === k.hostProgram) : undefined
  const coach = host?.coaches[0]

  return (
    <Sheet
      visible={!!k}
      onClose={onClose}
      footer={
        k && (
          <View style={styles.actions}>
            {coach && host && <Button style={styles.flex} variant="outline" icon="chatbubble-ellipses-outline" label="Message" onPress={() => onMessageHost(coach, host)} />}
            <Button
              style={[styles.flex, interested && { backgroundColor: '#E3B341', shadowOpacity: 0 }]}
              icon={interested ? 'star' : 'star-outline'}
              label={interested ? 'Interested' : "I'm interested"}
              onPress={onToggle}
            />
          </View>
        )
      }
    >
      {k && (
        <View>
          <View style={styles.campHead}>
            <DateStub iso={k.date} large />
            <View style={styles.flex}>
              <Text variant="eyebrow" color="accent">
                {sportById(k.sport)?.label}
              </Text>
              <Text style={styles.campName}>{k.name}</Text>
              <Text variant="small" color="textSecondary">
                {campDate(k.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
            </View>
          </View>

          <View style={[styles.facts, { borderColor: c.border }]}>
            {[
              ['business-outline', 'Host', k.host],
              ['location-outline', 'Where', k.location],
              ['people-outline', 'Who', k.level],
            ].map(([icon, key, val]) => (
              <View key={key} style={styles.fact}>
                <Ionicons name={icon as 'business-outline'} size={16} color={c.textSecondary} />
                <Text variant="eyebrow" color="textTertiary" style={styles.factKey}>
                  {key}
                </Text>
                <Text variant="bodyStrong" style={styles.flex} numberOfLines={1}>
                  {val}
                </Text>
              </View>
            ))}
          </View>

          <Text variant="body" color="textSecondary" style={styles.blurb}>
            {k.about}
          </Text>
        </View>
      )}
    </Sheet>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[4], borderRadius: radius.xl, overflow: 'hidden' },
  bannerName: { fontFamily: fonts.display, fontSize: 28, lineHeight: 28, textTransform: 'uppercase' },
  blurb: { marginTop: space[4] },
  label: { marginTop: space[5], marginBottom: space[2] },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: radius.full, paddingHorizontal: space[3], paddingVertical: 6 },
  coach: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3] },
  msgBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: space[3] },
  campHead: { flexDirection: 'row', alignItems: 'center', gap: space[4] },
  campName: { fontFamily: fonts.display, fontSize: 30, lineHeight: 30, textTransform: 'uppercase', marginVertical: 2 },
  facts: { marginTop: space[5], borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: space[2] },
  fact: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[2] },
  factKey: { width: 52 },
})
