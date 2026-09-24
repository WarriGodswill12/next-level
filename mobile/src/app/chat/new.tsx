import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { Avatar } from '@/components/Avatar'
import { noFocusRing } from '@/components/Input'
import { SubHeader } from '@/components/ScreenHeader'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { ATHLETE_CONTACTS, PROSPECTS } from '@/data/demo'
import { tap } from '@/lib/haptics'
import { useChat } from '@/state/chat'
import { useSession } from '@/state/session'
import { useThemeColors } from '@/theme/ThemeProvider'

type Person = { id: string; name: string; subtitle: string; personId?: string }

/** Pick a recipient: recruiters see athletes, athletes see coaches and scouts. */
export default function NewMessage() {
  const c = useThemeColors()
  const { role } = useSession()
  const chat = useChat()
  const [q, setQ] = useState('')

  const people: Person[] =
    role === 'recruiter'
      ? PROSPECTS.map((p) => ({ id: `new-${p.id}`, name: p.name, subtitle: `${p.position} · Class of ${p.classYear}`, personId: p.id }))
      : ATHLETE_CONTACTS
  const needle = q.trim().toLowerCase()
  const list = people.filter((p) => !needle || `${p.name} ${p.subtitle}`.toLowerCase().includes(needle))
  const existing = new Set(chat.convos.flatMap((cv) => [cv.id, cv.personId].filter(Boolean) as string[]))

  const open = (p: Person) => {
    tap()
    const id = chat.start(p)
    router.replace({ pathname: '/chat/[id]', params: { id } })
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <SubHeader title="New message" />
      <View style={styles.pad}>
        <View style={[styles.search, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text variant="label" color="textSecondary">
            To:
          </Text>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={role === 'recruiter' ? 'Search athletes' : 'Search coaches and scouts'}
            placeholderTextColor={c.textTertiary}
            selectionColor={c.accent}
            autoFocus
            style={[styles.input, { color: c.text }, noFocusRing]}
            accessibilityLabel="Recipient"
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
        <Text variant="eyebrow" color="textTertiary" style={styles.label}>
          {role === 'recruiter' ? 'Athletes' : 'Coaches & scouts'}
        </Text>
        {list.map((p, i) => {
          const talking = existing.has(p.id) || (!!p.personId && existing.has(p.personId))
          return (
            <Pressable
              key={p.id}
              onPress={() => open(p)}
              style={({ pressed }) => [styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel={`Message ${p.name}, ${p.subtitle}`}
            >
              <Avatar name={p.name} size={44} verified={!!p.personId} />
              <View style={styles.flex}>
                <Text variant="bodyStrong">{p.name}</Text>
                <Text variant="small" color="textSecondary">
                  {p.subtitle}
                </Text>
              </View>
              {talking ? (
                <Text variant="eyebrow" color="textTertiary">
                  In messages
                </Text>
              ) : (
                <Ionicons name="chatbubble-ellipses-outline" size={18} color={c.accent} />
              )}
            </Pressable>
          )
        })}
        {!list.length && (
          <Text variant="body" color="textSecondary" align="center" style={styles.none}>
            No one matches “{q.trim()}”.
          </Text>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  pad: { paddingHorizontal: space[5] },
  search: { flexDirection: 'row', alignItems: 'center', gap: space[2], borderWidth: 1, borderRadius: radius.full, paddingHorizontal: space[4], minHeight: 46 },
  input: { flex: 1, minWidth: 0, fontFamily: fonts.bodyMedium, fontSize: 15, paddingVertical: space[2] },
  list: { paddingHorizontal: space[5], paddingBottom: space[10] },
  label: { marginTop: space[5], marginBottom: space[1] },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3] },
  none: { marginTop: space[8] },
})
