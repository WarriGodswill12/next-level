import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import type { Href } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Strength } from '@/lib/validation'
import { useThemeColors } from '@/theme/ThemeProvider'
import { Button } from './Button'
import { Text } from './Text'

export function OrDivider() {
  const c = useThemeColors()
  return (
    <View style={styles.divider} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.rule, { backgroundColor: c.border }]} />
      <Text variant="eyebrow" color="textTertiary">
        or
      </Text>
      <View style={[styles.rule, { backgroundColor: c.border }]} />
    </View>
  )
}

function GoogleG() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7Z" />
      <Path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" />
      <Path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <Path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9Z" />
    </Svg>
  )
}

/**
 * Sign in with Apple is listed first: App Store guidelines require it whenever
 * another third-party login is offered.
 */
export function SocialButtons({ onPress }: { onPress: (provider: 'apple' | 'google') => void }) {
  return (
    <View style={styles.social}>
      <Button variant="apple" icon="logo-apple" label="Continue with Apple" onPress={() => onPress('apple')} />
      <Button variant="secondary" leading={<GoogleG />} label="Continue with Google" onPress={() => onPress('google')} />
    </View>
  )
}

export function SwitchPrompt({ prompt, action, href }: { prompt: string; action: string; href: Href }) {
  return (
    <View style={styles.switch}>
      <Text variant="small" color="textSecondary">
        {prompt}{' '}
      </Text>
      <Link href={href} replace accessibilityRole="link">
        <Text variant="small" color="accent" style={styles.switchLink}>
          {action}
        </Text>
      </Link>
    </View>
  )
}

/** Four-segment meter, lit like a scoreboard as the password gets stronger. */
export function StrengthMeter({ strength }: { strength: Strength }) {
  const c = useThemeColors()
  const tone = strength.score <= 1 ? c.danger : strength.score === 2 ? c.warning : c.success
  return (
    <View style={styles.meter} accessibilityLabel={`Password strength: ${strength.label || 'empty'}`}>
      <View style={styles.bars}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.bar, { backgroundColor: i <= strength.score ? tone : c.border }]} />
        ))}
      </View>
      <Text variant="eyebrow" color={strength.score ? tone : 'textTertiary'} style={styles.meterLabel}>
        {strength.label || 'Strength'}
      </Text>
    </View>
  )
}

export function Checkbox({ checked, onToggle, children }: { checked: boolean; onToggle: () => void; children: React.ReactNode }) {
  const c = useThemeColors()
  return (
    <Pressable style={styles.checkRow} onPress={onToggle} accessibilityRole="checkbox" accessibilityState={{ checked }}>
      <View
        style={[
          styles.box,
          { borderColor: checked ? c.accent : c.borderStrong, backgroundColor: checked ? c.accent : 'transparent' },
        ]}
      >
        {checked && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
      </View>
      <View style={styles.flex}>{children}</View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginVertical: space[6],
  },
  rule: { flex: 1, height: 1 },
  social: { gap: space[3] },
  switch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  switchLink: { fontFamily: fonts.bodyBold },
  meter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginTop: -space[1],
  },
  bars: { flex: 1, flexDirection: 'row', gap: 4 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  meterLabel: { minWidth: 70, textAlign: 'right' },
  checkRow: { flexDirection: 'row', gap: space[3], alignItems: 'flex-start' },
  box: {
    width: 22,
    height: 22,
    borderRadius: radius.sm + 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  flex: { flex: 1 },
})
