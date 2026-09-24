import { router } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Chip } from '@/components/Chip'
import { StepShell } from '@/components/StepShell'
import { Text } from '@/components/Text'
import { space } from '@/design/tokens'
import { CLASS_YEARS, SPORTS } from '@/lib/sports'
import { useSession } from '@/state/session'

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

export default function FocusStep() {
  const { recruiter, updateRecruiter } = useSession()
  const [sports, setSports] = useState<string[]>(recruiter.sports ?? [])
  const [years, setYears] = useState<string[]>(recruiter.classYears ?? [])

  return (
    <StepShell
      step={2}
      total={3}
      eyebrow="Your board"
      title={['What are you', 'looking for?']}
      subtitle="We use this to fill your Recommended Athletes. Pick as many as you like."
      cta="Set up my board"
      canContinue={sports.length > 0 && years.length > 0}
      onNext={() => {
        updateRecruiter({ sports, classYears: years })
        router.push('/onboarding/recruiter/ready')
      }}
    >
      <View style={styles.labelRow}>
        <Text variant="eyebrow" color="textSecondary">
          Sports
        </Text>
        <Text variant="eyebrow" color={sports.length ? 'accent' : 'textTertiary'}>
          {sports.length} selected
        </Text>
      </View>
      <View style={styles.chips}>
        {SPORTS.map((s) => (
          <Chip key={s.id} multi label={s.label} selected={sports.includes(s.id)} onPress={() => setSports((l) => toggle(l, s.id))} />
        ))}
      </View>

      <View style={[styles.labelRow, styles.gap]}>
        <Text variant="eyebrow" color="textSecondary">
          Class years
        </Text>
        <Text variant="eyebrow" color={years.length ? 'accent' : 'textTertiary'}>
          {years.length} selected
        </Text>
      </View>
      <View style={styles.chips}>
        {CLASS_YEARS.map((y) => (
          <Chip key={y} multi label={y} selected={years.includes(y)} onPress={() => setYears((l) => toggle(l, y))} />
        ))}
      </View>
    </StepShell>
  )
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space[3] },
  gap: { marginTop: space[6] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
})
