/**
 * Illustrative sample data for the dashboards while there is no backend.
 * Every name, school and number here is made up.
 * TODO(backend): replace with API data; keep the shapes.
 */
import type { ComponentProps } from 'react'
import type { Ionicons } from '@expo/vector-icons'

type IconName = ComponentProps<typeof Ionicons>['name']

export type Stat = { key: string; value: string }

/** A representative season line for each sport's MaxStats widget. */
export const SEASON_LINES: Record<string, Stat[]> = {
  football: [
    { key: 'REC', value: '48' },
    { key: 'YDS', value: '812' },
    { key: 'TD', value: '9' },
    { key: 'YPC', value: '16.9' },
  ],
  basketball: [
    { key: 'PPG', value: '18.4' },
    { key: 'RPG', value: '4.5' },
    { key: 'APG', value: '6.2' },
    { key: 'FG%', value: '47' },
  ],
  soccer: [
    { key: 'G', value: '7' },
    { key: 'A', value: '11' },
    { key: 'SH', value: '34' },
    { key: 'MIN', value: '1,260' },
  ],
  baseball: [
    { key: 'AVG', value: '.342' },
    { key: 'HR', value: '6' },
    { key: 'RBI', value: '31' },
    { key: 'OBP', value: '.418' },
  ],
  softball: [
    { key: 'AVG', value: '.388' },
    { key: 'HR', value: '4' },
    { key: 'RBI', value: '27' },
    { key: 'SB', value: '15' },
  ],
  track: [
    { key: '100M', value: '10.84' },
    { key: '200M', value: '21.96' },
    { key: 'MEETS', value: '9' },
    { key: 'PRS', value: '5' },
  ],
  volleyball: [
    { key: 'K', value: '214' },
    { key: 'DIG', value: '167' },
    { key: 'ACE', value: '38' },
    { key: 'BLK', value: '41' },
  ],
  tennis: [
    { key: 'W', value: '18' },
    { key: 'L', value: '4' },
    { key: 'SETS', value: '39' },
    { key: 'ACES', value: '72' },
  ],
  swimming: [
    { key: '50 FR', value: '21.4' },
    { key: '100 FR', value: '47.2' },
    { key: 'MEETS', value: '11' },
    { key: 'PRS', value: '6' },
  ],
}

export const statKeysFor = (sport?: string) => (SEASON_LINES[sport ?? 'football'] ?? SEASON_LINES.football).map((s) => s.key)

export type Delta = { dir: 'up' | 'down'; text: string }

export const ATHLETE_STRIP: { icon: IconName; label: string; value: string; delta?: Delta }[] = [
  { icon: 'eye-outline', label: 'Views', value: '1.2k', delta: { dir: 'up', text: '18%' } },
  { icon: 'heart-outline', label: 'Favorites', value: '64', delta: { dir: 'up', text: '6' } },
  { icon: 'chatbubble-outline', label: 'Messages', value: '12', delta: { dir: 'down', text: '2' } },
]

export const RECRUITER_STRIP: { icon: IconName; label: string; value: string; delta?: Delta }[] = [
  { icon: 'chatbubbles-outline', label: 'Replies', value: '6', delta: { dir: 'up', text: '2' } },
  { icon: 'eye-outline', label: 'Viewed', value: '138', delta: { dir: 'up', text: '21%' } },
  { icon: 'paper-plane-outline', label: 'Contacted', value: '9' },
]

export type Upload = { id: string; kind: 'video' | 'photo'; title: string; duration?: string; tone: 'turf' | 'night' | 'court'; /** Local file from the picker. */ uri?: string }

export const UPLOADS: Upload[] = [
  { id: 'u1', kind: 'video', title: 'Friday vs Lakeside', duration: '0:42', tone: 'turf' },
  { id: 'u2', kind: 'video', title: 'Summer camp routes', duration: '1:15', tone: 'night' },
  { id: 'u3', kind: 'photo', title: 'Team photo', tone: 'court' },
]

export type Conversation = { id: string; name: string; initials: string; subtitle: string; snippet: string; time: string; unread: number; /** Prospect id when the other person is an athlete with a profile. */ personId?: string }

