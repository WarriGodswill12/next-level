import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { MessageRow } from '@/components/dashboard/MessagesPreview'
import { noFocusRing } from '@/components/Input'
import { TabRootHeader } from '@/components/ScreenHeader'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { router } from 'expo-router'
import { IconChip } from '@/components/IconChip'
import { useChat } from '@/state/chat'
import { useThemeColors } from '@/theme/ThemeProvider'

export default function Messages() {
  const c = useThemeColors()
  const chat = useChat()
  const [q, setQ] = useState('')
  const all = chat.rows
  const items = all.filter((m) => `${m.name} ${m.subtitle} ${m.snippet}`.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <TabRootHeader title="Messages" right={<IconChip icon="create-outline" label="New message" onPress={() => router.push('/chat/new')} />} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.search, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Ionicons name="search" size={17} color={c.textTertiary} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search conversations"
            placeholderTextColor={c.textTertiary}
            selectionColor={c.accent}
            style={[styles.input, { color: c.text }, noFocusRing]}
            accessibilityLabel="Search conversations"
          />
        </View>
        {items.length ? (
          items.map((m, i) => <MessageRow key={m.id} m={m} first={i === 0} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: m.id } })} />)
        ) : (
          <Text variant="body" color="textSecondary" align="center" style={styles.none}>
            No conversations match “{q.trim()}”.
          </Text>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: space[5], paddingBottom: space[10] },
  search: { flexDirection: 'row', alignItems: 'center', gap: space[2], borderWidth: 1, borderRadius: radius.full, paddingHorizontal: space[4], minHeight: 46, marginBottom: space[3] },
  input: { flex: 1, minWidth: 0, fontFamily: fonts.bodyMedium, fontSize: 15, paddingVertical: space[2] },
  none: { marginTop: space[8] },
})
