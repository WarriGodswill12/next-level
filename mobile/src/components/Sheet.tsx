import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Animated, Easing, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { radius, space } from '@/design/tokens'
import { useThemeColors } from '@/theme/ThemeProvider'
import { IconChip } from './IconChip'
import { Text } from './Text'

type Props = {
  visible: boolean
  onClose: () => void
  title?: string
  eyebrow?: string
  children: ReactNode
  /** Pinned under the scrollable content (e.g. primary actions). */
  footer?: ReactNode
  /** Scroll the body when content can exceed the sheet height. */
  scroll?: boolean
}

/** Bottom sheet: scrim, grabber, optional title row with close chip, animated slide-up. */
export function Sheet({ visible, onClose, title, eyebrow, children, footer, scroll = true }: Props) {
  const c = useThemeColors()
  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const v = useRef(new Animated.Value(0)).current
  const [mounted, setMounted] = useState(visible)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      Animated.timing(v, { toValue: 1, duration: 340, easing: Easing.bezier(0.2, 0.8, 0.2, 1), useNativeDriver: true }).start()
    } else {
      Animated.timing(v, { toValue: 0, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(() => setMounted(false))
    }
  }, [visible, v])

  const Body = scroll ? ScrollView : View

  return (
    <Modal transparent visible={mounted} onRequestClose={onClose} statusBarTranslucent animationType="none">
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, { opacity: v }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
      </Animated.View>
      <KeyboardAvoidingView style={styles.anchor} behavior={Platform.OS === 'ios' ? 'padding' : undefined} pointerEvents="box-none">
        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              backgroundColor: c.surfaceElevated,
              maxHeight: height * 0.88,
              paddingBottom: insets.bottom + space[4],
              transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [height * 0.6, 0] }) }],
            },
          ]}
        >
          <View style={[styles.grabber, { backgroundColor: c.borderStrong }]} />
          {title && (
            <View style={styles.head}>
              <View style={styles.flex}>
                {eyebrow && (
                  <Text variant="eyebrow" color="textSecondary">
                    {eyebrow}
                  </Text>
                )}
                <Text variant="displayS" accessibilityRole="header">
                  {title}
                </Text>
              </View>
              <IconChip icon="close" label="Close" onPress={onClose} />
            </View>
          )}
          <Body
            style={styles.flexShrink}
            contentContainerStyle={scroll ? styles.body : undefined}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {scroll ? children : <View style={styles.body}>{children}</View>}
          </Body>
          {footer && <View style={styles.footer}>{footer}</View>}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  scrim: { backgroundColor: 'rgba(0,0,0,0.55)' },
  anchor: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: radius['3xl'] + 4,
    borderTopRightRadius: radius['3xl'] + 4,
    paddingTop: space[3],
  },
  grabber: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: space[4] },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[5],
    paddingBottom: space[3],
  },
  flex: { flex: 1, gap: 4 },
  flexShrink: { flexShrink: 1 },
  body: { paddingHorizontal: space[5], paddingBottom: space[2] },
  footer: { paddingHorizontal: space[5], paddingTop: space[3], gap: space[2] },
})
