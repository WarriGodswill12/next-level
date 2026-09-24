import type { ComponentProps } from 'react'
import type { Ionicons } from '@expo/vector-icons'

type IconName = ComponentProps<typeof Ionicons>['name']

export type Sport = { id: string; label: string; /** For tight spaces like card tiles. */ short?: string; icon: IconName; positions: string[] }

export const SPORTS: Sport[] = [
  { id: 'football', label: 'Football', icon: 'american-football', positions: ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K/P'] },
  { id: 'basketball', label: 'Basketball', icon: 'basketball', positions: ['PG', 'SG', 'SF', 'PF', 'C'] },
  { id: 'soccer', label: 'Soccer', icon: 'football', positions: ['GK', 'CB', 'FB', 'CDM', 'CM', 'CAM', 'W', 'ST'] },
  { id: 'baseball', label: 'Baseball', icon: 'baseball', positions: ['P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'DH'] },
  { id: 'softball', label: 'Softball', icon: 'baseball-outline', positions: ['P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'UT'] },
  { id: 'track', label: 'Track & Field', short: 'Track', icon: 'stopwatch', positions: ['Sprints', 'Distance', 'Hurdles', 'Jumps', 'Throws', 'Multi'] },
  { id: 'volleyball', label: 'Volleyball', icon: 'ellipse', positions: ['OH', 'OPP', 'MB', 'S', 'L', 'DS'] },
  { id: 'tennis', label: 'Tennis', icon: 'tennisball', positions: ['Singles', 'Doubles'] },
  { id: 'swimming', label: 'Swimming', icon: 'water', positions: ['Free', 'Back', 'Breast', 'Fly', 'IM', 'Distance'] },
]

export const sportById = (id?: string) => SPORTS.find((s) => s.id === id)

export const CLASS_YEARS = ['2026', '2027', '2028', '2029', '2030']

export const RECRUITER_TITLES = ['Head Coach', 'Assistant Coach', 'Recruiting Coordinator', 'Scout', 'Director', 'Other']
export const LEVELS = ['High School', 'JUCO', 'NAIA', 'NCAA D3', 'NCAA D2', 'NCAA D1', 'Pro / Club']
