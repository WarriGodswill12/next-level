import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Animated, Easing, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { space } from '@/design/tokens'
import { textStyles } from '@/design/typography'
import { useThemeColors } from '@/theme/ThemeProvider'
import { Button } from './Button'
import { IconChip } from './IconChip'
import { MaskLines, Reveal } from './Reveal'
import { Text } from './Text'
import { ThemeToggle } from './ThemeToggle'

type Props = {
  step: number
  total: number
  eyebrow: string
  title: string[]
  subtitle?: string
  children: ReactNode
  cta: string
  onNext: () => void
  canContinue?: boolean
  loading?: boolean
  onSkip?: () => void
}

/** Segmented progress styled like a game clock: one lit segment per quarter. */
function QuarterBar({ step, total }: { step: number; total: number }) {
  const c = useThemeColors()
  const fill = useRef(new Animated.Value(0)).current
  useEffect(() => {
    fill.setValue(0)
    Animated.timing(fill, { toValue: 1, duration: 650, easing: Easing.bezier(0.2, 0.8, 0.2, 1), useNativeDriver: false }).start()
  }, [fill, step])

  return (
    <View
      style={styles.bar}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: total, now: step }}
      accessibilityLabel={`Step ${step} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.seg, { backgroundColor: c.border }]}>
          {i < step - 1 && <View style={[StyleSheet.absoluteFill, { backgroundColor: c.accent }]} />}
          {i === step - 1 && (
            <Animated.View
              style={[
                styles.segFill,
                { backgroundColor: c.accent, width: fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  )
}

/** Onboarding step layout: quarter progress, broadcast title, content, pinned CTA. */
export function StepShell({ step, total, eyebrow, title, subtitle, children, cta, onNext, canContinue = true, loading, onSkip }: Props) {
  const c = useThemeColors()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.root, { backgroundColor: c.background, paddingTop: insets.top + space[2] }]}>
      <View style={styles.top}>
        {router.canGoBack() ? <IconChip icon="chevron-back" label="Go back" onPress={() => router.back()} /> : <View style={styles.chipSpace} />}
        <Text variant="eyebrow" color="textSecondary">
          <Text variant="eyebrow" color="accent">
            Q{step}
          </Text>
          {`  of ${total}`}
        </Text>
        <ThemeToggle />
      </View>
      <View style={styles.barWrap}>
        <QuarterBar step={step} total={total} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Reveal y={8}>
            <View style={styles.eyebrowRow}>
              <View style={[styles.eyebrowBar, { backgroundColor: c.accent }]} />
              <Text variant="eyebrow" color="textSecondary">
                {eyebrow}
              </Text>
            </View>
          </Reveal>
          <View style={styles.title}>
            <MaskLines
              delay={60}
              lineHeight={textStyles.displayM.lineHeight + 6}
              lines={title.map((line, i) => (
                <Text key={line} variant="displayM" style={styles.titleText} color={i === title.length - 1 && title.length > 1 ? 'accent' : 'text'} accessibilityRole={i === 0 ? 'header' : undefined}>
                  {line}
                </Text>
              ))}
            />
          </View>
          {subtitle && (
            <Reveal delay={160}>
              <Text variant="body" color="textSecondary" style={styles.subtitle}>
                {subtitle}
              </Text>
            </Reveal>
          )}
          <Reveal delay={220}>{children}</Reveal>
        </ScrollView>

        <View style={[styles.cta, { paddingBottom: insets.bottom + space[4], borderTopColor: c.border, backgroundColor: c.background }]}>
          <Button label={cta} trailingIcon="arrow-forward" onPress={onNext} disabled={!canContinue} loading={loading} />
          {onSkip && <Button variant="ghost" size="md" label="Skip for now" onPress={onSkip} />}
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
  },
  chipSpace: { width: 40 },
  barWrap: {
    paddingHorizontal: space[5],
    paddingTop: space[4],
  },
  bar: {
    flexDirection: 'row',
    gap: 6,
  },
  seg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  segFill: {
    height: '100%',
    borderRadius: 2,
  },
  scroll: {
    paddingHorizontal: space[5],
    paddingTop: space[8],
    paddingBottom: space[8],
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  eyebrowBar: { width: 18, height: 2 },
  title: { marginTop: space[3] },
  titleText: { fontSize: 40, lineHeight: 38 },
  subtitle: { marginTop: space[3], marginBottom: space[6] },
  cta: {
    paddingHorizontal: space[5],
    paddingTop: space[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: space[1],
  },
})
