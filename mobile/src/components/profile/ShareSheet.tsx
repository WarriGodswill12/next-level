import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { useEffect, useState } from 'react'
import { Share, StyleSheet, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { Button } from '@/components/Button'
import { Sheet } from '@/components/Sheet'
import { Text } from '@/components/Text'
import { brand, radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { success } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'

/** Public profile link. TODO(backend): real profile URLs and slug uniqueness. */
export const profileLink = (name: string) =>
  `https://nextlevel.app/${(name || 'athlete').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

type Props = { visible: boolean; onClose: () => void; name: string; subtitle: string }

/** Share your profile: QR code to scan in person, a copyable link, and the native share sheet. */
export function ShareSheet({ visible, onClose, name, subtitle }: Props) {
  const c = useThemeColors()
  const [copied, setCopied] = useState(false)
  const link = profileLink(name)

  useEffect(() => {
    if (!visible) setCopied(false)
  }, [visible])

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      eyebrow="Share"
      title="Your profile"
      footer={
        <Button
          icon="share-outline"
          label="Share profile"
          onPress={() => Share.share({ message: `Check out ${name}'s Next Level profile: ${link}`, url: link }).catch(() => {})}
        />
      }
    >
      {/* QR sits on a white card in both themes so any camera can read it */}
      <View style={styles.qrCard}>
        <QRCode value={link} size={188} color={brand.navy} backgroundColor="#FFFFFF" ecl="M" />
        <Text style={styles.qrName} color="#0A0A0A" numberOfLines={1}>
          {name}
        </Text>
        <Text variant="small" color="#5C5C5F" numberOfLines={1}>
          {subtitle}
        </Text>
        <Text variant="eyebrow" color="#8A8A8E" style={styles.scan}>
          Scan to view profile
        </Text>
      </View>

      <View style={[styles.link, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Ionicons name="link" size={16} color={c.textSecondary} />
        <Text variant="small" color="textSecondary" numberOfLines={1} style={styles.flex} selectable>
          {link.replace('https://', '')}
        </Text>
        <Button
          size="md"
          variant={copied ? 'secondary' : 'primary'}
          icon={copied ? 'checkmark' : 'copy-outline'}
          label={copied ? 'Copied' : 'Copy'}
          style={styles.copy}
          onPress={async () => {
            await Clipboard.setStringAsync(link)
            success()
            setCopied(true)
          }}
        />
      </View>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  qrCard: { alignItems: 'center', alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: radius['2xl'], padding: space[5], width: '100%', maxWidth: 300 },
  qrName: { fontFamily: fonts.display, fontSize: 26, lineHeight: 28, textTransform: 'uppercase', marginTop: space[4] },
  scan: { marginTop: space[2] },
  link: { flexDirection: 'row', alignItems: 'center', gap: space[2], borderWidth: 1, borderRadius: radius.lg, paddingLeft: space[4], padding: space[2], marginTop: space[4] },
  copy: { minHeight: 38, paddingHorizontal: space[4] },
})
