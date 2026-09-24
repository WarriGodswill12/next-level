import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from '@/components/Button'
import { Chip } from '@/components/Chip'
import { Input } from '@/components/Input'
import { Sheet } from '@/components/Sheet'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { success } from '@/lib/haptics'
import type { LoggedGame } from '@/state/session'
import { useThemeColors } from '@/theme/ThemeProvider'

export function AddGameSheet({
  visible,
  onClose,
  keys,
  onSave,
}: {
  visible: boolean
  onClose: () => void
  keys: string[]
  onSave: (g: LoggedGame) => void
}) {
  const [opponent, setOpponent] = useState('')
  const [result, setResult] = useState<LoggedGame['result']>()
  const [stats, setStats] = useState<string[]>(keys.map(() => ''))
  const valid = opponent.trim().length > 1 && !!result

  const reset = () => {
    setOpponent('')
    setResult(undefined)
    setStats(keys.map(() => ''))
  }

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      eyebrow="MaxStats"
      title="Log a game"
      footer={
        <Button
          label="Save game"
          icon="checkmark"
          disabled={!valid}
          onPress={() => {
            if (!valid || !result) return
            onSave({ opponent: opponent.trim(), result, stats: stats.map((s) => s || '0') })
            success()
            reset()
            onClose()
          }}
        />
      }
    >
      <View style={styles.form}>
        <Input label="Opponent" icon="shield-outline" placeholder="Lakeside High" value={opponent} onChangeText={setOpponent} autoCapitalize="words" />
        <View>
          <Text variant="label" color="textSecondary" style={styles.label}>
            Result
          </Text>
          <View style={styles.chips} accessibilityRole="radiogroup">
            {(['W', 'L', 'D'] as const).map((r) => (
              <Chip key={r} label={r === 'W' ? 'Win' : r === 'L' ? 'Loss' : 'Draw'} selected={result === r} onPress={() => setResult(r)} />
            ))}
          </View>
        </View>
        <View>
          <Text variant="label" color="textSecondary" style={styles.label}>
            Your stats
          </Text>
          <View style={styles.statGrid}>
            {keys.map((k, i) => (
              <View key={k} style={styles.statCell}>
                <Input
                  label={k}
                  placeholder="0"
                  value={stats[i]}
                  onChangeText={(t) => setStats((s) => s.map((v, j) => (j === i ? t.replace(/[^\d.:]/g, '').slice(0, 6) : v)))}
                  keyboardType="decimal-pad"
                  style={styles.statInput}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </Sheet>
  )
}

export function HistorySheet({ visible, onClose, keys, games }: { visible: boolean; onClose: () => void; keys: string[]; games: LoggedGame[] }) {
  const c = useThemeColors()
  return (
    <Sheet visible={visible} onClose={onClose} eyebrow="MaxStats" title="Game log">
      {games.length === 0 ? (
        <Text variant="body" color="textSecondary" style={styles.none}>
          Games you log show up here, newest first.
        </Text>
      ) : (
        <View>
          <View style={[styles.logRow, styles.logHead]}>
            <Text variant="eyebrow" color="textTertiary" style={styles.opp}>
              Game
            </Text>
            {keys.map((k) => (
              <Text key={k} variant="eyebrow" color="textTertiary" style={styles.num}>
                {k}
              </Text>
            ))}
          </View>
          {games.map((g, i) => (
            <View key={i} style={[styles.logRow, { borderTopColor: c.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
              <View style={[styles.opp, styles.oppRow]}>
                <View style={[styles.res, { backgroundColor: g.result === 'W' ? c.success : g.result === 'L' ? c.danger : c.textTertiary }]}>
                  <Text style={styles.resText} color="#FFFFFF">
                    {g.result}
                  </Text>
                </View>
                <Text variant="bodyStrong" numberOfLines={1} style={styles.flex}>
                  {g.opponent}
                </Text>
              </View>
              {g.stats.map((s, j) => (
                <Text key={j} style={[styles.num, styles.numText]}>
                  {s}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}
    </Sheet>
  )
}

const styles = StyleSheet.create({
  form: { gap: space[5] },
  label: { marginBottom: space[2] },
  chips: { flexDirection: 'row', gap: space[2] },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  statCell: { width: '47%', flexGrow: 1 },
  statInput: { fontFamily: fonts.display, fontSize: 22 },
  none: { paddingVertical: space[4] },
  logHead: { paddingBottom: space[2] },
  logRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: space[3] },
  opp: { flex: 2.2 },
  oppRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  flex: { flex: 1 },
  num: { flex: 1, textAlign: 'right' },
  numText: { fontFamily: fonts.display, fontSize: 18 },
  res: { width: 22, height: 22, borderRadius: radius.sm + 2, alignItems: 'center', justifyContent: 'center' },
  resText: { fontFamily: fonts.bodyBold, fontSize: 11 },
})
