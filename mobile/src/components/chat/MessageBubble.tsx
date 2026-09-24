import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import { AccessibilityInfo, Animated, Easing, Image, Pressable, StyleSheet, View } from 'react-native'
import Svg, { Text as SvgText } from 'react-native-svg'
import { SPORT_TINT } from '@/components/recruiter/AthleteCard'
import { Text } from '@/components/Text'
import { brand, radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { PROSPECTS } from '@/data/demo'
import { tap } from '@/lib/haptics'
import { sportById } from '@/lib/sports'
import { clock } from '@/lib/time'
import type { ChatMessage } from '@/state/chat'
import { useSession } from '@/state/session'
import { useThemeColors } from '@/theme/ThemeProvider'

type Props = {
  m: ChatMessage
  /** First / last message in a run from the same sender (controls corners and meta). */
  first: boolean
  last: boolean
}

/** A shared profile, rendered as a mini trading card. 'me' is the signed-in athlete. */
function ProfileCard({ profileId, mine }: { profileId: string; mine: boolean }) {
  const s = useSession()
  const p = profileId === 'me' ? null : PROSPECTS.find((x) => x.id === profileId)
  const card = p
    ? { name: p.name, number: p.number, pos: p.position, sport: p.sport, cls: p.classYear, stat: p.keyStat }
    : { name: s.name || 'Athlete', number: s.athlete.jersey ?? '', pos: s.athlete.position ?? '', sport: s.athlete.sport ?? 'football', cls: s.athlete.classYear ?? '', stat: undefined }

  return (
    <Pressable
      onPress={() => {
        tap()
        if (p) router.push({ pathname: '/athlete/[id]', params: { id: p.id } })
        else router.push('/profile')
      }}
      style={[styles.card, mine ? styles.cardMine : styles.cardTheirs]}
      accessibilityRole="button"
      accessibilityLabel={`Profile card: ${card.name}, ${card.pos}. Open profile`}
    >
      <LinearGradient colors={SPORT_TINT[card.sport] ?? SPORT_TINT.football} start={{ x: 0.8, y: 0 }} end={{ x: 0.2, y: 1 }} style={StyleSheet.absoluteFill} />
      {!!card.number && (
        <Svg width={120} height={96} style={styles.cardNum} pointerEvents="none">
          <SvgText x={116} y={84} textAnchor="end" fontFamily={fonts.display} fontSize={96} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth={1}>
            {card.number}
          </SvgText>
        </Svg>
      )}
      <Text variant="eyebrow" color="rgba(255,255,255,0.65)">
        Next Level profile
      </Text>
      <View style={styles.plate}>
        <Text style={styles.plateName} color="#0A0A0A" numberOfLines={1}>
          {card.name}
        </Text>
      </View>
      <Text variant="small" color="rgba(255,255,255,0.8)" numberOfLines={1}>
        {[card.pos, sportById(card.sport)?.label, card.cls && `Class of ${card.cls}`].filter(Boolean).join(' · ')}
      </Text>
      <View style={styles.cardFoot}>
        {card.stat ? (
          <Text style={styles.cardStat} color="#FFFFFF">
            {card.stat.value}{' '}
            <Text variant="eyebrow" color="#8FB5FF">
              {card.stat.key}
            </Text>
          </Text>
        ) : (
          <View />
        )}
        <Text variant="label" color="#FFFFFF">
          View profile <Ionicons name="chevron-forward" size={12} color="#FFFFFF" />
        </Text>
      </View>
    </Pressable>
  )
}

export function MessageBubble({ m, first, last }: Props) {
  const c = useThemeColors()
  const mine = m.from === 'me'
  const corner = 6

  // new messages rise in; seeded history appears instantly
  const v = useRef(new Animated.Value(Date.now() - m.at < 1500 ? 0 : 1)).current
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (reduced) v.setValue(1)
      else Animated.timing(v, { toValue: 1, duration: 280, easing: Easing.bezier(0.2, 0.8, 0.2, 1), useNativeDriver: true }).start()
    })
  }, [v])

  const shape = mine
    ? { borderTopRightRadius: first ? radius['2xl'] : corner, borderBottomRightRadius: corner }
    : { borderTopLeftRadius: first ? radius['2xl'] : corner, borderBottomLeftRadius: corner }

  const status = m.status === 'read' ? 'Read' : m.status === 'delivered' ? 'Delivered' : m.status === 'sent' ? 'Sent' : ''

  return (
    <Animated.View
      style={[
        styles.row,
        mine ? styles.rowMine : styles.rowTheirs,
        { marginTop: first ? space[3] : 2, opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] },
      ]}
    >
      {m.kind === 'profile' && m.profileId ? (
        <ProfileCard profileId={m.profileId} mine={mine} />
      ) : m.kind === 'image' && m.uri ? (
        <Image source={{ uri: m.uri }} style={[styles.image, shape]} resizeMode="cover" accessibilityLabel="Photo" />
      ) : (
        <View
          style={[
            styles.bubble,
            shape,
            mine ? { backgroundColor: brand.blue } : { backgroundColor: c.surfaceElevated, borderColor: c.border, borderWidth: StyleSheet.hairlineWidth },
          ]}
        >
          <Text variant="body" color={mine ? '#FFFFFF' : 'text'} selectable>
            {m.text}
          </Text>
        </View>
      )}
      {last && (
        <Text variant="caption" color="textTertiary" style={[styles.meta, mine && styles.metaMine]}>
          {clock(m.at)}
          {mine && status ? ` · ${status}` : ''}
        </Text>
      )}
    </Animated.View>
  )
}

