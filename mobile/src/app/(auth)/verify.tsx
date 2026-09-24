import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { AuthScaffold } from '@/components/AuthScaffold'
import { Button } from '@/components/Button'
import { OtpInput } from '@/components/OtpInput'
import { Text } from '@/components/Text'
import { space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { success, warn } from '@/lib/haptics'
import { onboardingStart } from '@/lib/onboarding'
import { useSession } from '@/state/session'

const RESEND_AFTER = 30

export default function Verify() {
  const { email, role, verifyEmail, resendCode } = useSession()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [wait, setWait] = useState(RESEND_AFTER)

  useEffect(() => {
    if (wait <= 0) return
    const t = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  const submit = async (value = code) => {
    if (value.length !== 6) {
      setError('Enter all 6 digits')
      warn()
      return
    }
    setLoading(true)
    setError(undefined)
    try {
      await verifyEmail(value)
      success()
      router.replace(onboardingStart(role))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'That code did not work')
      warn()
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScaffold eyebrow="Create account · 3 of 3" title={['Check your', 'email.']}>
      <StatusBar style="light" />
      <Text variant="body" color="textSecondary" style={styles.lede}>
        We sent a 6-digit code to{' '}
        <Text variant="body" style={styles.bold}>
          {email || 'your email'}
        </Text>
        . Enter it below to confirm it's you.
      </Text>

      <OtpInput
        value={code}
        error={!!error}
        onChange={(v) => {
          setCode(v)
          setError(undefined)
          if (v.length === 6) submit(v)
        }}
      />
      {error && (
        <Text variant="caption" color="danger" style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}

      <Button style={styles.cta} label="Verify email" trailingIcon="checkmark" onPress={() => submit()} loading={loading} />

      <View style={styles.resend}>
        {wait > 0 ? (
          <Text variant="small" color="textTertiary">
            Resend code in <Text variant="small" style={styles.timer}>0:{String(wait).padStart(2, '0')}</Text>
          </Text>
        ) : (
          <Button
            variant="ghost"
            size="md"
            label="Resend code"
            onPress={async () => {
              await resendCode()
              setWait(RESEND_AFTER)
            }}
          />
        )}
      </View>
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  lede: { marginBottom: space[6] },
  bold: { fontFamily: fonts.bodySemi },
  error: { marginTop: space[3] },
  cta: { marginTop: space[6] },
  resend: { alignItems: 'center', marginTop: space[4], minHeight: 46, justifyContent: 'center' },
  timer: { fontFamily: fonts.monoMedium },
})
