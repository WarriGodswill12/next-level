import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, View } from 'react-native'
import Svg, { Text as SvgText } from 'react-native-svg'
import { Avatar } from '@/components/Avatar'
import { BrandBackdrop } from '@/components/BrandBackdrop'
import { IconChip } from '@/components/IconChip'
import { Skeleton } from '@/components/Skeleton'
import { Text } from '@/components/Text'
import { brand, radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { tap } from '@/lib/haptics'

type Props = {
  name: string
  number?: string
  position?: string
  location?: string
  sport?: string
  classYear?: string
  strength: number
  onEdit: () => void
  onShare: () => void
  onStrength: () => void
  loading?: boolean
  photo?: string
}

/** Identity card on fixed navy brand chrome — a landscape cousin of the trading card. */
export function AthleteHeroCard({ name, number, position, location, sport, classYear, strength, onEdit, onShare, onStrength, loading, photo }: Props) {
  return (
    <View style={styles.card}>
      <BrandBackdrop glow={{ x: 0.95, y: 0.1 }} />
      {!!number && !loading && (
        <Svg width={190} height={170} style={styles.number} pointerEvents="none">
          <SvgText x={186} y={150} textAnchor="end" fontFamily={fonts.display} fontSize={170} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.22)" strokeWidth={1.2}>
            {number}
          </SvgText>
        </Svg>
      )}

      <View style={styles.top}>
        {loading ? (
          <Skeleton width={60} height={60} radius={30} style={styles.onBrand} />
        ) : (
          <Avatar name={name} size={60} online ring={brand.navy} uri={photo} />
        )}
        <View style={styles.actions}>
          <IconChip tone="brand" icon="create-outline" label="Edit profile" onPress={onEdit} />
          <IconChip tone="brand" icon="share-outline" label="Share profile" onPress={onShare} />
        </View>
      </View>

      {/* name gets the full card width so long names never truncate early */}
      <View style={styles.id}>
        {loading ? (
          <>
            <Skeleton width="70%" height={26} style={styles.onBrand} />
            <Skeleton width="45%" height={12} style={[styles.onBrand, styles.mt]} />
          </>
        ) : (
          <>
            <View style={styles.nameRow}>
              <Text style={styles.name} color="#FFFFFF" numberOfLines={2}>
                {name}
              </Text>
              <Ionicons name="checkmark-circle" size={18} color="#5C9BFF" accessibilityLabel="Verified" />
            </View>
            <Text variant="small" color="rgba(255,255,255,0.7)" numberOfLines={1}>
              {[position, location].filter(Boolean).join(' · ')}
            </Text>
          </>
        )}
      </View>

      <View style={styles.pills}>
        {loading ? (
          <Skeleton width={150} height={24} radius={12} style={styles.onBrand} />
        ) : (
          [sport, classYear && `Class of ${classYear}`].filter(Boolean).map((p) => (
            <View key={p} style={styles.pill}>
              <Text variant="eyebrow" color="#CFE0FF">
                {p}
              </Text>
            </View>
          ))
        )}
      </View>

      <Pressable
        onPress={() => {
          tap()
          onStrength()
        }}
        disabled={loading}
        style={({ pressed }) => [styles.strength, pressed && { opacity: 0.8 }]}
        accessibilityRole="button"
        accessibilityLabel={`Profile strength ${strength} percent. Open the checklist`}
      >
        <View style={styles.strengthRow}>
          <Text variant="eyebrow" color="rgba(255,255,255,0.7)">
            Profile strength
          </Text>
          <View style={styles.strengthRight}>
            <Text style={styles.pct} color="#FFFFFF">
              {loading ? '—' : `${strength}%`}
            </Text>
            <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.6)" />
          </View>
        </View>
        <View style={styles.track}>
          {!loading && (
            <LinearGradient colors={[brand.blue, '#5C9BFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.fill, { width: `${strength}%` }]} />
          )}
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: radius['2xl'], overflow: 'hidden', padding: space[5] },
  number: { position: 'absolute', right: -8, top: 44 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  id: { marginTop: space[4], gap: 2, maxWidth: '82%' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontFamily: fonts.display, fontSize: 34, lineHeight: 34, textTransform: 'uppercase', flexShrink: 1 },
  actions: { flexDirection: 'row', gap: space[2] },
  pills: { flexDirection: 'row', gap: 6, marginTop: space[4] },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.full, backgroundColor: 'rgba(11,95,255,0.28)', borderWidth: 1, borderColor: 'rgba(92,155,255,0.35)' },
  strength: { marginTop: space[4], paddingTop: space[4], borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  strengthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space[2] },
  strengthRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pct: { fontFamily: fonts.display, fontSize: 20, lineHeight: 22 },
  track: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  onBrand: { backgroundColor: 'rgba(255,255,255,0.14)' },
  mt: { marginTop: 8 },
})
