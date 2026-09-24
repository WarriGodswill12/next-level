import { useRef, useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { useThemeColors } from '@/theme/ThemeProvider'
import { Text } from './Text'

type Props = {
  value: string
  onChange: (v: string) => void
  length?: number
  error?: boolean
}

/**
 * One real (invisible) TextInput drives six scoreboard digit boxes, so paste
 * and iOS one-time-code autofill work natively.
 */
export function OtpInput({ value, onChange, length = 6, error }: Props) {
  const c = useThemeColors()
  const ref = useRef<TextInput>(null)
  const [focused, setFocused] = useState(false)

  return (
    <Pressable onPress={() => ref.current?.focus()} accessibilityLabel="Verification code" style={styles.row}>
      {Array.from({ length }).map((_, i) => {
        const ch = value[i]
        const active = focused && (i === value.length || (i === length - 1 && value.length === length))
        return (
          <View
            key={i}
            style={[
              styles.box,
              {
                backgroundColor: ch ? c.surfaceElevated : c.surface,
                borderColor: error ? c.danger : active ? c.accent : ch ? c.borderStrong : c.border,
              },
            ]}
          >
            <Text style={styles.digit} color={error ? 'danger' : 'text'}>
              {ch ?? ''}
            </Text>
            {active && !ch && <View style={[styles.caret, { backgroundColor: c.accent }]} />}
          </View>
        )
      })}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus
        caretHidden
        style={styles.hidden}
        accessibilityLabel="Verification code"
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space[2],
  },
  box: {
    flex: 1,
    aspectRatio: 0.82,
    maxHeight: 72,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 42,
  },
  caret: {
    position: 'absolute',
    width: 2,
    height: 28,
    borderRadius: 1,
  },
  hidden: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
})
