import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, View } from 'react-native'
import Svg, { Text as SvgText } from 'react-native-svg'
import { Avatar } from '@/components/Avatar'
import { PressableScale } from '@/components/PressableScale'
import { Skeleton } from '@/components/Skeleton'
import { Text } from '@/components/Text'
import { brand, radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Prospect } from '@/data/demo'
import { select, tap } from '@/lib/haptics'
import { sportById } from '@/lib/sports'
import { useThemeColors } from '@/theme/ThemeProvider'

/** Sport-tinted card gradients (fixed brand chrome, like the trading card). */
export const SPORT_TINT: Record<string, [string, string]> = {
  football: [brand.navy2, '#050A18'],
  basketball: ['#5A2A12', '#140803'],
  soccer: ['#0F4D2A', '#03120A'],
  track: ['#3D1F5C', '#0E0618'],
  volleyball: ['#5C1F3D', '#16060E'],
  softball: ['#5C4A12', '#161003'],
}

function SaveButton({ saved, onToggle, name }: { saved: boolean; onToggle: () => void; name: string }) {
  return (
    <Pressable
      onPress={() => {
        select()
        onToggle()
      }}
      hitSlop={8}
      style={[styles.save, saved && styles.saved]}
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      accessibilityLabel={saved ? `Remove ${name} from your board` : `Save ${name} to your board`}
    >
      <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={14} color="#FFFFFF" />
    </Pressable>
  )
}

type Props = { p: Prospect; saved: boolean; onToggleSave: () => void; onPress: () => void }

/** Grid tile: a mini trading card. */
export function AthleteTile({ p, saved, onToggleSave, onPress }: Props) {
  const tint = SPORT_TINT[p.sport] ?? SPORT_TINT.football
  // The save button is a sibling overlaid on the card, never nested in its pressable.
  return (
    <View style={styles.tileWrap}>
    <PressableScale
      onPress={() => {
        tap()
        onPress()
      }}
      accessibilityRole="button"
      accessibilityLabel={`${p.name}, ${p.position}, class of ${p.classYear}, ${p.keyStat.value} ${p.keyStat.key}`}
      style={styles.tile}
    >
      <LinearGradient colors={tint} start={{ x: 0.8, y: 0 }} end={{ x: 0.2, y: 1 }} style={StyleSheet.absoluteFill} />
      <Svg width={130} height={110} style={styles.num} pointerEvents="none">
        <SvgText x={126} y={96} textAnchor="end" fontFamily={fonts.display} fontSize={110} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth={1}>
          {p.number}
        </SvgText>
      </Svg>
      <View style={styles.tileTop}>
        <View style={styles.pos}>
          <Text style={styles.posText} color={brand.navy}>
            {p.position}
          </Text>
        </View>
      </View>
      <View style={styles.tileBottom}>
        <View style={styles.plate}>
          <Text style={styles.plateName} color="#0A0A0A" numberOfLines={1}>
            {p.name}
          </Text>
        </View>
        <Text variant="eyebrow" color="rgba(255,255,255,0.65)" style={styles.meta} numberOfLines={1}>
          {sportById(p.sport)?.short ?? sportById(p.sport)?.label} · ’{p.classYear.slice(2)}
        </Text>
        <View style={styles.statRow}>
          <Text style={styles.stat} color="#FFFFFF">
            {p.keyStat.value}
          </Text>
          <Text variant="eyebrow" color="#8FB5FF">
            {p.keyStat.key}
          </Text>
        </View>
      </View>
    </PressableScale>
    <View style={styles.saveSlot}>
      <SaveButton saved={saved} onToggle={onToggleSave} name={p.name} />
    </View>
    </View>
  )
}

/** List row variant for the grid/list toggle. */
export function AthleteRow({ p, saved, onToggleSave, onPress, first }: Props & { first?: boolean }) {
  const c = useThemeColors()
  return (
    <View style={[styles.row, !first && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }]}>
    <Pressable
      onPress={() => {
        tap()
        onPress()
      }}
      style={({ pressed }) => [styles.rowMain, pressed && { opacity: 0.7 }]}
      accessibilityRole="button"
      accessibilityLabel={`${p.name}, ${p.position}, class of ${p.classYear}, ${p.keyStat.value} ${p.keyStat.key}`}
    >
      <Avatar name={p.name} size={46} verified />
      <View style={styles.rowBody}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {p.name}
        </Text>
        <Text variant="small" color="textSecondary" numberOfLines={1}>
          {p.position} · {sportById(p.sport)?.label} · {p.classYear}
        </Text>
      </View>
      <View style={styles.rowStat}>
        <Text style={styles.rowStatValue} color="accent">
          {p.keyStat.value}
        </Text>
        <Text variant="eyebrow" color="textTertiary">
          {p.keyStat.key}
        </Text>
      </View>
    </Pressable>
      <Pressable
        onPress={() => {
          select()
          onToggleSave()
        }}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityState={{ selected: saved }}
        accessibilityLabel={saved ? `Remove ${p.name} from your board` : `Save ${p.name} to your board`}
        style={[styles.rowSave, { backgroundColor: saved ? c.accent : c.surfaceElevated, borderColor: saved ? c.accent : c.border }]}
      >
        <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={15} color={saved ? '#FFFFFF' : c.text} />
      </Pressable>
    </View>
  )
}

export function AthleteTileSkeleton() {
  return <Skeleton width="100%" height={210} radius={radius.xl} />
}

const styles = StyleSheet.create({
  tileWrap: { flex: 1, height: 210 },
  tile: { flex: 1, borderRadius: radius.xl, overflow: 'hidden', padding: space[3], justifyContent: 'space-between' },
  saveSlot: { position: 'absolute', top: space[3], right: space[3] },
  num: { position: 'absolute', right: -6, top: 22 },
  tileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pos: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.sm, backgroundColor: '#FFFFFF' },
  posText: { fontFamily: fonts.display, fontSize: 14, lineHeight: 16 },
  save: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  saved: { backgroundColor: brand.blue, borderColor: brand.blue },
  tileBottom: { gap: 4 },
  plate: { backgroundColor: '#F5F5F5', paddingHorizontal: 8, paddingVertical: 4, transform: [{ skewX: '-8deg' }], alignSelf: 'flex-start', maxWidth: '100%' },
  plateName: { fontFamily: fonts.display, fontSize: 17, lineHeight: 19, textTransform: 'uppercase' },
  meta: { fontSize: 9 },
  statRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  stat: { fontFamily: fonts.display, fontSize: 26, lineHeight: 28 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3] },
  rowBody: { flex: 1, minWidth: 0 },
  rowStat: { alignItems: 'flex-end' },
  rowStatValue: { fontFamily: fonts.display, fontSize: 22, lineHeight: 24 },
  rowSave: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
})
