import type { CardData } from '@/components/TradingCard'
import { sportById } from '@/lib/sports'
import type { AthleteProfile } from '@/state/session'

export type ChecklistItem = { id: string; label: string; done: boolean }

/** What makes a complete athlete profile; drives the profile-strength bar and its sheet. */
export function athleteChecklist(p: { name: string; athlete: AthleteProfile; maxStats: boolean; hasUploads: boolean; photo?: string; bio?: string }): ChecklistItem[] {
  const a = p.athlete
  return [
    { id: 'basics', label: 'Name, sport and position', done: !!(p.name && a.sport && a.position) },
    { id: 'class', label: 'Graduating class', done: !!a.classYear },
    { id: 'school', label: 'School and location', done: !!(a.school && a.city) },
    { id: 'measurables', label: 'Height and weight', done: !!(a.height && a.weight) },
    { id: 'jersey', label: 'Jersey number', done: !!a.jersey },
    { id: 'maxstats', label: 'MaxStats season', done: p.maxStats },
    { id: 'film', label: 'First highlight uploaded', done: p.hasUploads },
    { id: 'photo', label: 'Profile photo', done: !!p.photo },
    { id: 'bio', label: 'Short bio', done: !!p.bio },
  ]
}

export const strengthOf = (items: ChecklistItem[]) => Math.round((items.filter((i) => i.done).length / items.length) * 100)

/** The trading card for the signed-in athlete, derived from their profile and checklist. */
export function athleteCardData(p: { name: string; athlete: AthleteProfile; maxStats: boolean; hasUploads: boolean; photo?: string; bio?: string }): CardData {
  const a = p.athlete
  const items = athleteChecklist(p)
  return {
    name: p.name || 'Your Name',
    number: a.jersey || '',
    position: a.position ?? '',
    sport: sportById(a.sport)?.label ?? '',
    classYear: a.classYear ?? '',
    location: [a.city, a.state].filter(Boolean).join(', '),
    school: a.school,
    height: a.height,
    weight: a.weight ? `${a.weight} LB` : undefined,
    strength: strengthOf(items),
    nextSteps: items.filter((i) => !i.done).slice(0, 3).map((i) => `Add: ${i.label.toLowerCase()}`),
  }
}