export const ATHLETE_MESSAGES: Conversation[] = [
  { id: 'm1', name: 'Coach Reyes', initials: 'CR', subtitle: 'Ridgeview University', snippet: 'Loved your film from Friday. Free for a call this week?', time: '2m', unread: 2 },
  { id: 'm2', name: 'Coach Allen', initials: 'MA', subtitle: 'State Tech', snippet: 'Send over your updated transcript when you can.', time: '1h', unread: 1 },
  { id: 'm3', name: 'Dana Brooks', initials: 'DB', subtitle: 'Scout · Southeast', snippet: 'Great numbers this season. Keep logging games.', time: 'Tue', unread: 0 },
]

export const RECRUITER_MESSAGES: Conversation[] = [
  { id: 'r1', personId: 'p1', name: 'Amara Okafor', initials: 'AO', subtitle: 'PG · Class of 2027', snippet: 'Thanks coach! I’ll send my full game tape tonight.', time: '5m', unread: 1 },
  { id: 'r2', personId: 'p2', name: 'Kai Thompson', initials: 'KT', subtitle: 'QB · Class of 2027', snippet: 'Our next home game is Friday at 7.', time: '3h', unread: 0 },
  { id: 'r3', personId: 'p4', name: 'Sofia Lang', initials: 'SL', subtitle: '400m · Class of 2028', snippet: 'Here’s the link to my state meet results.', time: 'Mon', unread: 0 },
]

export type Activity = { id: string; icon: IconName; text: string; bold: string; time: string; tone: 'accent' | 'success' | 'gold' }

export const ATHLETE_ACTIVITY: Activity[] = [
  { id: 'a1', icon: 'eye', bold: 'Coach Reyes', text: 'viewed your profile', time: '2m ago', tone: 'accent' },
  { id: 'a2', icon: 'bookmark', bold: 'State Tech', text: 'saved you to their board', time: '1h ago', tone: 'accent' },
  { id: 'a3', icon: 'videocam', bold: 'Your highlight', text: 'passed 300 views', time: 'Yesterday', tone: 'success' },
  { id: 'a4', icon: 'trophy', bold: 'New PR', text: 'logged in MaxStats', time: 'Sep 19', tone: 'gold' },
]

export const RECRUITER_ACTIVITY: Activity[] = [
  { id: 'b1', icon: 'person-add', bold: '4 new athletes', text: 'match your board', time: '10m ago', tone: 'accent' },
  { id: 'b2', icon: 'chatbubble', bold: 'Amara Okafor', text: 'replied to your message', time: '5m ago', tone: 'success' },
  { id: 'b3', icon: 'stats-chart', bold: 'Kai Thompson', text: 'logged a new game', time: '2h ago', tone: 'accent' },
  { id: 'b4', icon: 'videocam', bold: 'Diego Ruiz', text: 'uploaded new film', time: 'Yesterday', tone: 'gold' },
]

export type Prospect = {
  id: string
  name: string
  initials: string
  number: string
  sport: string
  position: string
  classYear: string
  school: string
  location: string
  height?: string
  keyStat: Stat
  line: Stat[]
  bio: string
}

