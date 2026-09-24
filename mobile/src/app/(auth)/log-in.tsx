import { Link, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useRef, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { AuthScaffold } from '@/components/AuthScaffold'
import { OrDivider, SocialButtons, SwitchPrompt } from '@/components/AuthExtras'
import { Button } from '@/components/Button'
import { Input, PasswordInput } from '@/components/Input'
import { Text } from '@/components/Text'
import { space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { success, warn } from '@/lib/haptics'
import { isEmail } from '@/lib/validation'
import { useSession } from '@/state/session'

export default function LogIn() {
  const { logIn } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const passRef = useRef<TextInput>(null)

  const errors = {
    email: !isEmail(email) ? 'Enter a valid email address' : '',
    password: !password ? 'Enter your password' : '',
  }

  const submit = async () => {
    setSubmitted(true)
    if (errors.email || errors.password) {
      warn()
      return
    }
    setLoading(true)
    try {
      await logIn({ email, password })
      success()
      router.replace('/home')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScaffold
      eyebrow="Log in"
      title={['Welcome', 'back.']}
      subtitle="Pick up right where you left off: your profile, your board, your messages."
      footer={<SwitchPrompt prompt="New to Next Level?" action="Create an account" href="/role" />}
    >
      <StatusBar style="light" />
      <View style={styles.form}>
        <Input
          label="Email"
          icon="mail-outline"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          error={(submitted && errors.email) || undefined}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="username"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => passRef.current?.focus()}
        />
        <View>
          <PasswordInput
            ref={passRef}
            label="Password"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            error={(submitted && errors.password) || undefined}
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={submit}
          />
          <Link href="/forgot-password" style={styles.forgot} accessibilityRole="link">
            <Text variant="small" color="accent" style={styles.forgotText}>
              Forgot password?
            </Text>
          </Link>
        </View>
        <Button label="Log in" trailingIcon="arrow-forward" onPress={submit} loading={loading} />
      </View>

      <OrDivider />
      <SocialButtons
        onPress={async () => {
          await logIn({ email: 'athlete@example.com', password: 'social' })
          router.replace('/home')
        }}
      />
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  form: { gap: space[4] },
  forgot: { alignSelf: 'flex-end', marginTop: space[3] },
  forgotText: { fontFamily: fonts.bodySemi },
})
