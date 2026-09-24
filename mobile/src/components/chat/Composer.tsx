import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Platform, StyleSheet, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { IconChip } from '@/components/IconChip'
import { noFocusRing } from '@/components/Input'
import { PressableScale } from '@/components/PressableScale'
import { brand, radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { tap } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'

/** Attach chip + growing text field + send button. */
export function Composer({ onSend, onAttach }: { onSend: (text: string) => void; onAttach: () => void }) {
  const c = useThemeColors()
  const insets = useSafeAreaInsets()
  const [text, setText] = useState('')
  const canSend = text.trim().length > 0

  const send = () => {
    if (!canSend) return
    tap()
    onSend(text.trim())
    setText('')
  }

  return (
    <View style={[styles.bar, { backgroundColor: c.background, borderTopColor: c.border, paddingBottom: Math.max(insets.bottom, space[3]) }]}>
      <IconChip icon="add" label="Attach" onPress={onAttach} />
      <View style={[styles.field, { backgroundColor: c.surface, borderColor: c.border }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message"
          placeholderTextColor={c.textTertiary}
          selectionColor={c.accent}
          multiline
          // web renders a textarea: start it at one row (native grows from one line already)
          {...(Platform.OS === 'web' ? { numberOfLines: 1 } : {})}
          style={[styles.input, { color: c.text }, noFocusRing]}
          accessibilityLabel="Message"
          onKeyPress={(e) => {
            // web only: Enter sends, Shift+Enter makes a new line (on phones, return adds a line)
            const ne = e.nativeEvent as { key: string; shiftKey?: boolean }
            if (Platform.OS === 'web' && ne.key === 'Enter' && !ne.shiftKey) {
              ;(e as unknown as { preventDefault?: () => void }).preventDefault?.()
              send()
            }
          }}
        />
      </View>
      <PressableScale
        onPress={send}
        disabled={!canSend}
        scaleTo={0.9}
        accessibilityRole="button"
        accessibilityLabel="Send"
        accessibilityState={{ disabled: !canSend }}
        style={[styles.send, { backgroundColor: canSend ? brand.blue : c.surfaceElevated, borderColor: canSend ? brand.blue : c.border }]}
      >
        <Ionicons name="arrow-up" size={20} color={canSend ? '#FFFFFF' : c.textTertiary} />
      </PressableScale>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'flex-end', gap: space[2], paddingHorizontal: space[4], paddingTop: space[3], borderTopWidth: StyleSheet.hairlineWidth },
  field: { flex: 1, minHeight: 42, maxHeight: 130, borderWidth: 1, borderRadius: radius['2xl'], paddingHorizontal: space[4], justifyContent: 'center' },
  input: { fontFamily: fonts.body, fontSize: 16, lineHeight: 21, paddingTop: 10, paddingBottom: 10, minWidth: 0 },
  send: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
})
