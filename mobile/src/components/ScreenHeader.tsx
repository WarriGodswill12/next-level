import { router } from 'expo-router'
import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { space } from '@/design/tokens'
import { IconChip } from './IconChip'
import { Text } from './Text'

/** Tab-root header: large left-aligned title, no back chevron, optional right chip. */
export function TabRootHeader({ title, right }: { title: string; right?: ReactNode }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.root, { paddingTop: insets.top + space[3] }]}>
      <Text variant="displayL" accessibilityRole="header">
        {title}
      </Text>
      {right}
    </View>
  )
}

/** Pushed sub-screen header: back chip + centered title. */
export function SubHeader({ title, right, onBack }: { title: string; right?: ReactNode; onBack?: () => void }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.sub, { paddingTop: insets.top + space[2] }]}>
      <IconChip icon="chevron-back" label="Go back" onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/home')))} />
      <Text variant="displayS" style={styles.subTitle} numberOfLines={1} accessibilityRole="header">
        {title}
      </Text>
      <View style={styles.slot}>{right}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space[5], paddingBottom: space[4] },
  sub: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space[5], paddingBottom: space[3], gap: space[3] },
  subTitle: { flex: 1, textAlign: 'center' },
  slot: { width: 40, alignItems: 'flex-end' },
})
