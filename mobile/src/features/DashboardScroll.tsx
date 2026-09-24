import type { ReactNode } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { space } from '@/design/tokens'
import { useThemeColors } from '@/theme/ThemeProvider'

/** Scroll container shared by both dashboards: safe-area top, pull to refresh, section rhythm. */
export function DashboardScroll({ header, children, refreshing, onRefresh }: { header: ReactNode; children: ReactNode; refreshing: boolean; onRefresh: () => void }) {
  const c = useThemeColors()
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + space[3] }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.accent} colors={[c.accent]} />}
      >
        {header}
        {children}
      </ScrollView>
    </View>
  )
}

export function Section({ children, first }: { children: ReactNode; first?: boolean }) {
  return <View style={first ? styles.first : styles.section}>{children}</View>
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: space[5], paddingBottom: space[10] },
  first: { marginTop: space[5] },
  section: { marginTop: space[8] },
})
