import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, View } from 'react-native'
import { Button } from '@/components/Button'
import { Sheet } from '@/components/Sheet'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import type { Notice } from '@/data/demo'
import { useThemeColors } from '@/theme/ThemeProvider'

type Props = {
  visible: boolean
  onClose: () => void
  items: Notice[]
  onMarkAllRead: () => void
}

export function NotificationsSheet({ visible, onClose, items, onMarkAllRead }: Props) {
  const c = useThemeColors()
  const unread = items.filter((n) => n.unread).length

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      eyebrow={unread ? `${unread} new` : 'All caught up'}
      title="Notifications"
      footer={unread ? <Button variant="secondary" size="md" label="Mark all as read" icon="checkmark-done" onPress={onMarkAllRead} /> : undefined}
    >
      {items.map((n, i) => (
        <View key={n.id} style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }]}>
          <View style={[styles.icon, { backgroundColor: n.unread ? c.accent : c.surface }]}>
            <Ionicons name={n.icon} size={16} color={n.unread ? '#FFFFFF' : c.textSecondary} />
          </View>
          <View style={styles.flex}>
            <Text variant="bodyStrong" numberOfLines={1}>
              {n.title}
            </Text>
            <Text variant="small" color="textSecondary" numberOfLines={1}>
              {n.body}
            </Text>
          </View>
          <View style={styles.meta}>
            <Text variant="eyebrow" color="textTertiary">
              {n.time}
            </Text>
            {n.unread && <View style={[styles.dot, { backgroundColor: c.accent }]} accessibilityLabel="Unread" />}
          </View>
        </View>
      ))}
    </Sheet>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3] },
  icon: { width: 38, height: 38, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  meta: { alignItems: 'flex-end', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
})
