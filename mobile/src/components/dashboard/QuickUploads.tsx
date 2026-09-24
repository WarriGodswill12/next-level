import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { PressableScale } from '@/components/PressableScale'
import { Skeleton } from '@/components/Skeleton'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Upload } from '@/data/demo'
import { tap } from '@/lib/haptics'
import { useThemeColors } from '@/theme/ThemeProvider'

const TONES: Record<Upload['tone'], [string, string, string]> = {
  turf: ['#3FA45B', '#1B6B38', '#0F3D22'],
  night: ['#2A4A8F', '#13224A', '#B86A2A'],
  court: ['#C98A4B', '#8A5328', '#4A2A12'],
}

function UploadTile({ icon, label, onPress }: { icon: ComponentProps<typeof Ionicons>['name']; label: string; onPress: () => void }) {
  const c = useThemeColors()
  return (
    <PressableScale
      onPress={() => {
        tap()
        onPress()
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.tile, styles.add, { borderColor: c.borderStrong, backgroundColor: c.surface }]}
    >
      <View style={[styles.addIcon, { backgroundColor: c.accentSoft }]}>
        <Ionicons name={icon} size={18} color={c.accent} />
      </View>
      <Text variant="label" align="center">
        {label}
      </Text>
    </PressableScale>
  )
}

/** Recent film and photos, with upload entry points first in line. */
export function QuickUploads({ items, loading, onUpload }: { items: Upload[]; loading?: boolean; onUpload: (kind: 'video' | 'photo') => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} style={styles.bleed}>
      <UploadTile icon="videocam" label="Upload video" onPress={() => onUpload('video')} />
      <UploadTile icon="image" label="Add photo" onPress={() => onUpload('photo')} />
      {loading
        ? [0, 1].map((i) => <Skeleton key={i} width={112} height={150} radius={radius.xl} />)
        : items.map((u) => (
            <PressableScale key={u.id} style={styles.tile} accessibilityRole="button" accessibilityLabel={`${u.kind === 'video' ? 'Video' : 'Photo'}: ${u.title}`}>
              <LinearGradient colors={TONES[u.tone]} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
              {u.uri && <Image source={{ uri: u.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityIgnoresInvertColors />}
              {/* field lines so the placeholder reads as game footage */}
              {!u.uri && <View style={styles.lines} pointerEvents="none">
                {[0, 1, 2, 3].map((i) => (
                  <View key={i} style={styles.lineV} />
                ))}
              </View>}
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.shade} />
              {u.kind === 'video' && (
                <View style={styles.play}>
                  <Ionicons name="play" size={16} color="#FFFFFF" />
                </View>
              )}
              <View style={styles.meta}>
                {u.duration && (
                  <Text style={styles.duration} color="#FFFFFF">
                    {u.duration}
                  </Text>
                )}
                <Text variant="caption" color="#FFFFFF" numberOfLines={2} style={styles.title}>
                  {u.title}
                </Text>
              </View>
            </PressableScale>
          ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -space[5] },
  row: { gap: space[3], paddingHorizontal: space[5] },
  tile: { width: 112, height: 150, borderRadius: radius.xl, overflow: 'hidden' },
  add: { borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: space[2], padding: space[2] },
  addIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  lines: { ...StyleSheet.absoluteFill, flexDirection: 'row', justifyContent: 'space-evenly' },
  lineV: { width: 1, backgroundColor: 'rgba(255,255,255,0.14)' },
  shade: { ...StyleSheet.absoluteFill, top: '40%' },
  play: {
    position: 'absolute',
    top: '32%',
    alignSelf: 'center',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  },
  meta: { position: 'absolute', left: space[2], right: space[2], bottom: space[2] },
  duration: { fontFamily: fonts.monoMedium, fontSize: 9.5 },
  title: { fontFamily: fonts.bodySemi },
})