export const PROSPECTS: Prospect[] = [
  {
    id: 'p1', name: 'Amara Okafor', initials: 'AO', number: '3', sport: 'basketball', position: 'PG', classYear: '2027',
    school: 'Westbrook High', location: 'Houston, TX', height: `5'9"`, keyStat: { key: 'PPG', value: '18.4' },
    line: [{ key: 'PPG', value: '18.4' }, { key: 'APG', value: '6.2' }, { key: 'STL', value: '2.1' }],
    bio: 'Floor general with a quick first step. Two-time all-district.',
  },
  {
    id: 'p2', name: 'Kai Thompson', initials: 'KT', number: '12', sport: 'football', position: 'QB', classYear: '2027',
    school: 'North Hill High', location: 'Tampa, FL', height: `6'2"`, keyStat: { key: 'YDS', value: '2,940' },
    line: [{ key: 'YDS', value: '2,940' }, { key: 'TD', value: '28' }, { key: 'CMP%', value: '66' }],
    bio: 'Pocket passer with touch downfield. Team captain.',
  },
  {
    id: 'p3', name: 'Diego Ruiz', initials: 'DR', number: '8', sport: 'soccer', position: 'CM', classYear: '2026',
    school: 'Coronado Academy', location: 'San Diego, CA', height: `5'10"`, keyStat: { key: 'AST', value: '11' },
    line: [{ key: 'G', value: '7' }, { key: 'A', value: '11' }, { key: 'PASS%', value: '89' }],
    bio: 'Box-to-box midfielder who controls tempo.',
  },
  {
    id: 'p4', name: 'Sofia Lang', initials: 'SL', number: '4', sport: 'track', position: '400m', classYear: '2028',
    school: 'Del Mar High', location: 'Austin, TX', keyStat: { key: 'PR', value: '54.1s' },
    line: [{ key: '400M', value: '54.1' }, { key: '200M', value: '24.6' }, { key: 'MEETS', value: '8' }],
    bio: 'State finalist in the 400m. Still dropping time.',
  },
  {
    id: 'p5', name: 'Marcus Hill', initials: 'MH', number: '22', sport: 'football', position: 'RB', classYear: '2026',
    school: 'Lakeside High', location: 'Charlotte, NC', height: `5'11"`, keyStat: { key: 'YDS', value: '1,486' },
    line: [{ key: 'YDS', value: '1,486' }, { key: 'TD', value: '19' }, { key: 'YPC', value: '6.8' }],
    bio: 'Downhill runner with breakaway speed.',
  },
  {
    id: 'p6', name: 'Lena Park', initials: 'LP', number: '9', sport: 'volleyball', position: 'OH', classYear: '2027',
    school: 'Bayview Prep', location: 'Seattle, WA', height: `6'0"`, keyStat: { key: 'K', value: '214' },
    line: [{ key: 'K', value: '214' }, { key: 'DIG', value: '167' }, { key: 'ACE', value: '38' }],
    bio: 'Six-rotation outside hitter with a heavy arm.',
  },
  {
    id: 'p7', name: 'Theo Grant', initials: 'TG', number: '24', sport: 'basketball', position: 'SF', classYear: '2026',
    school: 'Kingston High', location: 'Atlanta, GA', height: `6'6"`, keyStat: { key: 'PPG', value: '21.7' },
    line: [{ key: 'PPG', value: '21.7' }, { key: 'RPG', value: '8.1' }, { key: 'BLK', value: '1.9' }],
    bio: 'Two-way wing who defends four positions.',
  },
  {
    id: 'p8', name: 'Ava Morales', initials: 'AM', number: '16', sport: 'softball', position: 'SS', classYear: '2028',
    school: 'Cedar Park High', location: 'Phoenix, AZ', keyStat: { key: 'AVG', value: '.388' },
    line: [{ key: 'AVG', value: '.388' }, { key: 'HR', value: '4' }, { key: 'SB', value: '15' }],
    bio: 'Slick-fielding shortstop, leadoff bat.',
  },
]

export type Notice = { id: string; icon: IconName; title: string; body: string; time: string; unread: boolean }

export const ATHLETE_NOTICES: Notice[] = [
  { id: 'n1', icon: 'eye', title: 'Coach Reyes viewed your profile', body: 'Ridgeview University', time: '2m', unread: true },
  { id: 'n2', icon: 'chatbubble', title: 'New message from Coach Allen', body: '“Send over your updated transcript…”', time: '1h', unread: true },
  { id: 'n3', icon: 'bookmark', title: 'Saved to a recruiting board', body: 'State Tech', time: '1h', unread: true },
  { id: 'n4', icon: 'trending-up', title: 'Your views are up 18%', body: 'Compared with last week', time: 'Mon', unread: false },
]

export const RECRUITER_NOTICES: Notice[] = [
  { id: 'q1', icon: 'person-add', title: '4 new athletes match your board', body: 'Football · Basketball · Class of 2027', time: '10m', unread: true },
  { id: 'q2', icon: 'chatbubble', title: 'Amara Okafor replied', body: '“Thanks coach! I’ll send my full…”', time: '5m', unread: true },
  { id: 'q3', icon: 'stats-chart', title: 'Kai Thompson logged a game', body: '312 yds · 4 TD vs Lakeside', time: '2h', unread: false },
]

