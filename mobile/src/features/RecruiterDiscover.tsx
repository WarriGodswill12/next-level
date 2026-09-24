import { Feather, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Button } from '@/components/Button'
import { Chip } from '@/components/Chip'
import { IconChip } from '@/components/IconChip'
import { AthleteRow, AthleteTile } from '@/components/recruiter/AthleteCard'
import { TabRootHeader } from '@/components/ScreenHeader'
import { SearchBar } from '@/components/SearchBar'
import { SectionHeader } from '@/components/SectionHeader'
import { Sheet } from '@/components/Sheet'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import type { Prospect } from '@/data/demo'
import { PROSPECTS } from '@/data/demo'
import { select, tap } from '@/lib/haptics'
import { CLASS_YEARS, SPORTS } from '@/lib/sports'
import { useSession } from '@/state/session'
import { useThemeColors } from '@/theme/ThemeProvider'

type Filters = { years: string[]; positions: string[]; states: string[]; savedOnly: boolean }
type Sort = 'recommended' | 'class' | 'name'
const EMPTY: Filters = { years: [], positions: [], states: [], savedOnly: false }
const SORTS: { value: Sort; label: string; body: string }[] = [
  { value: 'recommended', label: 'Recommended', body: 'Best fit for your board first' },
  { value: 'class', label: 'Class year', body: 'Soonest graduating first' },
  { value: 'name', label: 'Name', body: 'A to Z' },
]

const stateOf = (p: Prospect) => p.location.split(', ')[1] ?? ''
const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

function Group({ title, items, sel, onToggle }: { title: string; items: string[]; sel: string[]; onToggle: (v: string) => void }) {
  return (
    <View style={styles.group}>
      <Text variant="eyebrow" color="textSecondary" style={styles.groupLabel}>
        {title}
      </Text>
      <View style={styles.wrap}>
        {items.map((i) => (
          <Chip key={i} multi label={i} selected={sel.includes(i)} onPress={() => onToggle(i)} />
        ))}
      </View>
    </View>
  )
}

function FilterSheet({ visible, onClose, value, onApply, positions }: { visible: boolean; onClose: () => void; value: Filters; onApply: (f: Filters) => void; positions: string[] }) {
  const [draft, setDraft] = useState(value)
  const states = [...new Set(PROSPECTS.map(stateOf))].sort()

  // start from the applied filters each time the sheet opens
  const [lastOpen, setLastOpen] = useState(false)
  if (visible !== lastOpen) {
    setLastOpen(visible)
    if (visible) setDraft(value)
  }

  const count = draft.years.length + draft.positions.length + draft.states.length + (draft.savedOnly ? 1 : 0)

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      eyebrow={count ? `${count} selected` : 'Refine results'}
      title="Filters"
      footer={
        <View style={styles.footer}>
          <Button style={styles.flex} variant="secondary" label="Reset" onPress={() => setDraft(EMPTY)} />
          <Button
            style={styles.flex}
            label="Show results"
            onPress={() => {
              onApply(draft)
              onClose()
            }}
          />
        </View>
      }
    >
      <Group title="Class year" items={CLASS_YEARS} sel={draft.years} onToggle={(v) => setDraft((d) => ({ ...d, years: toggle(d.years, v) }))} />
      {positions.length > 0 && <Group title="Position" items={positions} sel={draft.positions} onToggle={(v) => setDraft((d) => ({ ...d, positions: toggle(d.positions, v) }))} />}
      <Group title="State" items={states} sel={draft.states} onToggle={(v) => setDraft((d) => ({ ...d, states: toggle(d.states, v) }))} />
      <View style={styles.group}>
        <Text variant="eyebrow" color="textSecondary" style={styles.groupLabel}>
          Your board
        </Text>
        <View style={styles.wrap}>
          <Chip multi label="Saved athletes only" selected={draft.savedOnly} onPress={() => setDraft((d) => ({ ...d, savedOnly: !d.savedOnly }))} />
        </View>
      </View>
    </Sheet>
  )
}

