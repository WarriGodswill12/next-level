import { Pressable, StyleSheet, View } from 'react-native'
import { Avatar } from '@/components/Avatar'
import { Skeleton } from '@/components/Skeleton'
import { Text } from '@/components/Text'
import { space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Conversation } from '@/data/demo'
import { tap } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'

/** One conversation row: avatar, name + context, snippet, time, unread badge. */
export function MessageRow({ m, first, onPress }: { m: Conversation; first?: boolean; onPress?: () => void }) {
  const c = useThemeColors()
  const unread = m.unread > 0
  return (
    <Pressable
      onPress={() => {
        tap()
        onPress?.()
      }}
      style={({ pressed }) => [styles.row, !first && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }, pressed && { opacity: 0.7 }]}
      accessibilityRole="button"
      accessibilityLabel={`${m.name}, ${m.subtitle}. ${m.snippet}. ${m.time}${unread ? `, ${m.unread} unread` : ''}`}
    >
      <Avatar name={m.name} size={46} />
      <View style={styles.body}>
        <View style={styles.top}>
          <Text variant="bodyStrong" numberOfLines={1} style={styles.name}>
            {m.name}
          </Text>
          <Text variant="eyebrow" color={unread ? 'accent' : 'textTertiary'}>
            {m.time}
          </Text>
        </View>
        <Text variant="caption" color="textTertiary" numberOfLines={1}>
          {m.subtitle}
        </Text>
        <View style={styles.top}>
          <Text variant="small" color={unread ? 'text' : 'textSecondary'} numberOfLines={1} style={[styles.snippet, unread && styles.bold]}>
            {m.snippet}
          </Text>
          {unread && (
            <View style={[styles.badge, { backgroundColor: c.accent }]}>
              <Text style={styles.badgeText} color="#FFFFFF">
                {m.unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

export function MessagesPreview({ items, loading, onOpen }: { items: Conversation[]; loading?: boolean; onOpen: (id: string) => void }) {
  if (loading) {
    return (
      <View>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.row}>
            <Skeleton width={46} height={46} radius={23} />
            <View style={[styles.body, styles.skGap]}>
              <Skeleton width="45%" height={14} />
              <Skeleton width="85%" height={12} />
            </View>
          </View>
        ))}
      </View>
    )
  }
  return (
    <View>
      {items.map((m, i) => (
        <MessageRow key={m.id} m={m} first={i === 0} onPress={() => onOpen(m.id)} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3] },
  body: { flex: 1, minWidth: 0, gap: 1 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[2] },
  name: { flex: 1 },
  snippet: { flex: 1 },
  bold: { fontFamily: fonts.bodySemi },
  badge: { minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 11, lineHeight: 13 },
  skGap: { gap: 8 },
})
