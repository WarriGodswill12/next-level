import { router } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Chip } from '@/components/Chip'
import { Input } from '@/components/Input'
import { StepShell } from '@/components/StepShell'
import { Text } from '@/components/Text'
import { space } from '@/design/tokens'
import { LEVELS, RECRUITER_TITLES } from '@/lib/sports'
import { useSession } from '@/state/session'

export default function OrganizationStep() {
  const { name: savedName, setName, recruiter, updateRecruiter } = useSession()
  const [name, setNameInput] = useState(savedName)
  const [organization, setOrganization] = useState(recruiter.organization ?? '')
  const [title, setTitle] = useState(recruiter.title)
  const [level, setLevel] = useState(recruiter.level)

  return (
    <StepShell
      step={1}
      total={3}
      eyebrow="Your program"
      title={['Who are you', 'recruiting for?']}
      subtitle="Athletes see this on every message you send, so it's worth getting right."
      cta="Continue"
      canContinue={name.trim().length > 1 && organization.trim().length > 1 && !!title && !!level}
      onNext={() => {
        setName(name)
        updateRecruiter({ organization: organization.trim(), title, level })
        router.push('/onboarding/recruiter/focus')
      }}
    >
      <Input
        label="Your full name"
        icon="person-outline"
        placeholder="First and last name"
        value={name}
        onChangeText={setNameInput}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
      />
      <View style={styles.gap} />
      <Input
        label="School, club or organization"
        icon="business-outline"
        placeholder="Ridgeview University"
        value={organization}
        onChangeText={setOrganization}
        autoCapitalize="words"
        textContentType="organizationName"
        returnKeyType="done"
      />

      <Text variant="eyebrow" color="textSecondary" style={styles.label}>
        Your role
      </Text>
      <View style={styles.chips} accessibilityRole="radiogroup">
        {RECRUITER_TITLES.map((t) => (
          <Chip key={t} label={t} selected={title === t} onPress={() => setTitle(t)} />
        ))}
      </View>

      <Text variant="eyebrow" color="textSecondary" style={styles.label}>
        Level
      </Text>
      <View style={styles.chips} accessibilityRole="radiogroup">
        {LEVELS.map((l) => (
          <Chip key={l} label={l} selected={level === l} onPress={() => setLevel(l)} />
        ))}
      </View>
    </StepShell>
  )
}

const styles = StyleSheet.create({
  label: { marginTop: space[6], marginBottom: space[3] },
  gap: { height: space[4] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
})
