import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Avatar } from '@/components/Avatar'
import { ConfirmSheet } from '@/components/ConfirmSheet'
import { LinkRow, SettingsGroup, SwitchRow } from '@/components/profile/SettingsRow'
import { PressableScale } from '@/components/PressableScale'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { select, tap } from '@/lib/haptics'
import { pickProfilePhoto } from '@/lib/photo'
import { useSession } from '@/state/session'
import type { ThemePreference } from '@/theme/ThemeProvider'
import { useTheme, useThemeColors, useElevation } from '@/theme/ThemeProvider'

export function SectionLabel({ children, action, onAction }: { children: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.labelRow}>
      <Text variant="eyebrow" color="textSecondary">
        {children}
      </Text>
      {action && (
        <Pressable onPress={onAction} hitSlop={10} accessibilityRole="button" accessibilityLabel={action}>
          <Text variant="small" color="accent" style={styles.bold}>
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  )
}

/** Photo + bio. The photo has its own camera badge; an empty bio invites one. */
export function AboutBlock() {
  const c = useThemeColors()
  const lift = useElevation()
  const s = useSession()
  return (
    <View style={[styles.about, { backgroundColor: c.surface, borderColor: c.border }, lift]}>
      <Pressable
        onPress={async () => {
          tap()
          const uri = await pickProfilePhoto()
          if (uri) s.setPhoto(uri)
        }}
        accessibilityRole="button"
        accessibilityLabel={s.photo ? 'Change profile photo' : 'Add profile photo'}
      >
        <Avatar name={s.name || 'You'} size={64} uri={s.photo} />
        <View style={[styles.camera, { backgroundColor: c.accent, borderColor: c.surface }]}>
          <Ionicons name="camera" size={12} color="#FFFFFF" />
        </View>
      </Pressable>
      <Pressable style={styles.flex} onPress={() => router.push('/edit-profile')} accessibilityRole="button" accessibilityLabel={s.bio ? `Bio: ${s.bio}. Edit` : 'Add a short bio'}>
        {s.bio ? (
          <Text variant="body">{s.bio}</Text>
        ) : (
          <>
            <Text variant="bodyStrong">Add a short bio</Text>
            <Text variant="small" color="textSecondary">
              {s.role === 'recruiter' ? 'What your program looks for in a recruit.' : 'A line or two about your game and goals.'}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  )
}

function ActionButton({ icon, label, onPress, primary }: { icon: 'create-outline' | 'share-outline'; label: string; onPress: () => void; primary?: boolean }) {
  const c = useThemeColors()
  return (
    <PressableScale
      onPress={() => {
        tap()
        onPress()
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.action, primary ? { backgroundColor: c.accent } : { backgroundColor: c.surfaceElevated, borderColor: c.border, borderWidth: 1 }]}
    >
      <Ionicons name={icon} size={17} color={primary ? '#FFFFFF' : c.text} />
      <Text style={styles.actionText} color={primary ? '#FFFFFF' : 'text'}>
        {label}
      </Text>
    </PressableScale>
  )
}

export function ProfileActions({ onShare }: { onShare: () => void }) {
  return (
    <View style={styles.actions}>
      <ActionButton icon="create-outline" label="Edit profile" onPress={() => router.push('/edit-profile')} />
      <ActionButton icon="share-outline" label="Share" onPress={onShare} primary />
    </View>
  )
}

const PREFS: { value: ThemePreference; label: string; icon: 'phone-portrait-outline' | 'sunny-outline' | 'moon-outline' }[] = [
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
]

/** Appearance, notifications, account, sign out and delete account. */
export function SettingsSection() {
  const { colors: c, preference, setPreference } = useTheme()
  const s = useSession()
  const [confirm, setConfirm] = useState<null | 'signout' | 'delete'>(null)
  const recruiter = s.role === 'recruiter'

  return (
    <View>
      <SectionLabel>Appearance</SectionLabel>
      <View style={[styles.segment, { backgroundColor: c.track, borderColor: c.border }]} accessibilityRole="radiogroup">
        {PREFS.map((p) => {
          const on = preference === p.value
          return (
            <PressableScale
              key={p.value}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${p.label} theme`}
              scaleTo={0.95}
              onPress={() => {
                select()
                setPreference(p.value)
              }}
              style={[styles.segBtn, on && { backgroundColor: c.surfaceElevated, borderColor: c.border }]}
            >
              <Ionicons name={p.icon} size={16} color={on ? c.accent : c.textSecondary} />
              <Text style={styles.segLabel} color={on ? 'text' : 'textSecondary'}>
                {p.label}
              </Text>
            </PressableScale>
          )
        })}
      </View>

      <SectionLabel>Notifications</SectionLabel>
      <SettingsGroup>
        <SwitchRow first icon="chatbubbles-outline" label="Messages" hint="New messages and replies" value={s.notify.messages} onChange={(v) => s.setNotify({ messages: v })} />
        <SwitchRow
          icon={recruiter ? 'person-add-outline' : 'eye-outline'}
          label={recruiter ? 'New matches' : 'Profile activity'}
          hint={recruiter ? 'Athletes who fit your board' : 'Views, saves and favorites'}
          value={s.notify.views}
          onChange={(v) => s.setNotify({ views: v })}
        />
        <SwitchRow
          icon="calendar-outline"
          label={recruiter ? 'Weekly digest' : 'Camp reminders'}
          hint={recruiter ? 'A summary of your board every Monday' : 'Camps you marked interested'}
          value={s.notify.camps}
          onChange={(v) => s.setNotify({ camps: v })}
        />
      </SettingsGroup>

      <SectionLabel>Account</SectionLabel>
      <SettingsGroup>
        <View style={styles.infoRow}>
          <View style={[styles.infoIcon, { backgroundColor: c.accentSoft }]}>
            <Ionicons name="mail-outline" size={17} color={c.accent} />
          </View>
          <View style={styles.flex}>
            <Text variant="caption" color="textTertiary">
              Email
            </Text>
            <Text variant="bodyStrong" numberOfLines={1}>
              {s.email || 'Not set'}
            </Text>
          </View>
          <View style={[styles.rolePill, { borderColor: c.border }]}>
            <Text variant="eyebrow" color="textSecondary">
              {recruiter ? 'Recruiter' : 'Athlete'}
            </Text>
          </View>
        </View>
        <LinkRow icon="log-out-outline" label="Sign out" onPress={() => setConfirm('signout')} />
        <LinkRow icon="trash-outline" label="Delete account" danger onPress={() => setConfirm('delete')} />
      </SettingsGroup>

      <Text variant="caption" color="textTertiary" align="center" style={styles.version}>
        Next Level · v1.0.0
      </Text>

      <ConfirmSheet
        visible={confirm === 'signout'}
        icon="log-out-outline"
        title="Sign out?"
        message="You'll need your email and password to get back in on this device."
        confirmLabel="Sign out"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null)
          s.signOut()
          router.replace('/welcome')
        }}
      />
      <ConfirmSheet
        visible={confirm === 'delete'}
        icon="trash-outline"
        title="Delete account?"
        message="This permanently removes your profile, messages and stats. It can't be undone."
        confirmLabel="Delete account"
        onCancel={() => setConfirm(null)}
        onConfirm={async () => {
          setConfirm(null)
          await s.deleteAccount()
          router.replace('/welcome')
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bold: { fontFamily: fonts.bodySemi },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space[8], marginBottom: space[3] },
  about: { flexDirection: 'row', alignItems: 'center', gap: space[4], padding: space[4], borderWidth: 1, borderRadius: radius.xl },
  camera: { position: 'absolute', right: -2, bottom: -2, width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: space[3], marginTop: space[5] },
  action: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[2], minHeight: 48, borderRadius: radius.lg },
  actionText: { fontFamily: fonts.bodyBold, fontSize: 15 },
  segment: { flexDirection: 'row', borderWidth: 1, borderRadius: radius.lg, padding: 4, gap: 4 },
  segBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44, borderRadius: radius.md, borderWidth: 1, borderColor: 'transparent' },
  segLabel: { fontFamily: fonts.bodySemi, fontSize: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingHorizontal: space[4], paddingVertical: space[3], minHeight: 58 },
  infoIcon: { width: 34, height: 34, borderRadius: radius.md + 2, alignItems: 'center', justifyContent: 'center' },
  rolePill: { borderWidth: 1, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  version: { marginTop: space[8] },
})
