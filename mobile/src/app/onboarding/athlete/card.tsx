import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import { AccessibilityInfo, Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native'
import { StepShell } from '@/components/StepShell'
import { Text } from '@/components/Text'
import { TradingCard } from '@/components/TradingCard'
import { space } from '@/design/tokens'
import { success } from '@/lib/haptics'
import { athleteCardData } from '@/lib/profile'
import { useSession } from '@/state/session'

export default function CardStep() {
  const { width } = useWindowDimensions()
  const { name, athlete, maxStats, completeOnboarding } = useSession()

  // Uploads come after onboarding, so the card starts with film on its to-do list.
  const data = athleteCardData({ name, athlete, maxStats, hasUploads: false })

  // card drops in with a slight spin, like it was just dealt
  const deal = useRef(new Animated.Value(0)).current
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (reduced) {
        deal.setValue(1)
        return
      }
      Animated.timing(deal, { toValue: 1, duration: 900, delay: 250, easing: Easing.bezier(0.2, 0.9, 0.25, 1.1), useNativeDriver: true }).start(() => success())
    })
  }, [deal])

  const cardWidth = Math.min(300, width - space[5] * 2 - space[8])

  return (
    <StepShell
      step={4}
      total={4}
      eyebrow="Profile created"
      title={['Your card', 'is ready.']}
      subtitle="This is how recruiters first see you. Tap the card to flip it and see what to add next."
      cta="Enter Next Level"
      onNext={() => {
        completeOnboarding()
        router.replace('/home')
      }}
    >
      <View style={styles.stage}>
        <Animated.View
          style={{
            opacity: deal,
            transform: [
              { translateY: deal.interpolate({ inputRange: [0, 1], outputRange: [80, 0] }) },
              { rotate: deal.interpolate({ inputRange: [0, 1], outputRange: ['-10deg', '-2deg'] }) },
              { scale: deal.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
            ],
          }}
        >
          <TradingCard data={data} width={cardWidth} />
        </Animated.View>
        <Text variant="eyebrow" color="textTertiary" style={styles.hint}>
          Tap to flip
        </Text>
      </View>
    </StepShell>
  )
}

const styles = StyleSheet.create({
  stage: { alignItems: 'center', paddingTop: space[2] },
  hint: { marginTop: space[4] },
})
