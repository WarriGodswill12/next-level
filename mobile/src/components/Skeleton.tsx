import { useEffect, useRef } from 'react'
import { AccessibilityInfo, Animated, Easing } from 'react-native'
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native'
import { radius as r } from '@/design/tokens'
import { useThemeColors } from '@/theme/ThemeProvider'

type Props = {
  width?: DimensionValue
  height?: number
  radius?: number
  style?: StyleProp<ViewStyle>
}

/**
 * Pulsing placeholder block. Only for data-dependent content — static chrome
 * (headers, search, section titles) renders immediately.
 */
export function Skeleton({ width = '100%', height = 14, radius = r.md, style }: Props) {
  const c = useThemeColors()
  const v = useRef(new Animated.Value(0.55)).current

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (reduced) return
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.55, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]),
      )
      loop.start()
    })
    return () => loop?.stop()
  }, [v])

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius: radius, backgroundColor: c.border, opacity: v }, style]}
    />
  )
}
