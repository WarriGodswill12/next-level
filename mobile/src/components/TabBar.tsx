import { Ionicons } from '@expo/vector-icons'
import type { BottomTabBarProps } from 'expo-router/js-tabs'
import type { ComponentProps } from 'react'
import { useEffect, useRef } from 'react'
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { select } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'
import { Text } from './Text'

type IconName = ComponentProps<typeof Ionicons>['name']

const ICONS: Record<string, [IconName, IconName]> = {
  home: ['home', 'home-outline'],
  discover: ['compass', 'compass-outline'],
  messages: ['chatbubbles', 'chatbubbles-outline'],
  profile: ['person-circle', 'person-circle-outline'],
}

function Tab({ focused, label, name, badge, onPress }: { focused: boolean; label: string; name: string; badge?: number; onPress: () => void }) {
  const c = useThemeColors()
  const lit = useRef(new Animated.Value(focused ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(lit, { toValue: focused ? 1 : 0, duration: 260, easing: Easing.bezier(0.2, 0.8, 0.2, 1), useNativeDriver: true }).start()
  }, [focused, lit])

  const [on, off] = ICONS[name] ?? ['ellipse', 'ellipse-outline']

  return (
    <Pressable
      onPress={onPress}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={badge ? `${label}, ${badge} unread` : label}
    >
      {/* lit bar above the active tab, like a scoreboard indicator */}
      <Animated.View style={[styles.bar, { backgroundColor: c.accent, opacity: lit, transform: [{ scaleX: lit }] }]} />
      <View>
        <Ionicons name={focused ? on : off} size={23} color={focused ? c.accent : c.textTertiary} />
        {!!badge && (
          <View style={[styles.badge, { borderColor: c.surface }]}>
            <Text style={styles.badgeText} color="#FFFFFF">
              {badge}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.label} color={focused ? 'text' : 'textTertiary'}>
        {label}
      </Text>
    </Pressable>
  )
}

/** Themed bottom tab bar. No floating action button by design. */
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const c = useThemeColors()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.wrap, { backgroundColor: c.surface, borderTopColor: c.border, paddingBottom: Math.max(insets.bottom, space[2]) }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]!
        const focused = state.index === index
        const label = typeof options.title === 'string' ? options.title : route.name
        const badge = typeof options.tabBarBadge === 'number' ? options.tabBarBadge : undefined
        return (
          <Tab
            key={route.key}
            name={route.name}
            label={label}
            focused={focused}
            badge={badge}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
              if (!focused && !event.defaultPrevented) {
                select()
                navigation.navigate(route.name, route.params)
              }
            }}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: space[2] },
  tab: { flex: 1, alignItems: 'center', gap: 3, paddingTop: 4, minHeight: 50 },
  bar: { position: 'absolute', top: -space[2], width: 28, height: 3, borderRadius: 2 },
  label: { fontFamily: fonts.bodySemi, fontSize: 11, lineHeight: 14 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    borderWidth: 2,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 10, lineHeight: 12 },
})