/** Three pulsing dots in a "their" bubble. */
export function TypingBubble() {
  const c = useThemeColors()
  const dots = [useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current]

  useEffect(() => {
    const loops = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(d, { toValue: 1, duration: 320, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0.3, duration: 320, useNativeDriver: true }),
          Animated.delay((2 - i) * 160),
        ]),
      ),
    )
    loops.forEach((l) => l.start())
    return () => loops.forEach((l) => l.stop())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View style={[styles.row, styles.rowTheirs, { marginTop: space[3] }]} accessibilityLabel="Typing" accessibilityLiveRegion="polite">
      <View style={[styles.bubble, styles.typing, { backgroundColor: c.surfaceElevated, borderColor: c.border, borderWidth: StyleSheet.hairlineWidth, borderBottomLeftRadius: 6 }]}>
        {dots.map((d, i) => (
          <Animated.View key={i} style={[styles.dot, { backgroundColor: c.textSecondary, opacity: d }]} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { maxWidth: '80%' },
  rowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  rowTheirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { paddingHorizontal: space[4], paddingVertical: space[3] - 2, borderRadius: radius['2xl'] },
  image: { width: 220, height: 260, borderRadius: radius['2xl'] },
  meta: { marginTop: 4, marginHorizontal: 4 },
  metaMine: { textAlign: 'right' },
  typing: { flexDirection: 'row', gap: 5, paddingVertical: space[3] + 2 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  card: { width: 240, borderRadius: radius.xl, overflow: 'hidden', padding: space[4], gap: space[2] },
  cardMine: { borderBottomRightRadius: 6 },
  cardTheirs: { borderBottomLeftRadius: 6 },
  cardNum: { position: 'absolute', right: -6, top: 30 },
  plate: { backgroundColor: '#F5F5F5', paddingHorizontal: 8, paddingVertical: 4, transform: [{ skewX: '-8deg' }], alignSelf: 'flex-start', maxWidth: '100%', marginTop: space[3] },
  plateName: { fontFamily: fonts.display, fontSize: 20, lineHeight: 22, textTransform: 'uppercase' },
  cardFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space[2], paddingTop: space[2], borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
  cardStat: { fontFamily: fonts.display, fontSize: 20, lineHeight: 22 },
})
