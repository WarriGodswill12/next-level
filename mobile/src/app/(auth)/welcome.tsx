import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BrandBackdrop } from '@/components/BrandBackdrop'
import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import { MaskLines, Reveal } from '@/components/Reveal'
import { Text } from '@/components/Text'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Ticker } from '@/components/Ticker'
import { brand, radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { useThemeColors } from '@/theme/ThemeProvider'

export default function Welcome() {
  const c = useThemeColors()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  // Size the headline so "GET RECRUITED." always fits on one line.
  const size = Math.min(72, Math.floor((width - space[5] * 2) / 6.1))
  const lh = Math.round(size * 0.9)

  const headline = (text: string, color = '#FFFFFF') => (
    <Text style={[styles.headline, { fontSize: size, lineHeight: lh }]} color={color}>
      {text}
    </Text>
  )

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <BrandBackdrop numbers glow={{ x: 0.9, y: 0.25 }} />

      <View style={[styles.top, { paddingTop: insets.top + space[3] }]}>
        <Logo light />
        <ThemeToggle tone="brand" />
      </View>

      <View style={styles.hero}>
        <View style={styles.headlineWrap} accessibilityRole="header" accessibilityLabel="Get seen. Get recruited. Go next level.">
          <MaskLines delay={120} lineHeight={lh} lines={[headline('Get seen.'), headline('Get recruited.'), headline('Go next level.', '#5C9BFF')]} />
        </View>
      </View>

      <View style={styles.tickers}>
        <View style={styles.tickerBack}>
          <Ticker tone="ghost" tilt={3} speed={30} />
        </View>
        <Ticker tone="blue" tilt={-3} speed={42} />
      </View>

      <Reveal delay={380} y={40} style={[styles.sheet, { backgroundColor: c.background, paddingBottom: insets.bottom + space[4] }]}>
        <Button label="Create account" trailingIcon="arrow-forward" onPress={() => router.push('/role')} />
        <Button variant="secondary" label="I already have an account" onPress={() => router.push('/log-in')} />
        <Text variant="caption" color="textTertiary" align="center" style={styles.legal}>
          By continuing you agree to our Terms and Privacy Policy.
        </Text>
      </Reveal>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: brand.navy },
  top: {
    paddingHorizontal: space[5],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: space[5],
    gap: space[4],
  },
  headlineWrap: { marginVertical: space[1] },
  headline: { fontFamily: fonts.display, textTransform: 'uppercase', letterSpacing: -0.5 },
  tickers: { height: 110, justifyContent: 'center', marginBottom: space[2] },
  tickerBack: { position: 'absolute', left: 0, right: 0 },
  sheet: {
    borderTopLeftRadius: radius['3xl'] + 4,
    borderTopRightRadius: radius['3xl'] + 4,
    paddingHorizontal: space[5],
    paddingTop: space[6],
    gap: space[3],
  },
  legal: { marginTop: space[1] },
})
