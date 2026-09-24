import { Ionicons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { select } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'
import { PressableScale } from './PressableScale'
import { Text } from './Text'

type Props = {
  label: string
  selected?: boolean
  onPress?: () => void
  /** Checkbox semantics for multi-select groups, radio for single-select. */
  multi?: boolean
  /** A one-tap action (e.g. a suggested reply), not a selectable option. */
  action?: boolean
}

/** Selectable pill for single- or multi-choice groups. */
export function Chip({ label, selected, onPress, multi, action }: Props) {
  const c = useThemeColors()
  return (
    <PressableScale
      accessibilityRole={action ? 'button' : multi ? 'checkbox' : 'radio'}
      accessibilityState={action ? undefined : multi ? { checked: !!selected } : { selected: !!selected }}
      accessibilityLabel={label}
      scaleTo={0.94}
      onPress={() => {
        select()
        onPress?.()
      }}
      style={[
        styles.chip,
        selected
          ? { backgroundColor: c.accent, borderColor: c.accent }
          : { backgroundColor: c.surfaceElevated, borderColor: c.border },
      ]}
    >
      {selected && multi && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
      <Text style={styles.label} color={selected ? '#FFFFFF' : 'text'}>
        {label}
      </Text>
    </PressableScale>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 42,
    paddingHorizontal: space[4],
    borderRadius: radius.full,
    borderWidth: 1,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    lineHeight: 18,
  },
})
