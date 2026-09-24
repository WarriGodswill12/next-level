import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, View } from 'react-native'
import { Button } from '@/components/Button'
import { Skeleton } from '@/components/Skeleton'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Stat } from '@/data/demo'
import type { LoggedGame } from '@/state/session'
import { useThemeColors, useElevation } from '@/theme/ThemeProvider'

type Props = {
  ready: boolean
  season: Stat[]
  games: LoggedGame[]
  loading?: boolean
  onSetup: () => void
  onAddGame: () => void
  onHistory: () => void
}

/** MaxStats overview: season line as a scoreboard, or the set-up empty state. */
export function MaxStatsWidget({ ready, season, games, loading, onSetup, onAddGame, onHistory }: Props) {
  const c = useThemeColors()
  const lift = useElevation()

  if (loading) {
    return (
      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }, lift]}>
        <View style={styles.line}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.cell}>
              <Skeleton width={48} height={34} />
              <Skeleton width={30} height={10} style={styles.mt} />
            </View>
          ))}
        </View>
        <Skeleton height={44} radius={radius.lg} style={styles.mtLg} />
      </View>
    )
  }

  if (!ready) {
    return (
      <View style={[styles.card, styles.empty, { backgroundColor: c.surface, borderColor: c.border }, lift]}>
        <View style={[styles.emptyIcon, { backgroundColor: c.accentSoft }]}>
          <Ionicons name="stats-chart" size={24} color={c.accent} />
        </View>
        <Text variant="displayS" align="center">
          Start your stat history
        </Text>
        <Text variant="body" color="textSecondary" align="center" style={styles.emptyBody}>
          Set up MaxStats and log each game. Your season line shows up here and on your profile.
        </Text>
        <Button size="md" label="Set up MaxStats" trailingIcon="arrow-forward" onPress={onSetup} style={styles.emptyCta} />
      </View>
    )
  }

  const last = games[0]

  return (
    <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }, lift]}>
      <View style={styles.line} accessibilityLabel={`Season: ${season.map((s) => `${s.value} ${s.key}`).join(', ')}`}>
        {season.map((s, i) => (
          <View key={s.key} style={[styles.cell, i > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: c.border }]}>
            <Text style={styles.value} numberOfLines={1}>
              {s.value}
            </Text>
            <Text variant="eyebrow" color="textTertiary">
              {s.key}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.foot, { borderTopColor: c.border }]}>
        <View style={styles.footText}>
          <Text variant="eyebrow" color="textSecondary">
            {games.length ? `${games.length} game${games.length > 1 ? 's' : ''} logged` : 'Season to date'}
          </Text>
          <Text variant="small" color="textTertiary" numberOfLines={1} style={styles.flex}>
            {last ? `Last: ${last.result === 'W' ? 'Win' : last.result === 'L' ? 'Loss' : 'Draw'} vs ${last.opponent}` : 'Log each game to keep it current'}
          </Text>
        </View>
        <View style={styles.footBtns}>
          <Button size="md" variant="secondary" label="History" icon="list" onPress={onHistory} style={styles.flex} />
          <Button size="md" label="Add game" icon="add" onPress={onAddGame} style={styles.flex} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: radius['2xl'], borderWidth: 1, padding: space[4] },
  line: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', paddingVertical: space[1] },
  value: { fontFamily: fonts.display, fontSize: 36, lineHeight: 38 },
  foot: { gap: space[3], marginTop: space[4], paddingTop: space[4], borderTopWidth: StyleSheet.hairlineWidth },
  footText: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  footBtns: { flexDirection: 'row', gap: space[3] },
  flex: { flex: 1, minWidth: 0 },
  empty: { alignItems: 'center', paddingVertical: space[6], gap: space[2] },
  emptyIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: space[1] },
  emptyBody: { maxWidth: 300 },
  emptyCta: { marginTop: space[3], alignSelf: 'stretch' },
  mt: { marginTop: 8 },
  mtLg: { marginTop: space[4] },
})