/** Search suggestions for the dashboard header. */
export const SEARCH_SUGGESTIONS = [
  'Ridgeview University',
  'State Tech',
  'Coach Reyes',
  'MaxStats',
  'Highlights',
  'Messages',
  'Football recruiting',
  'Basketball camps',
  'Class of 2027',
]

/** Seed chat history per conversation: oldest first, minutes before "now". */
export type SeedMessage = { from: 'me' | 'them'; text: string; minsAgo: number }

export const THREADS: Record<string, SeedMessage[]> = {
  m1: [
    { from: 'them', text: 'Hi Jordan, this is Coach Reyes from Ridgeview University.', minsAgo: 4320 },
    { from: 'me', text: 'Hi Coach! Thanks for reaching out.', minsAgo: 4310 },
    { from: 'them', text: 'Loved your film from Friday. The deep post route was a standout.', minsAgo: 5 },
    { from: 'them', text: 'Free for a call this week?', minsAgo: 2 },
  ],
  m2: [
    { from: 'them', text: 'Great start to the season.', minsAgo: 130 },
    { from: 'them', text: 'Send over your updated transcript when you can.', minsAgo: 60 },
  ],
  m3: [
    { from: 'me', text: 'Thanks for the feedback at camp!', minsAgo: 2900 },
    { from: 'them', text: 'Great numbers this season. Keep logging games.', minsAgo: 2880 },
  ],
  r1: [
    { from: 'me', text: 'Amara, we’d love to see more of your film from the Westlake game.', minsAgo: 70 },
    { from: 'them', text: 'Thanks coach! I’ll send my full game tape tonight.', minsAgo: 5 },
  ],
  r2: [
    { from: 'me', text: 'What’s your schedule looking like? We want to see you play live.', minsAgo: 240 },
    { from: 'them', text: 'Our next home game is Friday at 7.', minsAgo: 180 },
  ],
  r3: [
    { from: 'me', text: 'Congrats on making the state final.', minsAgo: 4400 },
    { from: 'them', text: 'Here’s the link to my state meet results.', minsAgo: 4380 },
  ],
}

/** People an athlete can start a conversation with (coaches and scouts). */
export const ATHLETE_CONTACTS: { id: string; name: string; subtitle: string }[] = [
  { id: 'm1', name: 'Coach Reyes', subtitle: 'Ridgeview University' },
  { id: 'm2', name: 'Coach Allen', subtitle: 'State Tech' },
  { id: 'm3', name: 'Dana Brooks', subtitle: 'Scout · Southeast' },
  { id: 'c4', name: 'Coach Patel', subtitle: 'Lakeside College' },
  { id: 'c5', name: 'Coach Morgan', subtitle: 'Bay State University' },
]

/** Colleges and programs an athlete can browse (illustrative). Coach ids line up with chat contacts. */
export type Program = {
  id: string
  name: string
  short: string
  level: string
  location: string
  sports: string[]
  colors: [string, string]
  blurb: string
  coaches: { id: string; name: string; title: string }[]
}

