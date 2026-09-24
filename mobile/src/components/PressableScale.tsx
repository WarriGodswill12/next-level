import { useRef } from 'react'
import { Animated, Pressable } from 'react-native'
import type { PressableProps, StyleProp, ViewStyle } from 'react-native'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>
  /** How far the element shrinks while pressed. */
  scaleTo?: number
}

/**
 * Pressable that springs down slightly on touch — the base of every tappable surface.
 * The style (including layout like width/flex) lives on the Pressable itself so it
 * behaves as a normal flex item.
 */
export function PressableScale({ style, scaleTo = 0.97, onPressIn, onPressOut, ...rest }: Props) {
  const scale = useRef(new Animated.Value(1)).current
  const to = (v: number) => Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 6 }).start()

  return (
    <AnimatedPressable
      {...rest}
      style={[style, { transform: [{ scale }] }]}
      onPressIn={(e) => {
        to(scaleTo)
        onPressIn?.(e)
      }}
      onPressOut={(e) => {
        to(1)
        onPressOut?.(e)
      }}
    />
  )
}
