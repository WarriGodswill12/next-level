import { router } from 'expo-router'
import type { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { radius, space } from '@/design/tokens'
import { textStyles } from '@/design/typography'
import { useThemeColors } from '@/theme/ThemeProvider'
import { BrandBackdrop } from './BrandBackdrop'
import { IconChip } from './IconChip'
import { MaskLines, Reveal } from './Reveal'
import { Text } from './Text'
import { ThemeToggle } from './ThemeToggle'

type Props = {
  eyebrow: string
  /** Headline, one entry per line; the last line is set in brand blue. */
  title: string[]
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  /** Extra element under the title (e.g. a role badge). */
  badge?: ReactNode
  back?: boolean
}

/**
 * Auth screen layout: fixed navy brand header with the broadcast headline,
 * then a themed sheet that rides up over it and holds the form.
 */
export function AuthScaffold({ eyebrow, title, subtitle, children, footer, badge, back = true }: Props) {
  const c = useThemeColors()
  const insets = useSafeAreaInsets()
  const lh = textStyles.displayL.lineHeight

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.grow}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={[styles.header, { paddingTop: insets.top + space[3] }]}>
            <BrandBackdrop />
            <View style={styles.topBar}>
              {back && router.canGoBack() ? (
                <IconChip tone="brand" icon="chevron-back" label="Go back" onPress={() => router.back()} />
              ) : (
                <View />
              )}
              <ThemeToggle tone="brand" />
            </View>

            <View style={styles.titleBlock}>
              <Reveal y={10}>
                <View style={styles.eyebrowRow}>
                  <View style={styles.eyebrowBar} />
                  <Text variant="eyebrow" color="rgba(255,255,255,0.72)">
                    {eyebrow}
                  </Text>
                </View>
              </Reveal>
              <MaskLines
                delay={80}
                lineHeight={lh}
                lines={title.map((line, i) => (
                  <Text
                    key={line}
                    variant="displayL"
                    color={i === title.length - 1 && title.length > 1 ? '#5C9BFF' : '#FFFFFF'}
                    accessibilityRole={i === 0 ? 'header' : undefined}
                  >
                    {line}
                  </Text>
                ))}
              />
              {badge && (
                <Reveal delay={320} style={styles.badge}>
                  {badge}
                </Reveal>
              )}
            </View>
          </View>

          <View style={[styles.sheet, { backgroundColor: c.background, paddingBottom: insets.bottom + space[6] }]}>
            {subtitle && (
              <Reveal delay={200}>
                <Text variant="body" color="textSecondary" style={styles.subtitle}>
                  {subtitle}
                </Text>
              </Reveal>
            )}
            <Reveal delay={260}>{children}</Reveal>
            {footer && <View style={styles.footer}>{footer}</View>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  header: {
    paddingHorizontal: space[5],
    paddingBottom: space[12],
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBlock: {
    marginTop: space[8],
    gap: space[3],
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  eyebrowBar: {
    width: 18,
    height: 2,
    backgroundColor: '#0B5FFF',
  },
  badge: {
    marginTop: space[1],
    flexDirection: 'row',
  },
  sheet: {
    flex: 1,
    marginTop: -space[6],
    borderTopLeftRadius: radius['3xl'] + 4,
    borderTopRightRadius: radius['3xl'] + 4,
    paddingHorizontal: space[5],
    paddingTop: space[6],
  },
  subtitle: {
    marginBottom: space[6],
  },
  footer: {
    marginTop: 'auto',
    paddingTop: space[6],
  },
})