export const PROGRAMS: Program[] = [
  {
    id: 'g1', name: 'Ridgeview University', short: 'RU', level: 'NCAA D1', location: 'Columbus, OH', sports: ['football', 'basketball', 'track'],
    colors: ['#B3202A', '#3D0A0E'], blurb: 'Big-conference program with a pro-style offense and a deep receiver room.',
    coaches: [{ id: 'm1', name: 'Coach Reyes', title: 'Wide Receivers Coach' }, { id: 'c6', name: 'Coach Whitfield', title: 'Recruiting Coordinator' }],
  },
  {
    id: 'g2', name: 'State Tech', short: 'ST', level: 'NCAA D1', location: 'Atlanta, GA', sports: ['football', 'soccer', 'baseball'],
    colors: ['#C9A227', '#2A2106'], blurb: 'Engineering school with a fast-rising football program and strong academics.',
    coaches: [{ id: 'm2', name: 'Coach Allen', title: 'Head Coach' }],
  },
  {
    id: 'g3', name: 'Lakeside College', short: 'LC', level: 'NCAA D2', location: 'Madison, WI', sports: ['football', 'volleyball', 'softball'],
    colors: ['#1F6FB2', '#081D30'], blurb: 'Small classes, early playing time and a coaching staff that develops players.',
    coaches: [{ id: 'c4', name: 'Coach Patel', title: 'Offensive Coordinator' }],
  },
  {
    id: 'g4', name: 'Bay State University', short: 'BSU', level: 'NCAA D1', location: 'Boston, MA', sports: ['basketball', 'soccer', 'swimming'],
    colors: ['#0F7A5A', '#032018'], blurb: 'Urban campus with a nationally ranked soccer program.',
    coaches: [{ id: 'c5', name: 'Coach Morgan', title: 'Head Coach' }],
  },
  {
    id: 'g5', name: 'Northfield College', short: 'NC', level: 'NCAA D3', location: 'Portland, OR', sports: ['football', 'track', 'tennis'],
    colors: ['#5B3FA6', '#170D2E'], blurb: 'Liberal-arts college where athletes play multiple sports.',
    coaches: [{ id: 'c7', name: 'Coach Nguyen', title: 'Head Coach' }],
  },
  {
    id: 'g6', name: 'Coastal Community College', short: 'CCC', level: 'JUCO', location: 'San Diego, CA', sports: ['football', 'baseball', 'basketball'],
    colors: ['#E0782A', '#3A1A05'], blurb: 'Two-year pathway that sends players on to four-year programs.',
    coaches: [{ id: 'c8', name: 'Coach Ramirez', title: 'Head Coach' }],
  },
  {
    id: 'g7', name: 'Summit University', short: 'SU', level: 'NAIA', location: 'Denver, CO', sports: ['softball', 'volleyball', 'track'],
    colors: ['#2E8BC0', '#0A2233'], blurb: 'Mountain campus with a competitive NAIA track program.',
    coaches: [{ id: 'c9', name: 'Coach Harper', title: 'Head Coach' }],
  },
]

/** Camps and showcases (illustrative). Dates are ISO days. */
export type Camp = { id: string; name: string; host: string; hostProgram?: string; date: string; location: string; sport: string; level: string; about: string }

export const CAMPS: Camp[] = [
  { id: 'k1', name: 'Fall Receiver Showcase', host: 'Ridgeview University', hostProgram: 'g1', date: '2026-10-17', location: 'Columbus, OH', sport: 'football', level: 'Class of 2027–2028', about: 'Route running, 1-on-1s and a timed 40 in front of the Ridgeview staff.' },
  { id: 'k2', name: 'Southeast Elite Camp', host: 'State Tech', hostProgram: 'g2', date: '2026-10-24', location: 'Atlanta, GA', sport: 'football', level: 'All positions', about: 'One-day camp with position drills and live team periods.' },
  { id: 'k3', name: 'Hardwood Classic', host: 'Bay State University', hostProgram: 'g4', date: '2026-11-07', location: 'Boston, MA', sport: 'basketball', level: 'Class of 2027', about: 'Skills stations followed by coached 5-on-5 games.' },
  { id: 'k4', name: 'Lakeside Prospect Day', host: 'Lakeside College', hostProgram: 'g3', date: '2026-11-14', location: 'Madison, WI', sport: 'football', level: 'Class of 2027–2029', about: 'Measurables, position work and a campus tour.' },
  { id: 'k5', name: 'Winter Sprint Series', host: 'Summit University', hostProgram: 'g7', date: '2026-12-05', location: 'Denver, CO', sport: 'track', level: 'All classes', about: 'Timed sprints and relays with coaches from the region.' },
  { id: 'k6', name: 'Coastal Combine', host: 'Coastal Community College', hostProgram: 'g6', date: '2026-12-12', location: 'San Diego, CA', sport: 'football', level: 'Class of 2026–2027', about: 'Combine-style testing: 40, shuttle, vertical and broad jump.' },
]
