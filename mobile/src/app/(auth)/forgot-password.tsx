import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { AuthScaffold } from '@/components/AuthScaffold'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Reveal } from '@/components/Reveal'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { success, warn } from '@/lib/haptics'
import { isEmail } from '@/lib/validation'
import { useSession } from '@/state/session'
import { useThemeColors } from '@/theme/ThemeProvider'

export default function ForgotPassword() {
  const c = useThemeColors()
  const { requestPasswordReset } = useSession()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const error = submitted && !isEmail(email) ? 'Enter a valid email address' : undefined

  const submit = async () => {
    setSubmitted(true)
    if (!isEmail(email)) {
      warn()
      return
    }
    setLoading(true)
    try {
      await requestPasswordReset(email)
      success()
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScaffold
      eyebrow="Account recovery"
      title={['Reset your', 'password.']}
      subtitle={sent ? undefined : "Enter the email on your account and we'll send you a link to set a new password."}
    >
      <StatusBar style="light" />
      {sent ? (
        <Reveal>
          <View style={[styles.sent, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={[styles.sentIcon, { backgroundColor: c.accentSoft }]}>
              <Ionicons name="mail-open-outline" size={28} color={c.accent} />
            </View>
            <Text variant="displayS" align="center">
              Check your inbox
            </Text>
            <Text variant="body" color="textSecondary" align="center">
              If an account exists for{' '}
              <Text variant="body" style={styles.bold}>
                {email.trim()}
              </Text>
              , a reset link is on its way.
            </Text>
          </View>
          <View style={styles.actions}>
            <Button label="Back to log in" onPress={() => router.replace('/log-in')} />
            <Button variant="ghost" size="md" label="Use a different email" onPress={() => setSent(false)} />
          </View>
        </Reveal>
      ) : (
        <View style={styles.form}>
          <Input
            label="Email"
            icon="mail-outline"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            error={error}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="send"
            onSubmitEditing={submit}
            autoFocus
          />
          <Button label="Send reset link" trailingIcon="paper-plane-outline" onPress={submit} loading={loading} />
        </View>
      )}
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  form: { gap: space[5] },
  sent: {
    alignItems: 'center',
    gap: space[3],
    padding: space[6],
    borderRadius: radius['2xl'],
    borderWidth: 1,
  },
  sentIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[1],
  },
  bold: { fontFamily: fonts.bodySemi },
  actions: { marginTop: space[6], gap: space[2] },
})
