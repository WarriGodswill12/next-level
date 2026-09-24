import type { ReactNode } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { tap } from '@/lib/haptics'
import { Text } from './Text'

type Props = {
  title: string
  /** Small count or context shown after the title. */
  meta?: string
  action?: string
  onAction?: () => void
  /** Custom element on the right instead of a text action. */
  right?: ReactNode
}

/** Dashboard section title: condensed display label, optional mono meta, right-side action. */
export function SectionHeader({ title, meta, action, onAction, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text variant="displayS" accessibilityRole="header">
          {title}
        </Text>
        {meta && (
          <Text variant="eyebrow" color="textTertiary" style={styles.meta}>
            {meta}
          </Text>
        )}
      </View>
      {right ??
        (action && (
          <Pressable
            onPress={() => {
              tap()
              onAction?.()
            }}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={action}
          >
            <Text variant="small" color="accent" style={styles.action}>
              {action}
            </Text>
          </Pressable>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: space[3] },
  left: { flexDirection: 'row', alignItems: 'baseline', gap: space[2], flexShrink: 1 },
  meta: { marginBottom: 2 },
  action: { fontFamily: fonts.bodySemi },
})
