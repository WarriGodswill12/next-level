import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { AccessibilityInfo, Animated, Easing, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1)

/** Fades and lifts children in on mount. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  style,
}: {
  children: ReactNode
  delay?: number
  y?: number
  style?: StyleProp<ViewStyle>
}) {
  const v = useRef(new Animated.Value(0)).current
  useEffect(() => {
    let cancelled = false
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (cancelled) return
      if (reduced) v.setValue(1)
      else Animated.timing(v, { toValue: 1, duration: 700, delay, easing: EASE, useNativeDriver: true }).start()
    })
    return () => {
      cancelled = true
    }
  }, [v, delay])

  return (
    <Animated.View
      style={[style, { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [y, 0] }) }] }]}
    >
      {children}
    </Animated.View>
  )
}

/** Headline lines that slide up from behind a mask, one after another. */
export function MaskLines({ lines, delay = 0, lineHeight }: { lines: ReactNode[]; delay?: number; lineHeight: number }) {
  return (
    <View>
      {lines.map((line, i) => (
        <MaskLine key={i} delay={delay + i * 110} lineHeight={lineHeight}>
          {line}
        </MaskLine>
      ))}
    </View>
  )
}

function MaskLine({ children, delay, lineHeight }: { children: ReactNode; delay: number; lineHeight: number }) {
  const v = useRef(new Animated.Value(0)).current
  useEffect(() => {
    let cancelled = false
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (cancelled) return
      if (reduced) v.setValue(1)
      else Animated.timing(v, { toValue: 1, duration: 900, delay, easing: EASE, useNativeDriver: true }).start()
    })
    return () => {
      cancelled = true
    }
  }, [v, delay])

  return (
    <View style={{ overflow: 'hidden', height: lineHeight + 4, paddingTop: 4 }}>
      <Animated.View style={{ transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [lineHeight + 8, 0] }) }] }}>
        {children}
      </Animated.View>
    </View>
  )
}
