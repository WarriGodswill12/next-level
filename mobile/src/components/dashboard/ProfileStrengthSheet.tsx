import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, View } from 'react-native'
import { Sheet } from '@/components/Sheet'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { ChecklistItem } from '@/lib/profile'
import { useThemeColors } from '@/theme/ThemeProvider'

type Props = {
  visible: boolean
  onClose: () => void
  items: ChecklistItem[]
  strength: number
  onItem: (id: string) => void
}

/** Guided profile completion: what's done, what to do next. */
export function ProfileStrengthSheet({ visible, onClose, items, strength, onItem }: Props) {
  const c = useThemeColors()
  const todo = items.filter((i) => !i.done)
  const done = items.filter((i) => i.done)

  return (
    <Sheet visible={visible} onClose={onClose} eyebrow={`${done.length} of ${items.length} complete`} title="Profile strength">
      <View style={styles.score}>
        <Text style={styles.big} color="accent">
          {strength}
          <Text style={styles.pct} color="accent">
            %
          </Text>
        </Text>
        <Text variant="body" color="textSecondary" style={styles.flex}>
          {todo.length ? 'The more you add, the more recruiters have to go on. Knock these out next.' : 'Your profile is complete. Nice work.'}
        </Text>
      </View>

      {[...todo, ...done].map((item) => (
        <Pressable
          key={item.id}
          disabled={item.done}
          onPress={() => onItem(item.id)}
          style={({ pressed }) => [styles.row, { borderTopColor: c.border }, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityState={{ disabled: item.done, checked: item.done }}
          accessibilityLabel={`${item.label}${item.done ? ', done' : ''}`}
        >
          <View style={[styles.check, item.done ? { backgroundColor: c.success } : { borderColor: c.borderStrong, borderWidth: 1.5 }]}>
            {item.done && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
          </View>
          <Text variant="bodyStrong" color={item.done ? 'textTertiary' : 'text'} style={[styles.flex, item.done && styles.struck]}>
            {item.label}
          </Text>
          {!item.done && <Ionicons name="chevron-forward" size={16} color={c.textTertiary} />}
        </Pressable>
      ))}
    </Sheet>
  )
}

const styles = StyleSheet.create({
  score: { flexDirection: 'row', alignItems: 'center', gap: space[4], marginBottom: space[4] },
  big: { fontFamily: fonts.display, fontSize: 64, lineHeight: 64 },
  pct: { fontFamily: fonts.display, fontSize: 32 },
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3] + 2, borderTopWidth: StyleSheet.hairlineWidth },
  check: { width: 24, height: 24, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  struck: { textDecorationLine: 'line-through' },
})
