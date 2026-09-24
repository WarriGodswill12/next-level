import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Sheet } from '@/components/Sheet'
import { Text } from '@/components/Text'
import { brand, radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Prospect } from '@/data/demo'
import { sportById } from '@/lib/sports'
import { useThemeColors } from '@/theme/ThemeProvider'
import { SPORT_TINT } from './AthleteCard'

type Props = {
  prospect: Prospect | null
  saved: boolean
  onClose: () => void
  onToggleSave: () => void
  onContact: () => void
  onViewProfile: () => void
}

/** Quick look at a prospect: identity, season line, and save / contact / full-profile actions. */
export function AthleteDetailSheet({ prospect: p, saved, onClose, onToggleSave, onContact, onViewProfile }: Props) {
  const c = useThemeColors()
  return (
    <Sheet
      visible={!!p}
      onClose={onClose}
      footer={
        p && (
          <>
            <View style={styles.actions}>
              <Button
                style={styles.flex}
                variant={saved ? 'secondary' : 'outline'}
                icon={saved ? 'bookmark' : 'bookmark-outline'}
                label={saved ? 'Saved' : 'Save'}
                onPress={onToggleSave}
              />
              <Button style={styles.flex} icon="chatbubble-ellipses-outline" label="Message" onPress={onContact} />
            </View>
            <Button variant="ghost" size="md" label="View full profile" trailingIcon="arrow-forward" onPress={onViewProfile} />
          </>
        )
      }
    >
      {p && (
        <View>
          <View style={styles.banner}>
            <LinearGradient colors={SPORT_TINT[p.sport] ?? SPORT_TINT.football} start={{ x: 0.9, y: 0 }} end={{ x: 0.1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Avatar name={p.name} size={64} verified ring={brand.navy} />
            <View style={styles.flex}>
              <Text style={styles.name} color="#FFFFFF" numberOfLines={2}>
                {p.name}
              </Text>
              <Text variant="small" color="rgba(255,255,255,0.72)">
                {p.position} · {sportById(p.sport)?.label} · Class of {p.classYear}
              </Text>
            </View>
            <Text style={styles.jersey} color="rgba(255,255,255,0.9)">
              #{p.number}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="school-outline" size={15} color={c.textSecondary} />
            <Text variant="small" color="textSecondary" style={styles.flex}>
              {p.school} · {p.location}
              {p.height ? ` · ${p.height}` : ''}
            </Text>
          </View>

          <Text variant="eyebrow" color="textTertiary" style={styles.label}>
            MaxStats · season
          </Text>
          <View style={[styles.line, { backgroundColor: c.surface, borderColor: c.border }]}>
            {p.line.map((s, i) => (
              <View key={s.key} style={[styles.cell, i > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: c.border }]}>
                <Text style={styles.value}>{s.value}</Text>
                <Text variant="eyebrow" color="textTertiary">
                  {s.key}
                </Text>
              </View>
            ))}
          </View>

          <Text variant="body" color="textSecondary" style={styles.bio}>
            {p.bio}
          </Text>
        </View>
      )}
    </Sheet>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[4], borderRadius: radius.xl, overflow: 'hidden' },
  name: { fontFamily: fonts.display, fontSize: 28, lineHeight: 28, textTransform: 'uppercase' },
  jersey: { fontFamily: fonts.display, fontSize: 30, alignSelf: 'flex-start' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: space[2], marginTop: space[4] },
  label: { marginTop: space[5], marginBottom: space[2] },
  line: { flexDirection: 'row', borderWidth: 1, borderRadius: radius.lg, paddingVertical: space[3] },
  cell: { flex: 1, alignItems: 'center' },
  value: { fontFamily: fonts.display, fontSize: 28, lineHeight: 30 },
  bio: { marginTop: space[4] },
  actions: { flexDirection: 'row', gap: space[3] },
})
