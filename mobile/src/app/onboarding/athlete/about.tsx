import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { Input } from '@/components/Input'
import { StepShell } from '@/components/StepShell'
import { space } from '@/design/tokens'
import { useSession } from '@/state/session'

export default function AboutStep() {
  const { name: savedName, setName, athlete, updateAthlete } = useSession()
  const [name, setNameInput] = useState(savedName)
  const [school, setSchool] = useState(athlete.school ?? '')
  const [city, setCity] = useState(athlete.city ?? '')
  const [state, setState] = useState(athlete.state ?? '')
  const [height, setHeight] = useState(athlete.height ?? '')
  const [weight, setWeight] = useState(athlete.weight ?? '')
  const schoolRef = useRef<TextInput>(null)
  const cityRef = useRef<TextInput>(null)
  const stateRef = useRef<TextInput>(null)
  const heightRef = useRef<TextInput>(null)
  const weightRef = useRef<TextInput>(null)

  const ready = name.trim().length > 1 && school.trim().length > 1 && city.trim().length > 1 && state.trim().length === 2
  const next = () => {
    if (!ready) return
    setName(name)
    updateAthlete({ school: school.trim(), city: city.trim(), state: state.trim().toUpperCase(), height: height.trim(), weight: weight.trim() })
    router.push('/onboarding/athlete/card')
  }

  return (
    <StepShell
      step={3}
      total={4}
      eyebrow="Your story"
      title={['Put yourself', 'on the map.']}
      subtitle="This is what goes on your card. Measurables are optional but help you stand out."
      cta="Build my card"
      canContinue={ready}
      onNext={next}
    >
      <View style={styles.form}>
        <Input
          label="Full name"
          icon="person-outline"
          placeholder="First and last name"
          value={name}
          onChangeText={setNameInput}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => schoolRef.current?.focus()}
        />
        <Input
          ref={schoolRef}
          label="High school / club"
          icon="school-outline"
          placeholder="Westlake High School"
          value={school}
          onChangeText={setSchool}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => cityRef.current?.focus()}
        />
        <View style={styles.row}>
          <View style={styles.grow}>
            <Input
              ref={cityRef}
              label="City"
              icon="location-outline"
              placeholder="Atlanta"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
              textContentType="addressCity"
              returnKeyType="next"
              onSubmitEditing={() => stateRef.current?.focus()}
            />
          </View>
          <View style={styles.state}>
            <Input
              ref={stateRef}
              label="State"
              placeholder="GA"
              value={state}
              onChangeText={(t) => setState(t.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase())}
              autoCapitalize="characters"
              textContentType="addressState"
              maxLength={2}
              returnKeyType="next"
              onSubmitEditing={() => heightRef.current?.focus()}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.grow}>
            <Input
              ref={heightRef}
              label="Height · optional"
              icon="resize-outline"
              placeholder={`6'1"`}
              value={height}
              onChangeText={setHeight}
              returnKeyType="next"
              onSubmitEditing={() => weightRef.current?.focus()}
            />
          </View>
          <View style={styles.grow}>
            <Input
              ref={weightRef}
              label="Weight (lb) · optional"
              icon="barbell-outline"
              placeholder="185"
              value={weight}
              onChangeText={(t) => setWeight(t.replace(/\D/g, '').slice(0, 3))}
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={next}
            />
          </View>
        </View>
      </View>
    </StepShell>
  )
}

const styles = StyleSheet.create({
  form: { gap: space[4] },
  row: { flexDirection: 'row', gap: space[3] },
  grow: { flex: 1 },
  state: { width: 96 },
})
