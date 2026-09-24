import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Image, StyleSheet, View } from 'react-native'
import { fonts } from '@/design/typography'
import { useThemeColors } from '@/theme/ThemeProvider'
import { Text } from './Text'

const hueFor = (s: string) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7)

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('') || 'NL'

type Props = {
  name: string
  size?: number
  hue?: number
  online?: boolean
  verified?: boolean
  /** Colour of the ring around the status dot (match the surface behind the avatar). */
  ring?: string
  /** Photo; falls back to initials. */
  uri?: string
}

/** Initials avatar (fallback until photos exist) with optional online dot and verified badge. */
export function Avatar({ name, size = 40, hue, online, verified, ring, uri }: Props) {
  const c = useThemeColors()
  const h = hue ?? hueFor(name)
  const dot = Math.max(10, size * 0.22)
  return (
    <View style={{ width: size, height: size }} accessibilityLabel={name} accessibilityRole="image">
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} accessibilityIgnoresInvertColors />
      ) : (
      <LinearGradient
        colors={[`hsl(${h}, 70%, 48%)`, `hsl(${(h + 30) % 360}, 60%, 24%)`]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: size * 0.36, lineHeight: size * 0.44 }} color="#FFFFFF">
          {initialsOf(name)}
        </Text>
      </LinearGradient>
      )}
      {online && (
        <View
          style={[
            styles.dot,
            { width: dot, height: dot, borderRadius: dot / 2, borderColor: ring ?? c.background, right: size * 0.02, bottom: size * 0.02 },
          ]}
        />
      )}
      {verified && (
        <View style={[styles.badge, { borderColor: ring ?? c.background }]}>
          <Ionicons name="checkmark" size={9} color="#FFFFFF" />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', backgroundColor: '#28C76F', borderWidth: 2 },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: '#0B5FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
