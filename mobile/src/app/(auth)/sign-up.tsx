import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useRef, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { AuthScaffold } from '@/components/AuthScaffold'
import { Checkbox, OrDivider, SocialButtons, StrengthMeter, SwitchPrompt } from '@/components/AuthExtras'
import { Button } from '@/components/Button'
import { Input, PasswordInput } from '@/components/Input'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { warn } from '@/lib/haptics'
import { isEmail, passwordStrength } from '@/lib/validation'
import { onboardingStart } from '@/lib/onboarding'
import { useSession } from '@/state/session'

export default function SignUp() {
  const { role, signUp } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const emailRef = useRef<TextInput>(null)
  const passRef = useRef<TextInput>(null)

  const strength = passwordStrength(password)
  const errors = {
    name: name.trim().split(/\s+/).length < 2 ? 'Enter your first and last name' : '',
    email: !isEmail(email) ? 'Enter a valid email address' : '',
    password: password.length < 8 ? 'Use at least 8 characters' : '',
    agreed: !agreed ? 'Please accept the terms to continue' : '',
  }
  const show = (k: keyof typeof errors) => ((touched[k] || submitted) && errors[k]) || undefined

  const submit = async () => {
    setSubmitted(true)
    if (Object.values(errors).some(Boolean)) {
      warn()
      return
    }
    setLoading(true)
    try {
      await signUp({ name, email, password })
      router.push('/verify')
    } finally {
      setLoading(false)
    }
  }

  const roleLabel = role === 'recruiter' ? 'Recruiter' : 'Athlete'

  return (
    <AuthScaffold
      eyebrow="Create account · 2 of 3"
      title={['Build your', 'profile.']}
      badge={
        <View style={styles.badge}>
          <Ionicons name={role === 'recruiter' ? 'search' : 'flash'} size={12} color="#FFFFFF" />
          <Text variant="eyebrow" color="#FFFFFF">
            {roleLabel}
          </Text>
        </View>
      }
      footer={<SwitchPrompt prompt="Already have an account?" action="Log in" href="/log-in" />}
    >
      <StatusBar style="light" />
      <SocialButtons onPress={() => router.replace(onboardingStart(role))} />
      <OrDivider />

      <View style={styles.form}>
        <Input
          label="Full name"
          icon="person-outline"
          placeholder="Jordan Mitchell"
          value={name}
          onChangeText={setName}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          error={show('name')}
          autoComplete="name"
          textContentType="name"
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <Input
          ref={emailRef}
          label="Email"
          icon="mail-outline"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={show('email')}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => passRef.current?.focus()}
        />
        <PasswordInput
          ref={passRef}
          label="Password"
          placeholder="At least 8 characters"
          value={password}
          onChangeText={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={show('password')}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <StrengthMeter strength={strength} />

        <View style={styles.terms}>
          <Checkbox checked={agreed} onToggle={() => setAgreed((a) => !a)}>
            <Text variant="small" color="textSecondary">
              I agree to the <Text variant="small" color="accent" style={styles.link}>Terms</Text> and{' '}
              <Text variant="small" color="accent" style={styles.link}>Privacy Policy</Text>.
            </Text>
          </Checkbox>
          {submitted && errors.agreed ? (
            <Text variant="caption" color="danger" style={styles.termsErr}>
              {errors.agreed}
            </Text>
          ) : null}
        </View>

        <Button label="Create account" trailingIcon="arrow-forward" onPress={submit} loading={loading} />
      </View>
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: 'rgba(11,95,255,0.9)',
  },
  form: { gap: space[4] },
  terms: { marginTop: space[1], gap: space[2] },
  termsErr: { marginLeft: 34 },
  link: { fontFamily: fonts.bodySemi },
})
