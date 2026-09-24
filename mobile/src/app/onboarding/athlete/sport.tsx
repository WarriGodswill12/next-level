import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { PressableScale } from '@/components/PressableScale'
import { StepShell } from '@/components/StepShell'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { select } from '@/lib/haptics'
import { SPORTS } from '@/lib/sports'
import { useSession } from '@/state/session'
import { useThemeColors, useElevation } from '@/theme/ThemeProvider'

export default function SportStep() {
  const c = useThemeColors()
  const lift = useElevation()
  const { athlete, updateAthlete } = useSession()
  const [sport, setSport] = useState(athlete.sport)

  return (
    <StepShell
      step={1}
      total={4}
      eyebrow="Your game"
      title={['What do', 'you play?']}
      subtitle="Pick your main sport. You can add more to your profile later."
      cta="Continue"
      canContinue={!!sport}
      onNext={() => {
        // switching sport clears a position that belonged to the old one
        updateAthlete({ sport, position: sport === athlete.sport ? athlete.position : undefined })
        router.push('/onboarding/athlete/position')
      }}
    >
      <View style={styles.grid} accessibilityRole="radiogroup">
        {SPORTS.map((s) => {
          const on = sport === s.id
          return (
            <PressableScale
              key={s.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={s.label}
              scaleTo={0.95}
              onPress={() => {
                select()
                setSport(s.id)
              }}
              style={[
                styles.tile,
                { backgroundColor: on ? c.accent : c.surface, borderColor: on ? c.accent : c.border },
                !on && lift,
              ]}
            >
              <Ionicons name={s.icon} size={22} color={on ? '#FFFFFF' : c.textSecondary} />
              <Text style={styles.tileLabel} color={on ? '#FFFFFF' : 'text'} numberOfLines={2}>
                {s.label}
              </Text>
              {on && (
                <View style={styles.check}>
                  <Ionicons name="checkmark" size={12} color={c.accent} />
                </View>
              )}
            </PressableScale>
          )
        })}
      </View>
    </StepShell>
  )
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  tile: {
    width: '47.5%',
    flexGrow: 1,
    minHeight: 96,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    padding: space[4],
    justifyContent: 'space-between',
  },
  // Fixed size, no auto-shrink: iOS mis-measures custom fonts and shrinks short labels.
  tileLabel: { fontFamily: fonts.display, fontSize: 22, lineHeight: 24, textTransform: 'uppercase', marginTop: space[3] },
  check: {
    position: 'absolute',
    top: space[3],
    right: space[3],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
