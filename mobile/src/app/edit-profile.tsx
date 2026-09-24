import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Chip } from '@/components/Chip'
import { ConfirmSheet } from '@/components/ConfirmSheet'
import { Input } from '@/components/Input'
import { SubHeader } from '@/components/ScreenHeader'
import { Text } from '@/components/Text'
import { radius, space } from '@/design/tokens'
import { fonts } from '@/design/typography'
import { success, tap, warn } from '@/lib/haptics'
import { pickProfilePhoto } from '@/lib/photo'
import { CLASS_YEARS, LEVELS, RECRUITER_TITLES, SPORTS, sportById } from '@/lib/sports'
import { useSession } from '@/state/session'
import { useThemeColors } from '@/theme/ThemeProvider'

const BIO_MAX = 160

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.group}>
      <Text variant="eyebrow" color="textSecondary" style={styles.groupTitle}>
        {title}
      </Text>
      <View style={styles.groupBody}>{children}</View>
    </View>
  )
}

function Choices({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View>
      <Text variant="label" color="textSecondary" style={styles.choiceLabel}>
        {label}
      </Text>
      <View style={styles.chips}>{children}</View>
    </View>
  )
}

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

/** Full edit form: photo, identity and bio for everyone; sport details (athletes) or program details (recruiters). */
export default function EditProfile() {
  const c = useThemeColors()
  const insets = useSafeAreaInsets()
  const s = useSession()
  const recruiter = s.role === 'recruiter'

  const initial = {
    photo: s.photo,
    name: s.name,
    bio: s.bio,
    ...s.athlete,
    organization: s.recruiter.organization ?? '',
    title: s.recruiter.title,
    level: s.recruiter.level,
    sports: s.recruiter.sports ?? [],
    classYears: s.recruiter.classYears ?? [],
  }
  const [f, setF] = useState(initial)
  const [submitted, setSubmitted] = useState(false)
  const [discard, setDiscard] = useState(false)
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }))

  const dirty = JSON.stringify(f) !== JSON.stringify(initial)
  const sport = sportById(f.sport)
  const errors = {
    name: f.name.trim().split(/\s+/).length < 2 ? 'Enter your first and last name' : '',
    state: f.state && f.state.length !== 2 ? 'Use the 2-letter code' : '',
    gpa: f.gpa && !/^\d(\.\d{1,2})?$/.test(f.gpa) ? 'Use a number like 3.7' : '',
    organization: recruiter && f.organization.trim().length < 2 ? 'Enter your school or organization' : '',
  }
  const show = (k: keyof typeof errors) => (submitted && errors[k]) || undefined

  const back = () => (dirty ? setDiscard(true) : router.back())

  const save = () => {
    setSubmitted(true)
    if (Object.values(errors).some(Boolean)) {
      warn()
      return
    }
    s.setName(f.name)
    s.setBio(f.bio ?? '')
    s.setPhoto(f.photo)
    if (recruiter) {
      s.updateRecruiter({ organization: f.organization.trim(), title: f.title, level: f.level, sports: f.sports, classYears: f.classYears })
    } else {
      s.updateAthlete({
        sport: f.sport,
        position: f.position,
        classYear: f.classYear,
        jersey: f.jersey,
        school: f.school?.trim(),
        city: f.city?.trim(),
        state: f.state?.toUpperCase(),
        height: f.height?.trim(),
        weight: f.weight,
        gpa: f.gpa,
      })
    }
    success()
    router.back()
  }

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <SubHeader title="Edit profile" onBack={back} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* photo */}
          <View style={styles.photoBlock}>
            <Pressable
              onPress={async () => {
                tap()
                const uri = await pickProfilePhoto()
                if (uri) set('photo', uri)
              }}
              accessibilityRole="button"
              accessibilityLabel={f.photo ? 'Change profile photo' : 'Add profile photo'}
            >
              <Avatar name={f.name || 'You'} size={96} uri={f.photo} />
              <View style={[styles.camera, { backgroundColor: c.accent, borderColor: c.background }]}>
                <Ionicons name="camera" size={15} color="#FFFFFF" />
              </View>
            </Pressable>
            <View style={styles.photoActions}>
              <Text variant="bodyStrong">Profile photo</Text>
              <Text variant="small" color="textSecondary">
                A clear, recent headshot works best.
              </Text>
              {f.photo && (
                <Pressable onPress={() => set('photo', undefined)} hitSlop={8} accessibilityRole="button">
                  <Text variant="small" color="danger" style={styles.remove}>
                    Remove photo
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          <Group title="Basics">
            <Input label="Full name" icon="person-outline" value={f.name} onChangeText={(v) => set('name', v)} error={show('name')} autoCapitalize="words" autoComplete="name" />
            <View>
              <Input
                label="Bio"
                placeholder={recruiter ? 'What your program looks for in a recruit' : 'Your game, your goals, what drives you'}
                value={f.bio}
                onChangeText={(v) => set('bio', v.slice(0, BIO_MAX))}
                multiline
                style={styles.bio}
              />
              <Text variant="caption" color={(f.bio?.length ?? 0) > BIO_MAX - 20 ? 'warning' : 'textTertiary'} align="right" style={styles.counter}>
                {f.bio?.length ?? 0}/{BIO_MAX}
              </Text>
            </View>
          </Group>

          {recruiter ? (
            <>
              <Group title="Your program">
                <Input label="School, club or organization" icon="business-outline" value={f.organization} onChangeText={(v) => set('organization', v)} error={show('organization')} autoCapitalize="words" />
                <Choices label="Your role">
                  {RECRUITER_TITLES.map((t) => (
                    <Chip key={t} label={t} selected={f.title === t} onPress={() => set('title', t)} />
                  ))}
                </Choices>
                <Choices label="Level">
                  {LEVELS.map((l) => (
                    <Chip key={l} label={l} selected={f.level === l} onPress={() => set('level', l)} />
                  ))}
                </Choices>
              </Group>
              <Group title="Recruiting focus">
                <Choices label="Sports">
                  {SPORTS.map((sp) => (
                    <Chip key={sp.id} multi label={sp.label} selected={f.sports.includes(sp.id)} onPress={() => set('sports', toggle(f.sports, sp.id))} />
                  ))}
                </Choices>
                <Choices label="Class years">
                  {CLASS_YEARS.map((y) => (
                    <Chip key={y} multi label={y} selected={f.classYears.includes(y)} onPress={() => set('classYears', toggle(f.classYears, y))} />
                  ))}
                </Choices>
              </Group>
            </>
          ) : (
            <>
              <Group title="Your game">
                <Choices label="Sport">
                  {SPORTS.map((sp) => (
                    <Chip
                      key={sp.id}
                      label={sp.label}
                      selected={f.sport === sp.id}
                      onPress={() => setF((p) => ({ ...p, sport: sp.id, position: sp.id === p.sport ? p.position : undefined }))}
                    />
                  ))}
                </Choices>
                {sport && (
                  <Choices label="Position">
                    {sport.positions.map((pos) => (
                      <Chip key={pos} label={pos} selected={f.position === pos} onPress={() => set('position', pos)} />
                    ))}
                  </Choices>
                )}
                <Choices label="Graduating class">
                  {CLASS_YEARS.map((y) => (
                    <Chip key={y} label={y} selected={f.classYear === y} onPress={() => set('classYear', y)} />
                  ))}
                </Choices>
                <View style={styles.jersey}>
                  <Input label="Jersey number" icon="shirt-outline" placeholder="00" value={f.jersey ?? ''} onChangeText={(v) => set('jersey', v.replace(/\D/g, '').slice(0, 2))} keyboardType="number-pad" />
                </View>
              </Group>

              <Group title="School & location">
                <Input label="High school / club" icon="school-outline" value={f.school ?? ''} onChangeText={(v) => set('school', v)} autoCapitalize="words" />
                <View style={styles.row}>
                  <View style={styles.flex}>
                    <Input label="City" icon="location-outline" value={f.city ?? ''} onChangeText={(v) => set('city', v)} autoCapitalize="words" />
                  </View>
                  <View style={styles.state}>
                    <Input label="State" value={f.state ?? ''} onChangeText={(v) => set('state', v.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase())} error={show('state')} autoCapitalize="characters" />
                  </View>
                </View>
              </Group>

              <Group title="Measurables & academics">
                <View style={styles.row}>
                  <View style={styles.flex}>
                    <Input label="Height" icon="resize-outline" placeholder={`6'1"`} value={f.height ?? ''} onChangeText={(v) => set('height', v)} />
                  </View>
                  <View style={styles.flex}>
                    <Input label="Weight (lb)" icon="barbell-outline" placeholder="185" value={f.weight ?? ''} onChangeText={(v) => set('weight', v.replace(/\D/g, '').slice(0, 3))} keyboardType="number-pad" />
                  </View>
                </View>
                <Input label="GPA · optional" icon="school-outline" placeholder="3.7" value={f.gpa ?? ''} onChangeText={(v) => set('gpa', v.replace(/[^\d.]/g, '').slice(0, 4))} error={show('gpa')} keyboardType="decimal-pad" />
              </Group>
            </>
          )}
        </ScrollView>

        <View style={[styles.bar, { backgroundColor: c.background, borderTopColor: c.border, paddingBottom: insets.bottom + space[3] }]}>
          <Button label={dirty ? 'Save changes' : 'No changes'} icon="checkmark" disabled={!dirty} onPress={save} />
        </View>
      </KeyboardAvoidingView>

      <ConfirmSheet
        visible={discard}
        icon="create-outline"
        title="Discard changes?"
        message="Your edits haven't been saved and will be lost."
        confirmLabel="Discard"
        onCancel={() => setDiscard(false)}
        onConfirm={() => {
          setDiscard(false)
          router.back()
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { paddingHorizontal: space[5], paddingBottom: space[10] },
  photoBlock: { flexDirection: 'row', alignItems: 'center', gap: space[5], paddingVertical: space[4] },
  camera: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  photoActions: { flex: 1, gap: 2 },
  remove: { fontFamily: fonts.bodySemi, marginTop: space[2] },
  group: { marginTop: space[6] },
  groupTitle: { marginBottom: space[3] },
  groupBody: { gap: space[4] },
  choiceLabel: { marginBottom: space[2] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  bio: { minHeight: 96, textAlignVertical: 'top' },
  counter: { marginTop: 4 },
  jersey: { width: 160 },
  row: { flexDirection: 'row', gap: space[3] },
  state: { width: 96 },
  bar: { paddingHorizontal: space[5], paddingTop: space[3], borderTopWidth: StyleSheet.hairlineWidth, borderRadius: radius.none },
})
