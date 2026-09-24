import { Ionicons } from '@expo/vector-icons'
import { forwardRef, useState } from 'react'
import type { ComponentProps } from 'react'
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native'
import type { TextInputProps, TextStyle } from 'react-native'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { useThemeColors } from '@/theme/ThemeProvider'
import { Text } from './Text'

type Props = TextInputProps & {
  label: string
  icon?: ComponentProps<typeof Ionicons>['name']
  error?: string
  hint?: string
  /** Element rendered at the right edge of the field (e.g. the show-password toggle). */
  trailing?: React.ReactNode
}

/** Labelled, icon-slotted text field with focus and error states. */
export const Input = forwardRef<TextInput, Props>(function Input(
  { label, icon, error, hint, trailing, onFocus, onBlur, style, ...rest },
  ref,
) {
  const c = useThemeColors()
  const [focused, setFocused] = useState(false)
  const borderColor = error ? c.danger : focused ? c.accent : c.border

  return (
    <View style={styles.wrap}>
      <Text variant="label" color="textSecondary">
        {label}
      </Text>
      <View
        style={[
          styles.field,
          { backgroundColor: c.surface, borderColor },
          focused && !error && { backgroundColor: c.surfaceElevated },
        ]}
      >
        {icon && <Ionicons name={icon} size={18} color={focused ? c.accent : c.textTertiary} />}
        <TextInput
          ref={ref}
          placeholderTextColor={c.textTertiary}
          selectionColor={c.accent}
          style={[styles.input, { color: c.text }, noFocusRing, style]}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          accessibilityLabel={label}
          {...rest}
        />
        {trailing}
      </View>
      {error ? (
        <View style={styles.msg} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={14} color={c.danger} />
          <Text variant="caption" color="danger">
            {error}
          </Text>
        </View>
      ) : hint ? (
        <Text variant="caption" color="textTertiary">
          {hint}
        </Text>
      ) : null}
    </View>
  )
})

export const PasswordInput = forwardRef<TextInput, Omit<Props, 'secureTextEntry' | 'trailing'>>(function PasswordInput(
  props,
  ref,
) {
  const c = useThemeColors()
  const [visible, setVisible] = useState(false)
  return (
    <Input
      ref={ref}
      icon="lock-closed-outline"
      autoCapitalize="none"
      autoCorrect={false}
      secureTextEntry={!visible}
      trailing={
        <Pressable
          onPress={() => setVisible((v) => !v)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        >
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={19} color={c.textSecondary} />
        </Pressable>
      }
      {...props}
    />
  )
})

const styles = StyleSheet.create({
  wrap: {
    gap: space[2],
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    minHeight: 54,
    paddingHorizontal: space[4],
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    paddingVertical: space[3],
    minWidth: 0,
    outlineWidth: 0,
  },
  msg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
})

/** Web preview only: hide the browser's default focus ring (native has none; our border shows focus). */
export const noFocusRing = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as unknown as TextStyle
