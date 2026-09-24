import * as ImagePicker from 'expo-image-picker'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Avatar } from '@/components/Avatar'
import { AttachSheet } from '@/components/chat/AttachSheet'
import { Composer } from '@/components/chat/Composer'
import { MessageBubble, TypingBubble } from '@/components/chat/MessageBubble'
import { Chip } from '@/components/Chip'
import { IconChip } from '@/components/IconChip'
import { Text } from '@/components/Text'
import { space } from '@/design/tokens'
import { dayLabel, sameDay } from '@/lib/time'
import type { ChatMessage } from '@/state/chat'
import { useChat } from '@/state/chat'
import { useSession } from '@/state/session'
import { useThemeColors } from '@/theme/ThemeProvider'

type Row = { type: 'day'; key: string; label: string } | { type: 'msg'; key: string; m: ChatMessage; first: boolean; last: boolean }

const GROUP_MS = 5 * 60_000

/** Chronological rows with day separators and same-sender grouping. */
function buildRows(thread: ChatMessage[]): Row[] {
  const rows: Row[] = []
  thread.forEach((m, i) => {
    const prev = thread[i - 1]
    const next = thread[i + 1]
    if (!prev || !sameDay(prev.at, m.at)) rows.push({ type: 'day', key: `d-${m.id}`, label: dayLabel(m.at) })
    const joinsPrev = !!prev && prev.from === m.from && m.at - prev.at < GROUP_MS && sameDay(prev.at, m.at)
    const joinsNext = !!next && next.from === m.from && next.at - m.at < GROUP_MS && sameDay(next.at, m.at)
    rows.push({ type: 'msg', key: m.id, m, first: !joinsPrev, last: !joinsNext })
  })
  return rows
}

const STARTERS = {
  recruiter: ['Loved your film', 'Can we set up a call?', 'What’s your schedule this season?'],
  athlete: ['Thanks for reaching out!', 'Here’s my latest film', 'When’s a good time to talk?'],
}

export default function ChatThread() {
  const c = useThemeColors()
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<{ id: string }>()
  const chat = useChat()
  const { role } = useSession()
  const [attach, setAttach] = useState(false)

  const convo = chat.convo(id)
  const thread = chat.thread(id)
  const rows = useMemo(() => buildRows(thread).reverse(), [thread])

  // opening (and staying in) a thread clears its unread badge
  useEffect(() => {
    if (convo?.unread) chat.markRead(id)
  }, [convo?.unread, id, chat])

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 })
    if (!res.canceled && res.assets[0]) chat.send(id, { kind: 'image', uri: res.assets[0].uri })
  }

  if (!convo) {
    return (
      <View style={[styles.root, { backgroundColor: c.background, paddingTop: insets.top + space[4] }]}>
        <View style={styles.headerRow}>
          <IconChip icon="chevron-back" label="Go back" onPress={() => router.back()} />
        </View>
        <Text variant="body" color="textSecondary" align="center" style={styles.missing}>
          This conversation isn't available.
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* sub-screen header: back chip + centered identity */}
      <View style={[styles.header, { paddingTop: insets.top + space[2], borderBottomColor: c.border }]}>
        <IconChip icon="chevron-back" label="Go back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/messages'))} />
        <View style={styles.identity}>
          <Avatar name={convo.name} size={34} verified={!!convo.personId} ring={c.background} />
          <View style={styles.idText}>
            <Text variant="bodyStrong" numberOfLines={1} accessibilityRole="header">
              {convo.name}
            </Text>
            <Text variant="caption" color={convo.typing ? 'accent' : 'textTertiary'} numberOfLines={1}>
              {convo.typing ? 'Typing…' : convo.subtitle}
            </Text>
          </View>
        </View>
        {convo.personId ? (
          <IconChip icon="person-outline" label={`View ${convo.name}'s profile`} onPress={() => router.push({ pathname: '/athlete/[id]', params: { id: convo.personId! } })} />
        ) : (
          <View style={styles.chipSpace} />
        )}
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {thread.length === 0 ? (
          <ScrollView contentContainerStyle={styles.empty} keyboardShouldPersistTaps="handled">
            <Avatar name={convo.name} size={72} verified={!!convo.personId} />
            <Text variant="displayM" align="center" style={styles.emptyTitle}>
              Say hello to {convo.name}
            </Text>
            <Text variant="body" color="textSecondary" align="center">
              {convo.subtitle}
            </Text>
            <View style={styles.starters}>
              {STARTERS[role === 'recruiter' ? 'recruiter' : 'athlete'].map((s) => (
                <Chip key={s} action label={s} onPress={() => chat.send(id, { kind: 'text', text: s })} />
              ))}
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={rows}
            inverted
            keyExtractor={(r) => r.key}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            ListHeaderComponent={convo.typing ? <TypingBubble /> : null}
            renderItem={({ item }) =>
              item.type === 'day' ? (
                <Text variant="eyebrow" color="textTertiary" align="center" style={styles.day}>
                  {item.label}
                </Text>
              ) : (
                <MessageBubble m={item.m} first={item.first} last={item.last} />
              )
            }
          />
        )}
        <Composer onSend={(text) => chat.send(id, { kind: 'text', text })} onAttach={() => setAttach(true)} />
      </KeyboardAvoidingView>

      <AttachSheet
        visible={attach}
        onClose={() => setAttach(false)}
        role={role}
        onPhoto={pickPhoto}
        onProfile={(profileId) => chat.send(id, { kind: 'profile', profileId })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingHorizontal: space[4], paddingBottom: space[3], borderBottomWidth: StyleSheet.hairlineWidth },
  headerRow: { paddingHorizontal: space[4] },
  identity: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[2], minWidth: 0 },
  idText: { flexShrink: 1, alignItems: 'flex-start' },
  chipSpace: { width: 40 },
  list: { paddingHorizontal: space[4], paddingVertical: space[4] },
  day: { marginTop: space[5], marginBottom: space[1] },
  empty: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: space[8], gap: space[2] },
  emptyTitle: { marginTop: space[3] },
  starters: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: space[2], marginTop: space[5] },
  missing: { marginTop: space[10] },
})
