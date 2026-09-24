import { StyleSheet, View } from 'react-native'
import Svg, { Path, Rect } from 'react-native-svg'
import { brand } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { Text } from './Text'

export function LogoMark({ size = 30, inverted = false }: { size?: number; inverted?: boolean }) {
  const bg = inverted ? '#FFFFFF' : brand.blue
  const fg = inverted ? brand.blue : '#FFFFFF'
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Rect width="32" height="32" rx="7" fill={bg} />
      <Path d="M9 20.5 16 13.5l7 7" fill="none" stroke={fg} strokeWidth={3.2} strokeLinecap="square" />
      <Path d="M9 13 16 6l7 7" fill="none" stroke={fg} strokeOpacity={0.45} strokeWidth={3.2} strokeLinecap="square" />
      <Rect x="9" y="24" width="14" height="2.6" fill={fg} />
    </Svg>
  )
}

/** Mark + wordmark. `light` for use on the navy brand header. */
export function Logo({ light = false, size = 28 }: { light?: boolean; size?: number }) {
  return (
    <View style={styles.row} accessibilityRole="image" accessibilityLabel="Next Level">
      <LogoMark size={size} />
      <Text style={[styles.word, { fontSize: size * 0.82 }]} color={light ? '#FFFFFF' : 'text'}>
        NEXT<Text style={[styles.word, { fontSize: size * 0.82 }]} color="#5C9BFF">
          {' '}LEVEL
        </Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  word: {
    fontFamily: fonts.display,
    letterSpacing: 0.2,
  },
})
