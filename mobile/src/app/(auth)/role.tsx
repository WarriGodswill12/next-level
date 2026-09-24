import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { Text as SvgText } from 'react-native-svg'
import { AuthScaffold } from '@/components/AuthScaffold'
import { SwitchPrompt } from '@/components/AuthExtras'
import { Button } from '@/components/Button'
import { PressableScale } from '@/components/PressableScale'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { select } from '@/lib/haptics'
import type { Role } from '@/state/session'
import { useSession } from '@/state/session'
import { useThemeColors, useElevation } from '@/theme/ThemeProvider'

type Option = {
  role: Role
  number: string
  icon: ComponentProps<typeof Ionicons>['name']
  title: string
  body: string
  perks: string[]
}

const OPTIONS: Option[] = [
  {
    role: 'athlete',
    number: '23',
    icon: 'flash',
    title: 'Athlete',
    body: 'Build your profile, log your stats and get discovered.',
    perks: ['Verified profile', 'MaxStats', 'Highlights'],
  },
  {
    role: 'recruiter',
    number: '07',
    icon: 'search',
    title: 'Recruiter / Coach',
    body: 'Find, save and message the prospects that fit your program.',
    perks: ['Recommended athletes', 'Saved board', 'Messaging'],
  },
]

function RoleCard({ o, selected, onPress }: { o: Option; selected: boolean; onPress: () => void }) {
  const c = useThemeColors()
  const lift = useElevation()
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${o.title}. ${o.body}`}
      onPress={() => {
        select()
        onPress()
      }}
      style={[
        styles.card,
        {
          backgroundColor: selected ? c.accentSoft : c.surface,
          borderColor: selected ? c.accent : c.border,
        },
        lift,
      ]}
    >
      <Svg width={170} height={150} style={styles.number} pointerEvents="none">
        <SvgText
          x={170}
          y={132}
          textAnchor="end"
          fontFamily={fonts.display}
          fontSize={150}
          fill="none"
          stroke={selected ? c.accent : c.borderStrong}
          strokeOpacity={selected ? 0.35 : 0.7}
          strokeWidth={1.5}
        >
          {o.number}
        </SvgText>
      </Svg>

      <View style={styles.cardTop}>
        <View style={[styles.icon, { backgroundColor: selected ? c.accent : c.surfaceElevated, borderColor: c.border }]}>
          <Ionicons name={o.icon} size={20} color={selected ? '#FFFFFF' : c.text} />
        </View>
        <View style={[styles.radio, { borderColor: selected ? c.accent : c.borderStrong, backgroundColor: selected ? c.accent : c.surfaceElevated }]}>
          {selected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </View>
      </View>

      <Text variant="displayM" style={styles.cardTitle}>
        {o.title}
      </Text>
      <Text variant="body" color="textSecondary" style={styles.cardBody}>
        {o.body}
      </Text>
      <View style={styles.perks}>
        {o.perks.map((p) => (
          <View key={p} style={[styles.perk, { borderColor: selected ? c.accent : c.border }]}>
            <Text variant="caption" color={selected ? 'accent' : 'textSecondary'} style={styles.perkText}>
              {p}
            </Text>
          </View>
        ))}
      </View>
    </PressableScale>
  )
}

export default function RoleScreen() {
  const { role, chooseRole } = useSession()
  const [picked, setPicked] = useState<Role | null>(role)

  return (
    <AuthScaffold
      eyebrow="Create account · 1 of 3"
      title={['Pick your', 'side.']}
      subtitle="Tell us how you'll use Next Level and we'll set up the right experience for your side of recruiting."
      footer={<SwitchPrompt prompt="Already have an account?" action="Log in" href="/log-in" />}
    >
      <StatusBar style="light" />
      <View style={styles.list} accessibilityRole="radiogroup">
        {OPTIONS.map((o) => (
          <RoleCard key={o.role} o={o} selected={picked === o.role} onPress={() => setPicked(o.role)} />
        ))}
      </View>
      <Button
        style={styles.cta}
        label={picked === 'recruiter' ? 'Continue as recruiter' : picked === 'athlete' ? 'Continue as athlete' : 'Choose a side'}
        trailingIcon="arrow-forward"
        disabled={!picked}
        onPress={() => {
          if (!picked) return
          chooseRole(picked)
          router.push('/sign-up')
        }}
      />
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  list: { gap: space[3] },
  card: {
    borderWidth: 1.5,
    borderRadius: radius['2xl'],
    padding: space[5],
    overflow: 'hidden',
  },
  number: { position: 'absolute', right: -6, top: -14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { marginTop: space[4] },
  cardBody: { marginTop: space[1], maxWidth: 250 },
  perks: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: space[4] },
  perk: { borderWidth: 1, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  perkText: { fontFamily: fonts.bodySemi },
  cta: { marginTop: space[6] },
})
