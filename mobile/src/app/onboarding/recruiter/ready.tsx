import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { BrandBackdrop } from '@/components/BrandBackdrop'
import { StepShell } from '@/components/StepShell'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { sportById } from '@/lib/sports'
import { useSession } from '@/state/session'
import { useThemeColors } from '@/theme/ThemeProvider'

export default function ReadyStep() {
  const c = useThemeColors()
  const { name, recruiter, completeOnboarding } = useSession()
  const sports = (recruiter.sports ?? []).map((id) => sportById(id)?.label ?? id)
  const years = [...(recruiter.classYears ?? [])].sort()

  const next = [
    { icon: 'grid-outline' as const, text: 'Browse your Recommended Athletes' },
    { icon: 'bookmark-outline' as const, text: 'Save prospects to your board' },
    { icon: 'chatbubbles-outline' as const, text: 'Message athletes directly' },
  ]

  return (
    <StepShell
      step={3}
      total={3}
      eyebrow="Setup complete"
      title={['Your board', 'is set.']}
      cta="Enter Next Level"
      onNext={() => {
        completeOnboarding()
        router.replace('/home')
      }}
    >
      <View style={styles.spacer} />
      {/* scoreboard summary — fixed brand chrome */}
      <View style={styles.board}>
        <BrandBackdrop glow={{ x: 0.8, y: 0 }} />
        <View style={styles.boardHead}>
          <View style={styles.live}>
            <View style={styles.liveDot} />
            <Text variant="eyebrow" color="#FFFFFF">
              Recruiting
            </Text>
          </View>
          <Text variant="eyebrow" color="#8FA6D6">
            {recruiter.level}
          </Text>
        </View>
        <Text style={styles.org} color="#FFFFFF" numberOfLines={2}>
          {recruiter.organization}
        </Text>
        <Text variant="small" color="#8FA6D6">
          {[name, recruiter.title].filter(Boolean).join(' · ')}
        </Text>
        <View style={styles.totals}>
          <View style={styles.total}>
            <Text style={styles.num} color="#FFFFFF">
              {sports.length}
            </Text>
            <Text variant="eyebrow" color="#8FA6D6">
              {sports.length === 1 ? 'Sport' : 'Sports'}
            </Text>
          </View>
          <View style={[styles.total, styles.totalDivider]}>
            <Text style={styles.num} color="#FFFFFF">
              {years.length}
            </Text>
            <Text variant="eyebrow" color="#8FA6D6">
              Classes
            </Text>
          </View>
          <View style={[styles.total, styles.totalDivider]}>
            <Text style={styles.num} color="#FFFFFF" numberOfLines={1}>
              {years.length ? `${years[0].slice(2)}${years.length > 1 ? `–${years[years.length - 1].slice(2)}` : ''}` : '—'}
            </Text>
            <Text variant="eyebrow" color="#8FA6D6">
              Range
            </Text>
          </View>
        </View>
        <Text variant="caption" color="rgba(255,255,255,0.7)" numberOfLines={2}>
          {sports.join(' · ')}
        </Text>
      </View>

      <Text variant="eyebrow" color="textSecondary" style={styles.nextLabel}>
        What's next
      </Text>
      {next.map((n, i) => (
        <View key={n.text} style={[styles.nextRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }]}>
          <View style={[styles.nextIcon, { backgroundColor: c.accentSoft }]}>
            <Ionicons name={n.icon} size={18} color={c.accent} />
          </View>
          <Text variant="bodyStrong" style={styles.flex}>
            {n.text}
          </Text>
        </View>
      ))}
    </StepShell>
  )
}

const styles = StyleSheet.create({
  spacer: { height: space[6] },
  flex: { flex: 1 },
  board: {
    borderRadius: radius['2xl'],
    overflow: 'hidden',
    padding: space[5],
    gap: space[2],
  },
  boardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space[2] },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#28C76F' },
  org: { fontFamily: fonts.display, fontSize: 34, lineHeight: 34, textTransform: 'uppercase' },
  totals: {
    flexDirection: 'row',
    marginVertical: space[3],
    paddingVertical: space[3],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  total: { flex: 1, gap: 2 },
  totalDivider: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)', paddingLeft: space[3] },
  num: { fontFamily: fonts.display, fontSize: 40, lineHeight: 42 },
  nextLabel: { marginTop: space[8], marginBottom: space[2] },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3] },
  nextIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
})
