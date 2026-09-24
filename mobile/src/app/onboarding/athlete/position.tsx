import { router } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { Chip } from '@/components/Chip'
import { noFocusRing } from '@/components/Input'
import { StepShell } from '@/components/StepShell'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { CLASS_YEARS, sportById } from '@/lib/sports'
import { useSession } from '@/state/session'
import { useThemeColors } from '@/theme/ThemeProvider'

function Label({ children }: { children: string }) {
  return (
    <Text variant="eyebrow" color="textSecondary" style={styles.label}>
      {children}
    </Text>
  )
}

export default function PositionStep() {
  const c = useThemeColors()
  const { athlete, updateAthlete } = useSession()
  const sport = sportById(athlete.sport)
  const [position, setPosition] = useState(athlete.position)
  const [classYear, setClassYear] = useState(athlete.classYear)
  const [jersey, setJersey] = useState(athlete.jersey ?? '')
  const [focused, setFocused] = useState(false)

  return (
    <StepShell
      step={2}
      total={4}
      eyebrow={sport ? sport.label : 'Your role'}
      title={['Where do', 'you line up?']}
      subtitle="Coaches filter by position and class, so these put you in the right searches."
      cta="Continue"
      canContinue={!!position && !!classYear}
      onNext={() => {
        updateAthlete({ position, classYear, jersey })
        router.push('/onboarding/athlete/about')
      }}
    >
      <Label>Position</Label>
      <View style={styles.chips} accessibilityRole="radiogroup">
        {(sport?.positions ?? []).map((p) => (
          <Chip key={p} label={p} selected={position === p} onPress={() => setPosition(p)} />
        ))}
      </View>

      <Label>Graduating class</Label>
      <View style={styles.chips} accessibilityRole="radiogroup">
        {CLASS_YEARS.map((y) => (
          <Chip key={y} label={y} selected={classYear === y} onPress={() => setClassYear(y)} />
        ))}
      </View>

      <Label>Jersey number · optional</Label>
      <View style={styles.jerseyRow}>
        <View
          style={[
            styles.jersey,
            { backgroundColor: c.surface, borderColor: focused ? c.accent : c.border },
          ]}
        >
          <Text style={styles.hash} color="textTertiary">
            #
          </Text>
          <TextInput
            value={jersey}
            onChangeText={(t) => setJersey(t.replace(/\D/g, '').slice(0, 2))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="00"
            placeholderTextColor={c.borderStrong}
            selectionColor={c.accent}
            style={[styles.jerseyInput, { color: c.text }, noFocusRing]}
            accessibilityLabel="Jersey number"
          />
        </View>
        <Text variant="small" color="textSecondary" style={styles.jerseyHint}>
          It goes front and center on your profile card.
        </Text>
      </View>
    </StepShell>
  )
}

const styles = StyleSheet.create({
  label: { marginBottom: space[3], marginTop: space[6] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  jerseyRow: { flexDirection: 'row', alignItems: 'center', gap: space[4] },
  jersey: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.xl,
    paddingHorizontal: space[4],
    height: 96,
    width: 132,
  },
  hash: { fontFamily: fonts.display, fontSize: 40 },
  jerseyInput: { width: 72, minWidth: 0, fontFamily: fonts.display, fontSize: 64, padding: 0, outlineWidth: 0 },
  jerseyHint: { flex: 1 },
})
