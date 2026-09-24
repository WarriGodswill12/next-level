import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'
import Svg, { Defs, Line, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg'
import { brand } from '@/design/tokens'
import { fonts } from '@/design/typography'

type Props = {
  /** Draw outlined yard numbers along the bottom (tall headers only). */
  numbers?: boolean
  /** Where the stadium-light glow sits, as fractions of width/height. */
  glow?: { x: number; y: number }
}

const YARDS = ['10', '20', '30', '40', '50', '40', '30', '20', '10']

/**
 * The fixed navy brand surface: gradient, stadium-light bloom and yard lines.
 * Same in light and dark mode by design (brand chrome, not a theme surface).
 */
export function BrandBackdrop({ numbers = false, glow = { x: 0.85, y: 0.15 } }: Props) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[brand.navy2, brand.navy, '#070D1F']}
        locations={[0, 0.55, 1]}
        start={{ x: 0.9, y: 0 }}
        end={{ x: 0.2, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="bloom" cx={`${glow.x * 100}%`} cy={`${glow.y * 100}%`} rx="70%" ry="55%">
            <Stop offset="0" stopColor="#0B5FFF" stopOpacity={0.55} />
            <Stop offset="0.5" stopColor="#0B5FFF" stopOpacity={0.12} />
            <Stop offset="1" stopColor="#0B5FFF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="flare" cx="96%" cy="0%" rx="30%" ry="18%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.28} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bloom)" />
        <Rect width="100%" height="100%" fill="url(#flare)" />
        {YARDS.map((_, i) =>
          i === 0 ? null : (
            <Line
              key={i}
              x1={`${(i / YARDS.length) * 100}%`}
              x2={`${(i / YARDS.length) * 100}%`}
              y1="0"
              y2="100%"
              stroke="#FFFFFF"
              strokeOpacity={0.055}
              strokeWidth={1}
            />
          ),
        )}
        {numbers &&
          YARDS.map((n, i) =>
            i === 0 ? null : (
              <SvgText
                key={`n${i}`}
                x={`${(i / YARDS.length) * 100}%`}
                y="93%"
                textAnchor="middle"
                fontFamily={fonts.display}
                fontSize={34}
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity={0.1}
                strokeWidth={1}
              >
                {n}
              </SvgText>
            ),
          )}
      </Svg>
    </View>
  )
}
