import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, View } from 'react-native'
import { PressableScale } from '@/components/PressableScale'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Program } from '@/data/demo'
import { select, tap } from '@/lib/haptics'
import { sportById } from '@/lib/sports'
import { useThemeColors, useElevation } from '@/theme/ThemeProvider'
import { Crest } from './Crest'

type Props = { p: Program; mySport?: string; following: boolean; onToggleFollow: () => void; onPress: () => void }

export function FollowButton({ following, onPress, name, size = 'sm' }: { following: boolean; onPress: () => void; name: string; size?: 'sm' | 'md' }) {
  const c = useThemeColors()
  return (
    <Pressable
      onPress={() => {
        select()
        onPress()
      }}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityState={{ selected: following }}
      accessibilityLabel={following ? `Unfollow ${name}` : `Follow ${name}`}
      style={[
        styles.follow,
        size === 'md' && styles.followMd,
        following ? { backgroundColor: c.surfaceElevated, borderColor: c.border } : { backgroundColor: c.accent, borderColor: c.accent },
      ]}
    >
      {following && <Ionicons name="checkmark" size={14} color={c.text} />}
      <Text style={styles.followText} color={following ? 'text' : '#FFFFFF'}>
        {following ? 'Following' : 'Follow'}
      </Text>
    </Pressable>
  )
}

/** Program list card. The follow button sits beside the pressable body, never inside it. */
export function ProgramCard({ p, mySport, following, onToggleFollow, onPress }: Props) {
  const c = useThemeColors()
  const recruitsMe = !!mySport && p.sports.includes(mySport)
  const lift = useElevation()
  return (
    <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }, lift]}>
      <PressableScale
        onPress={() => {
          tap()
          onPress()
        }}
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityLabel={`${p.name}, ${p.level}, ${p.location}${recruitsMe ? ', recruits your sport' : ''}`}
        style={styles.body}
      >
        <Crest short={p.short} colors={p.colors} />
        <View style={styles.text}>
          <Text variant="bodyStrong" numberOfLines={1}>
            {p.name}
          </Text>
          <Text variant="small" color="textSecondary" numberOfLines={1}>
            {p.level} · {p.location}
          </Text>
          {recruitsMe ? (
            <View style={styles.badgeRow}>
              <Ionicons name="flash" size={11} color={c.success} />
              <Text variant="eyebrow" color="success" numberOfLines={1} style={styles.flex}>
                Recruits {sportById(mySport)?.short ?? sportById(mySport)?.label}
              </Text>
            </View>
          ) : (
            <Text variant="caption" color="textTertiary" numberOfLines={1}>
              {p.sports.map((s) => sportById(s)?.short ?? sportById(s)?.label).join(' · ')}
            </Text>
          )}
        </View>
      </PressableScale>
      <FollowButton following={following} onPress={onToggleFollow} name={p.name} />
    </View>
  )
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius.xl, paddingRight: space[3] },
  body: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[3] },
  text: { flex: 1, minWidth: 0, gap: 2 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  flex: { flex: 1 },
  follow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: space[3], minHeight: 34, borderRadius: radius.full, borderWidth: 1 },
  followMd: { minHeight: 44, paddingHorizontal: space[5] },
  followText: { fontFamily: fonts.bodySemi, fontSize: 13 },
})
