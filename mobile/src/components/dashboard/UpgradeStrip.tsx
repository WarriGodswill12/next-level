import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Button } from '@/components/Button'
import { PressableScale } from '@/components/PressableScale'
import { Sheet } from '@/components/Sheet'
import { Text } from '@/components/Text'
import { brand, radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { tap } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'

/** Quiet gold "Go Pro" row near the bottom of the scroll; dismissible. */
export function UpgradeStrip({ title, subtitle, onPress, onDismiss }: { title: string; subtitle: string; onPress: () => void; onDismiss: () => void }) {
  const c = useThemeColors()
  // The dismiss control is a sibling of the pressable row, never nested inside it.
  return (
    <View style={[styles.row, { backgroundColor: c.surface, borderColor: 'rgba(227,179,65,0.45)' }]}>
      <PressableScale
        onPress={() => {
          tap()
          onPress()
        }}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${subtitle}`}
        style={styles.main}
      >
        <View style={styles.icon}>
          <Ionicons name="star" size={16} color="#1A1300" />
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>
          <Text variant="small" color="textSecondary" numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={brand.gold} />
      </PressableScale>
      <Pressable
        onPress={() => {
          tap()
          onDismiss()
        }}
        hitSlop={12}
        style={styles.close}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      >
        <Ionicons name="close" size={16} color={c.textTertiary} />
      </Pressable>
    </View>
  )
}

/**
 * Placeholder until Pro plans and pricing exist: no invented features or prices.
 * TODO(product): replace with the real Pro offer.
 */
export function ProSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [notify, setNotify] = useState(false)
  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      eyebrow="Coming soon"
      title="Next Level Pro"
      footer={
        <Button
          variant={notify ? 'secondary' : 'primary'}
          icon={notify ? 'checkmark' : 'notifications-outline'}
          label={notify ? "You're on the list" : 'Notify me'}
          onPress={() => setNotify(true)}
          disabled={notify}
        />
      }
    >
      <View style={styles.proIcon}>
        <Ionicons name="star" size={26} color="#1A1300" />
      </View>
      <Text variant="body" color="textSecondary">
        Pro plans are on the way. Turn on notifications and we'll tell you the moment they launch.
      </Text>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  proIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: brand.gold, alignItems: 'center', justifyContent: 'center', marginBottom: space[4] },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[2], borderWidth: 1, borderRadius: radius.xl, paddingRight: space[3] },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[4], paddingRight: 0 },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: brand.gold, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, minWidth: 0 },
  title: { fontFamily: fonts.displayHeavy, fontSize: 20, lineHeight: 22, textTransform: 'uppercase', color: brand.gold },
  close: { marginLeft: space[1] },
})
