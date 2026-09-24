import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, View } from 'react-native'
import Svg, { Line, Text as SvgText } from 'react-native-svg'
import { brand, radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { tap } from '@/lib/haptics'
import { LogoMark } from './Logo'
import { Text } from './Text'

export type CardData = {
  name: string
  number: string
  position: string
  sport: string
  classYear: string
  location: string
  school?: string
  height?: string
  weight?: string
  /** 0–100, drives the back of the card. */
  strength: number
  nextSteps: string[]
}

const W = 300
const H = 420

/**
 * Pro-style profile card; tap to flip to the scouting report. Brand chrome, not themed.
 * `flippable={false}` shows the front only (e.g. another athlete's card, whose back would be meaningless).
 */
export function TradingCard({ data, width = W, flippable = true }: { data: CardData; width?: number; flippable?: boolean }) {
  const scale = width / W
  const flip = useRef(new Animated.Value(0)).current
  const shine = useRef(new Animated.Value(0)).current
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (reduced) return
      loop = Animated.loop(
        Animated.sequence([
          Animated.delay(900),
          Animated.timing(shine, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(shine, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.delay(2200),
        ]),
      )
      loop.start()
    })
    return () => loop?.stop()
  }, [shine])

  const toggle = () => {
    tap()
    const to = flipped ? 0 : 1
    setFlipped(!flipped)
    Animated.spring(flip, { toValue: to, useNativeDriver: true, speed: 10, bounciness: 6 }).start()
  }

  const frontRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
  const backRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] })
  const shineX = shine.interpolate({ inputRange: [0, 1], outputRange: [-W * 1.2, W * 1.2] })

  return (
    <Pressable
      onPress={flippable ? toggle : undefined}
      disabled={!flippable}
      accessibilityRole={flippable ? 'button' : 'image'}
      accessibilityLabel={
        flippable ? (flipped ? 'Show front of your card' : 'Flip your card to see the scouting report') : `${data.name}, ${data.position}, ${data.sport}`
      }
      style={{ width: W * scale, height: H * scale }}
    >
      <View style={{ width: W, height: H, transform: [{ scale }], transformOrigin: 'top left' }}>
        {/* front */}
        <Animated.View style={[styles.face, { transform: [{ perspective: 1200 }, { rotateY: frontRotate }] }]}>
          <LinearGradient colors={[brand.navy2, brand.navy, '#050A18']} start={{ x: 0.8, y: 0 }} end={{ x: 0.2, y: 1 }} style={StyleSheet.absoluteFill} />
          <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
            {Array.from({ length: 7 }).map((_, i) => (
              <Line key={i} x1={(i + 1) * 40} x2={(i + 1) * 40} y1={0} y2={H * 0.7} stroke="#FFFFFF" strokeOpacity={0.07} />
            ))}
            <SvgText
              x={W / 2}
              y={H * 0.62}
              textAnchor="middle"
              fontFamily={fonts.display}
              fontSize={230}
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth={1.5}
            >
              {data.number || '00'}
            </SvgText>
          </Svg>

          <View style={styles.top}>
            <View style={styles.brandRow}>
              <LogoMark size={20} />
              <Text style={styles.brand} color="#FFFFFF">
                NEXT LEVEL
              </Text>
            </View>
            <View style={styles.season}>
              <Text variant="eyebrow" color="#FFFFFF" style={styles.seasonText}>
                {data.classYear ? `CLASS ${data.classYear}` : '2026'}
              </Text>
            </View>
          </View>

          <View style={styles.diamond}>
            <Text style={styles.diamondText} color={brand.navy}>
              {data.position || '—'}
            </Text>
          </View>

          <View style={styles.bottom}>
            <View style={styles.plate}>
              <Text style={styles.plateName} color="#0A0A0A" numberOfLines={1}>
                {data.name.split(' ')[0]}{' '}
                <Text style={styles.plateName} color={brand.blue}>
                  {data.name.split(' ').slice(1).join(' ')}
                </Text>
              </Text>
              <View style={styles.plateMeta}>
                <Ionicons name="checkmark-circle" size={11} color={brand.blue} />
                <Text style={styles.plateMetaText} color="#4A4A4D" numberOfLines={1}>
                  {data.location || data.sport}
                </Text>
              </View>
            </View>
            <View style={styles.stats}>
              {[
                [data.sport || '—', 'Sport'],
                [data.height || '—', 'Height'],
                [data.weight ? `${data.weight}` : '—', 'Weight'],
              ].map(([v, k]) => (
                <View key={k} style={styles.stat}>
                  <Text style={styles.statValue} color="#FFFFFF" numberOfLines={1}>
                    {v}
                  </Text>
                  <Text variant="eyebrow" color="rgba(255,255,255,0.6)" style={styles.statKey}>
                    {k}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* foil shine sweep */}
          <Animated.View pointerEvents="none" style={[styles.shineWrap, { transform: [{ translateX: shineX }, { rotate: '20deg' }] }]}>
            <LinearGradient
              colors={['transparent', 'rgba(255,120,220,0.18)', 'rgba(120,230,255,0.28)', 'rgba(255,245,150,0.18)', 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </Animated.View>

        {/* back */}
        {flippable && (
        <Animated.View style={[styles.face, styles.back, { transform: [{ perspective: 1200 }, { rotateY: backRotate }] }]}>
          <View style={styles.backHead}>
            <Text variant="eyebrow" color="#5C9BFF">
              Scouting report
            </Text>
            <LogoMark size={22} />
          </View>
          <Text style={styles.backName} color="#F5F5F5" numberOfLines={1}>
            {data.name}
          </Text>
          <Text variant="small" color="#A8A8A8" numberOfLines={1}>
            {[data.position, data.sport, data.school].filter(Boolean).join(' · ')}
          </Text>

          <View style={styles.backBlock}>
            <View style={styles.backRow}>
              <Text variant="eyebrow" color="#6E6E70">
                Profile strength
              </Text>
              <Text variant="eyebrow" color="#F5F5F5">
                {data.strength}%
              </Text>
            </View>
            <View style={styles.track}>
              <LinearGradient colors={[brand.blue, '#3B82F6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.fill, { width: `${data.strength}%` }]} />
            </View>
          </View>

          <View style={styles.backBlock}>
            <Text variant="eyebrow" color="#6E6E70">
              Next plays
            </Text>
            {data.nextSteps.map((s) => (
              <View key={s} style={styles.step}>
                <View style={styles.stepDot}>
                  <Ionicons name="add" size={12} color="#FFFFFF" />
                </View>
                <Text variant="small" color="#F5F5F5">
                  {s}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.backFoot}>
            <Ionicons name="sync" size={12} color="#6E6E70" />
            <Text variant="caption" color="#6E6E70">
              Tap to flip back
            </Text>
          </View>
        </Animated.View>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  face: {
    position: 'absolute',
    width: W,
    height: H,
    borderRadius: radius['2xl'] + 2,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: space[4],
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  brand: { fontFamily: fonts.display, fontSize: 16 },
  season: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.3)' },
  seasonText: { fontSize: 9 },
  diamond: {
    position: 'absolute',
    top: 60,
    right: 18,
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  diamondText: { fontFamily: fonts.display, fontSize: 16, transform: [{ rotate: '-45deg' }] },
  bottom: { marginTop: 'auto' },
  plate: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginRight: 26,
    marginLeft: -2,
    transform: [{ skewX: '-8deg' }],
  },
  plateName: { fontFamily: fonts.display, fontSize: 26, lineHeight: 26, textTransform: 'uppercase' },
  plateMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  plateMetaText: { fontFamily: fonts.monoMedium, fontSize: 8.5, letterSpacing: 0.6, textTransform: 'uppercase' },
  stats: {
    flexDirection: 'row',
    marginTop: space[3],
    paddingTop: space[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  stat: { flex: 1 },
  statValue: { fontFamily: fonts.display, fontSize: 22, lineHeight: 24, textTransform: 'uppercase' },
  statKey: { fontSize: 8.5 },
  shineWrap: { position: 'absolute', top: -80, bottom: -80, width: 140 },
  back: { backgroundColor: '#141416', gap: space[3] },
  backHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backName: { fontFamily: fonts.display, fontSize: 32, lineHeight: 32, textTransform: 'uppercase', marginTop: space[1] },
  backBlock: {
    gap: space[2],
    paddingTop: space[3],
    borderTopWidth: 1,
    borderTopColor: '#2A2A2C',
  },
  backRow: { flexDirection: 'row', justifyContent: 'space-between' },
  track: { height: 6, borderRadius: 3, backgroundColor: '#2A2A2C', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  step: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  stepDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: brand.blue, alignItems: 'center', justifyContent: 'center' },
  backFoot: { marginTop: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center' },
})
