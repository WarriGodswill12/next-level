import { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { brand } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { Text } from './Text'

const SPORTS = ['Football', 'Basketball', 'Soccer', 'Baseball', 'Track & Field', 'Volleyball', 'Softball', 'Tennis', 'Swimming']

function Chevron({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path d="M5 15 12 8l7 7" fill="none" stroke={color} strokeWidth={3.6} strokeLinecap="square" />
    </Svg>
  )
}

/** Looping marquee band of sports, slanted like broadcast tape. */
export function Ticker({ tilt = -3, speed = 40, tone = 'blue' }: { tilt?: number; speed?: number; tone?: 'blue' | 'ghost' }) {
  const x = useRef(new Animated.Value(0)).current
  const [half, setHalf] = useState(0)

  useEffect(() => {
    if (!half) return
    let loop: Animated.CompositeAnimation | null = null
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (reduced) return
      x.setValue(tone === 'blue' ? 0 : -half)
      loop = Animated.loop(
        Animated.timing(x, {
          toValue: tone === 'blue' ? -half : 0,
          duration: (half / speed) * 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      )
      loop.start()
    })
    return () => loop?.stop()
  }, [half, speed, tone, x])

  const blue = tone === 'blue'
  const items = [...SPORTS, ...SPORTS]

  return (
    <View
      style={[styles.band, blue ? styles.blue : styles.ghost, { transform: [{ rotate: `${tilt}deg` }] }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View
        style={[styles.track, { transform: [{ translateX: x }] }]}
        onLayout={(e) => setHalf(e.nativeEvent.layout.width / 2)}
      >
        {items.map((s, i) => (
          <View key={i} style={styles.item}>
            <Text style={[styles.word, !blue && styles.ghostWord]} color={blue ? '#FFFFFF' : 'rgba(255,255,255,0.28)'}>
              {s}
            </Text>
            <Chevron color={blue ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)'} />
          </View>
        ))}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  band: {
    width: '130%',
    marginLeft: '-15%',
    paddingVertical: 10,
    overflow: 'hidden',
  },
  blue: {
    backgroundColor: brand.blue,
    shadowColor: brand.blue,
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  ghost: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  track: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 16,
  },
  word: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 34,
    textTransform: 'uppercase',
  },
  ghostWord: {
    fontSize: 26,
    lineHeight: 30,
  },
})
