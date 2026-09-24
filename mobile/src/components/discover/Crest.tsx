import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'
import { Text } from '@/components/Text'
import { fonts } from '@/design/typography'

/** Team crest: the program's initials on its colours, with a diagonal stripe. */
export function Crest({ short, colors, size = 52 }: { short: string; colors: [string, string]; size?: number }) {
  return (
    <View style={[styles.crest, { width: size, height: size, borderRadius: size * 0.26 }]} accessibilityElementsHidden importantForAccessibility="no">
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={[styles.stripe, { width: size * 0.22, height: size * 2, left: size * 0.58 }]} />
      <Text style={{ fontFamily: fonts.display, fontSize: size * (short.length > 2 ? 0.34 : 0.44), lineHeight: size * 0.5 }} color="#FFFFFF">
        {short}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  crest: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  stripe: { position: 'absolute', top: '-50%', backgroundColor: 'rgba(255,255,255,0.12)', transform: [{ rotate: '25deg' }] },
})
