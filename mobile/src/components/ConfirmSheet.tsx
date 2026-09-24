import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { space } from '@/design/tokens'
import { warn } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'
import { Button } from './Button'
import { Sheet } from './Sheet'
import { Text } from './Text'

type Props = {
  visible: boolean
  title: string
  message: string
  confirmLabel: string
  icon?: ComponentProps<typeof Ionicons>['name']
  onConfirm: () => void
  onCancel: () => void
}

/** Bottom-sheet confirmation for destructive or irreversible actions (never the OS alert). */
export function ConfirmSheet({ visible, title, message, confirmLabel, icon = 'alert-circle', onConfirm, onCancel }: Props) {
  const c = useThemeColors()

  useEffect(() => {
    if (visible) warn()
  }, [visible])

  return (
    <Sheet visible={visible} onClose={onCancel} scroll={false}>
      <View style={styles.center}>
        <View style={[styles.icon, { backgroundColor: 'rgba(239,68,68,0.12)' }]}>
          <Ionicons name={icon} size={26} color={c.danger} />
        </View>
        <Text variant="displayS" align="center" accessibilityRole="header">
          {title}
        </Text>
        <Text variant="body" color="textSecondary" align="center" style={styles.msg}>
          {message}
        </Text>
      </View>
      <View style={styles.actions}>
        <Button label={confirmLabel} onPress={onConfirm} style={{ backgroundColor: c.danger, shadowOpacity: 0 }} />
        <Button variant="secondary" label="Cancel" onPress={onCancel} />
      </View>
    </Sheet>
  )
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[4],
  },
  msg: { marginTop: space[2], marginBottom: space[6], maxWidth: 320 },
  actions: { gap: space[3] },
})