function SortSheet({ visible, onClose, value, onChange }: { visible: boolean; onClose: () => void; value: Sort; onChange: (s: Sort) => void }) {
  const c = useThemeColors()
  return (
    <Sheet visible={visible} onClose={onClose} eyebrow="Order results" title="Sort by">
      {SORTS.map((o, i) => {
        const on = o.value === value
        return (
          <Pressable
            key={o.value}
            onPress={() => {
              select()
              onChange(o.value)
              onClose()
            }}
            style={[styles.sortRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }]}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
          >
            <View style={styles.flex}>
              <Text variant="bodyStrong" color={on ? 'accent' : 'text'}>
                {o.label}
              </Text>
              <Text variant="small" color="textSecondary">
                {o.body}
              </Text>
            </View>
            {on && <Ionicons name="checkmark-circle" size={22} color={c.accent} />}
          </Pressable>
        )
      })}
    </Sheet>
  )
}

export function RecruiterDiscover() {
  const c = useThemeColors()
  const s = useSession()
  const [q, setQ] = useState('')
  const [sport, setSport] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>(EMPTY)
  const [sort, setSort] = useState<Sort>('recommended')
  const [mode, setMode] = useState<'list' | 'grid'>('list')
  const [sheet, setSheet] = useState<null | 'filters' | 'sort'>(null)

  const needle = q.trim().toLowerCase()
  const active = filters.years.length + filters.positions.length + filters.states.length + (filters.savedOnly ? 1 : 0)
  const browsing = !needle && !active

  // recommended = matches the sports and class years chosen in onboarding
  const fit = (p: Prospect) => (s.recruiter.sports?.includes(p.sport) ? 2 : 0) + (s.recruiter.classYears?.includes(p.classYear) ? 1 : 0)
  const inSport = PROSPECTS.filter((p) => !sport || p.sport === sport)
  const positions = [...new Set(inSport.map((p) => p.position))]
  const results = inSport
    .filter(
      (p) =>
        (!needle || `${p.name} ${p.position} ${p.school} ${p.location}`.toLowerCase().includes(needle)) &&
        (!filters.years.length || filters.years.includes(p.classYear)) &&
        (!filters.positions.length || filters.positions.includes(p.position)) &&
        (!filters.states.length || filters.states.includes(stateOf(p))) &&
        (!filters.savedOnly || s.saved.includes(p.id)),
    )
    .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : sort === 'class' ? a.classYear.localeCompare(b.classYear) : fit(b) - fit(a)))
  const fresh = inSport.filter((p) => !s.saved.includes(p.id)).slice(0, 5)

  const open = (p: Prospect) => router.push({ pathname: '/athlete/[id]', params: { id: p.id } })

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <TabRootHeader
        title="Discover"
        right={
          <View>
            <IconChip icon="options-outline" label={active ? `Filters, ${active} active` : 'Filters'} onPress={() => setSheet('filters')} />
            {active > 0 && (
              <View style={[styles.badge, { backgroundColor: c.accent, borderColor: c.background }]} pointerEvents="none">
                <Text style={styles.badgeText} color="#FFFFFF">
                  {active}
                </Text>
              </View>
            )}
          </View>
        }
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <SearchBar value={q} onChangeText={setQ} placeholder="Name, position, school, city" label="Search athletes" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.chips}>
          <Chip label="All sports" selected={!sport} onPress={() => setSport(null)} />
          {SPORTS.map((sp) => (
            <Chip key={sp.id} label={sp.label} selected={sport === sp.id} onPress={() => setSport(sp.id)} />
          ))}
        </ScrollView>

        {browsing && fresh.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Fresh on Next Level" meta={`${fresh.length} athletes`} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.carousel}>
              {fresh.map((p) => (
                <View key={p.id} style={styles.carouselItem}>
                  <AthleteTile p={p} saved={s.saved.includes(p.id)} onToggleSave={() => s.toggleSaved(p.id)} onPress={() => open(p)} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader
            title={browsing ? 'All athletes' : 'Results'}
            meta={`${results.length}`}
            right={
              <View style={styles.tools}>
                <Pressable
                  onPress={() => {
                    tap()
                    setSheet('sort')
                  }}
                  style={[styles.sortBtn, { borderColor: c.border, backgroundColor: c.surface }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Sort: ${SORTS.find((o) => o.value === sort)?.label}`}
                >
                  <Ionicons name="swap-vertical" size={14} color={c.textSecondary} />
                  <Text style={styles.sortText}>{SORTS.find((o) => o.value === sort)?.label}</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    select()
                    setMode((m) => (m === 'list' ? 'grid' : 'list'))
                  }}
                  style={[styles.modeBtn, { borderColor: c.border, backgroundColor: c.surface }]}
                  accessibilityRole="button"
                  accessibilityLabel={mode === 'list' ? 'Show as grid' : 'Show as list'}
                >
                  <Feather name={mode === 'list' ? 'grid' : 'list'} size={15} color={c.accent} />
                </Pressable>
              </View>
            }
          />
          {active > 0 && (
            <Pressable onPress={() => setFilters(EMPTY)} style={styles.clear} accessibilityRole="button">
              <Ionicons name="close-circle" size={15} color={c.accent} />
              <Text variant="small" color="accent" style={styles.clearText}>
                Clear {active} filter{active > 1 ? 's' : ''}
              </Text>
            </Pressable>
          )}

          {results.length === 0 ? (
            <View style={[styles.empty, { borderColor: c.borderStrong }]}>
              <Ionicons name="search-outline" size={22} color={c.textTertiary} />
              <Text variant="body" color="textSecondary" align="center">
                No athletes match. Try another sport, search or fewer filters.
              </Text>
            </View>
          ) : mode === 'list' ? (
            results.map((p, i) => <AthleteRow key={p.id} first={i === 0} p={p} saved={s.saved.includes(p.id)} onToggleSave={() => s.toggleSaved(p.id)} onPress={() => open(p)} />)
          ) : (
            <View style={styles.grid}>
              {Array.from({ length: Math.ceil(results.length / 2) }).map((_, row) => (
                <View key={row} style={styles.pair}>
                  {results.slice(row * 2, row * 2 + 2).map((p) => (
                    <AthleteTile key={p.id} p={p} saved={s.saved.includes(p.id)} onToggleSave={() => s.toggleSaved(p.id)} onPress={() => open(p)} />
                  ))}
                  {results.length % 2 === 1 && row === Math.floor(results.length / 2) && <View style={styles.flex} />}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <FilterSheet visible={sheet === 'filters'} onClose={() => setSheet(null)} value={filters} onApply={setFilters} positions={positions} />
      <SortSheet visible={sheet === 'sort'} onClose={() => setSheet(null)} value={sort} onChange={setSort} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { paddingHorizontal: space[5], paddingBottom: space[10] },
  bleed: { marginHorizontal: -space[5], marginTop: space[3] },
  chips: { gap: space[2], paddingHorizontal: space[5] },
  section: { marginTop: space[6] },
  carousel: { gap: space[3], paddingHorizontal: space[5] },
  carouselItem: { width: 168, height: 210 },
  tools: { flexDirection: 'row', gap: space[2] },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: space[3], height: 34, borderRadius: radius.full, borderWidth: 1 },
  sortText: { fontFamily: fonts.bodySemi, fontSize: 13 },
  modeBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  clear: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: space[2] },
  clearText: { fontFamily: fonts.bodySemi },
  grid: { gap: space[3] },
  pair: { flexDirection: 'row', gap: space[3] },
  empty: { alignItems: 'center', gap: space[2], padding: space[6], borderWidth: 1.5, borderStyle: 'dashed', borderRadius: radius['2xl'] },
  badge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 10, lineHeight: 12 },
  group: { marginBottom: space[5] },
  groupLabel: { marginBottom: space[2] },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  footer: { flexDirection: 'row', gap: space[3] },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[4] },
})
