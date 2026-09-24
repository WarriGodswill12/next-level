import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Avatar } from '@/components/Avatar'
import { Sheet } from '@/components/Sheet'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { PROSPECTS } from '@/data/demo'
import { tap } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'

type Props = {
  visible: boolean
  onClose: () => void
  role: 'athlete' | 'recruiter' | null
  onPhoto: () => void
  /** 'me' shares the signed-in athlete's own card. */
  onProfile: (profileId: string) => void
}

function Option({ icon, title, body, onPress }: { icon: ComponentProps<typeof Ionicons>['name']; title: string; body: string; onPress: () => void }) {
  const c = useThemeColors()
  return (
    <Pressable
      onPress={() => {
        tap()
        onPress()
      }}
      style={({ pressed }) => [styles.option, { borderColor: c.border, backgroundColor: pressed ? c.surface : 'transparent' }]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={[styles.icon, { backgroundColor: c.accentSoft }]}>
        <Ionicons name={icon} size={20} color={c.accent} />
      </View>
      <View style={styles.flex}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="small" color="textSecondary">
          {body}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={c.textTertiary} />
    </Pressable>
  )
}

/** Attach menu: photo for everyone; your card (athletes) or a prospect's card (recruiters). */
export function AttachSheet({ visible, onClose, role, onPhoto, onProfile }: Props) {
  const c = useThemeColors()
  const [picking, setPicking] = useState(false)

  const close = () => {
    setPicking(false)
    onClose()
  }

  return (
    <Sheet visible={visible} onClose={close} eyebrow="Attach" title={picking ? 'Share a prospect' : 'Add to message'}>
      {picking ? (
        PROSPECTS.map((p, i) => (
          <Pressable
            key={p.id}
            onPress={() => {
              tap()
              onProfile(p.id)
              close()
            }}
            style={({ pressed }) => [styles.person, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }, pressed && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel={`Share ${p.name}'s profile`}
          >
            <Avatar name={p.name} size={40} verified ring={c.surfaceElevated} />
            <View style={styles.flex}>
              <Text variant="bodyStrong">{p.name}</Text>
              <Text variant="small" color="textSecondary">
                {p.position} · Class of {p.classYear}
              </Text>
            </View>
            <Ionicons name="paper-plane-outline" size={18} color={c.accent} />
          </Pressable>
        ))
      ) : (
        <View style={styles.list}>
          <Option icon="image-outline" title="Photo" body="From your library" onPress={() => { close(); onPhoto() }} />
          {role === 'recruiter' ? (
            <Option icon="person-outline" title="Athlete profile" body="Share a prospect's card" onPress={() => setPicking(true)} />
          ) : (
            <Option icon="id-card-outline" title="My profile card" body="Send your card so they can open your profile" onPress={() => { onProfile('me'); close() }} />
          )}
        </View>
      )}
    </Sheet>
  )
}

const styles = StyleSheet.create({
  list: { gap: space[3] },
  option: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[4], borderWidth: 1, borderRadius: radius.xl },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  person: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3] },
})
