import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Avatar } from '@/components/Avatar'
import { IconChip } from '@/components/IconChip'
import { noFocusRing } from '@/components/Input'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Notice } from '@/data/demo'
import { SEARCH_SUGGESTIONS } from '@/data/demo'
import { select } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'
import { NotificationsSheet } from './NotificationsSheet'

type Props = {
  name: string
  /** Line under the name: sport/position for athletes, org/title for recruiters. */
  subtitle: string
  notices: Notice[]
  photo?: string
}

/**
 * Rich dashboard header — renders immediately (never skeleton-loaded).
 * Search chip expands into a full-width field with live suggestions.
 */
export function DashboardHeader({ name, subtitle, notices, photo }: Props) {
  const c = useThemeColors()
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [items, setItems] = useState(notices)
  const open = useRef(new Animated.Value(0)).current
  const inputRef = useRef<TextInput>(null)
  const unread = items.filter((n) => n.unread).length

  useEffect(() => {
    Animated.timing(open, {
      toValue: searching ? 1 : 0,
      duration: 320,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: false,
    }).start(() => searching && inputRef.current?.focus())
  }, [searching, open])

  const q = query.trim().toLowerCase()
  const suggestions = (q ? SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)) : SEARCH_SUGGESTIONS.slice(0, 4)).slice(0, 5)

  const close = () => {
    setSearching(false)
    setQuery('')
    inputRef.current?.blur()
  }

  const first = name.split(' ')[0] || 'there'

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {/* identity fades out as the search field grows over it */}
        <Animated.View
          style={[styles.identity, { opacity: open.interpolate({ inputRange: [0, 0.4], outputRange: [1, 0], extrapolate: 'clamp' }) }]}
          pointerEvents={searching ? 'none' : 'auto'}
        >
          <Avatar name={name} size={42} online uri={photo} />
          <View style={styles.flex}>
            <Text variant="small" color="textSecondary" numberOfLines={1}>
              Welcome back, <Text variant="small" color="text" style={styles.bold}>{first}</Text>
            </Text>
            <Text variant="caption" color="textTertiary" numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.search,
            {
              backgroundColor: c.surfaceElevated,
              borderColor: searching ? c.accent : c.border,
              left: open.interpolate({ inputRange: [0, 1], outputRange: ['100%', '0%'] }),
              opacity: open,
            },
          ]}
          pointerEvents={searching ? 'auto' : 'none'}
        >
          <Ionicons name="search" size={17} color={c.accent} />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Search coaches, schools, stats"
            placeholderTextColor={c.textTertiary}
            selectionColor={c.accent}
            returnKeyType="search"
            onSubmitEditing={() => {
              close()
              router.push('/discover')
            }}
            style={[styles.input, { color: c.text }, noFocusRing]}
            accessibilityLabel="Search"
          />
          <Pressable onPress={close} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close search">
            <Ionicons name="close-circle" size={20} color={c.textTertiary} />
          </Pressable>
        </Animated.View>

        {!searching && (
          <View style={styles.actions}>
            <IconChip icon="search" label="Search" onPress={() => setSearching(true)} />
            <View>
              <IconChip icon="notifications-outline" label={`Notifications, ${unread} unread`} onPress={() => setNotifOpen(true)} />
              {unread > 0 && (
                <View style={[styles.badge, { borderColor: c.background }]} pointerEvents="none">
                  <Text style={styles.badgeText} color="#FFFFFF">
                    {unread}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {searching && (
        <View style={[styles.suggest, { backgroundColor: c.surfaceElevated, borderColor: c.border }]}>
          <Text variant="eyebrow" color="textTertiary" style={styles.suggestLabel}>
            {q ? 'Suggestions' : 'Try searching'}
          </Text>
          {suggestions.length ? (
            suggestions.map((s) => (
              <Pressable
                key={s}
                style={({ pressed }) => [styles.suggestRow, pressed && { backgroundColor: c.surface }]}
                onPress={() => {
                  select()
                  close()
                  router.push('/discover')
                }}
                accessibilityRole="button"
              >
                <Ionicons name="search-outline" size={15} color={c.textTertiary} />
                <Text variant="body" style={styles.flex} numberOfLines={1}>
                  {s}
                </Text>
                <Ionicons name="arrow-up-outline" size={15} color={c.textTertiary} style={styles.fill} />
              </Pressable>
            ))
          ) : (
            <Text variant="small" color="textSecondary" style={styles.none}>
              No matches for “{query.trim()}”
            </Text>
          )}
        </View>
      )}

      <NotificationsSheet
        visible={notifOpen}
        onClose={() => setNotifOpen(false)}
        items={items}
        onMarkAllRead={() => setItems((l) => l.map((n) => ({ ...n, unread: false })))}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { zIndex: 10 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 46 },
  identity: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flex: { flex: 1 },
  bold: { fontFamily: fonts.bodyBold },
  actions: { flexDirection: 'row', gap: space[2], marginLeft: space[3] },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    borderWidth: 2,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 10, lineHeight: 12 },
  search: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[4],
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  input: { flex: 1, minWidth: 0, fontFamily: fonts.bodyMedium, fontSize: 15, paddingVertical: space[2] },
  suggest: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingVertical: space[2],
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  suggestLabel: { paddingHorizontal: space[4], paddingVertical: space[2] },
  suggestRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingHorizontal: space[4], paddingVertical: space[3] },
  fill: { transform: [{ rotate: '-45deg' }] },
  none: { paddingHorizontal: space[4], paddingVertical: space[3] },
})
