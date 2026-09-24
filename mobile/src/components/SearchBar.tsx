import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { useThemeColors } from '@/theme/ThemeProvider'
import { noFocusRing } from './Input'

type Props = { value: string; onChangeText: (v: string) => void; placeholder: string; label: string }

/** Pill search field with a clear button. */
export function SearchBar({ value, onChangeText, placeholder, label }: Props) {
  const c = useThemeColors()
  return (
    <View style={[styles.bar, { backgroundColor: c.surface, borderColor: c.border }]}>
      <Ionicons name="search" size={17} color={c.textTertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.textTertiary}
        selectionColor={c.accent}
        returnKeyType="search"
        autoCorrect={false}
        style={[styles.input, { color: c.text }, noFocusRing]}
        accessibilityLabel={label}
      />
      {!!value && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityRole="button" accessibilityLabel="Clear search">
          <Ionicons name="close-circle" size={18} color={c.textTertiary} />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: space[2], borderWidth: 1, borderRadius: radius.full, paddingHorizontal: space[4], minHeight: 46 },
  input: { flex: 1, minWidth: 0, fontFamily: fonts.bodyMedium, fontSize: 15, paddingVertical: space[2] },
})
