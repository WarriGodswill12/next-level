import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Upload } from '@/data/demo'
import { UPLOADS } from '@/data/demo'

export type Role = 'athlete' | 'recruiter'

export type AthleteProfile = {
  sport?: string
  position?: string
  classYear?: string
  jersey?: string
  school?: string
  city?: string
  state?: string
  height?: string
  weight?: string
  gpa?: string
}

export type RecruiterProfile = {
  organization?: string
  title?: string
  level?: string
  sports?: string[]
  classYears?: string[]
}

export type LoggedGame = { opponent: string; result: 'W' | 'L' | 'D'; stats: string[] }

type Session = {
  role: Role | null
  name: string
  email: string
  verified: boolean
  onboarded: boolean
  athlete: AthleteProfile
  recruiter: RecruiterProfile
  /** MaxStats profile exists (drives the widget's empty vs. populated state). */
  maxStats: boolean
  games: LoggedGame[]
  /** Prospect ids a recruiter has saved to their board. */
  saved: string[]
  upgradeDismissed: boolean
  /** Local profile photo (picked from the library). */
  photo?: string
  bio: string
  uploads: Upload[]
  notify: { messages: boolean; views: boolean; camps: boolean }
  /** Program ids an athlete follows, and camp ids they are interested in. */
  following: string[]
  interested: string[]
}

type SessionContextValue = Session & {
  signedIn: boolean
  chooseRole: (role: Role) => void
  signUp: (input: { name: string; email: string; password: string }) => Promise<void>
  logIn: (input: { email: string; password: string }) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  verifyEmail: (code: string) => Promise<void>
  resendCode: () => Promise<void>
  setName: (name: string) => void
  setPhoto: (uri?: string) => void
  setBio: (bio: string) => void
  addUpload: (u: Upload) => void
  setNotify: (patch: Partial<Session['notify']>) => void
  deleteAccount: () => Promise<void>
  updateAthlete: (patch: AthleteProfile) => void
  updateRecruiter: (patch: RecruiterProfile) => void
  completeOnboarding: () => void
  setupMaxStats: () => void
  logGame: (g: LoggedGame) => void
  toggleSaved: (id: string) => void
  dismissUpgrade: () => void
  toggleFollow: (programId: string) => void
  toggleInterested: (campId: string) => void
  signOut: () => void
}

const empty: Session = {
  role: null,
  name: '',
  email: '',
  verified: false,
  onboarded: false,
  athlete: {},
  recruiter: {},
  maxStats: false,
  games: [],
  saved: ['p1', 'p4'],
  upgradeDismissed: false,
  following: ['g1'],
  bio: '',
  uploads: UPLOADS,
  notify: { messages: true, views: true, camps: false },
  interested: [],
}

const SessionContext = createContext<SessionContextValue | null>(null)

// Simulated network latency so loading states are visible while there is no backend.
const wait = (ms = 900) => new Promise((r) => setTimeout(r, ms))

/**
 * Client-side session + onboarding state.
 * TODO(backend): replace the simulated calls below with the real auth API.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Session>(empty)
  const [signedIn, setSignedIn] = useState(false)

  const chooseRole = useCallback((role: Role) => setS((p) => ({ ...p, role })), [])

  const signUp = useCallback(async ({ name, email }: { name: string; email: string; password: string }) => {
    await wait()
    setS((p) => ({ ...p, name: name.trim(), email: email.trim().toLowerCase(), verified: false }))
  }, [])

  const logIn = useCallback(async ({ email }: { email: string; password: string }) => {
    await wait()
    // A returning user: verified, onboarded, with a sample athlete profile until the backend exists.
    setS((p) => ({
      ...p,
      email: email.trim().toLowerCase(),
      name: p.name || 'Jordan Mitchell',
      verified: true,
      onboarded: true,
      role: p.role ?? 'athlete',
      maxStats: true,
      athlete: Object.keys(p.athlete).length
        ? p.athlete
        : { sport: 'football', position: 'WR', classYear: '2027', jersey: '11', school: 'Westlake High School', city: 'Atlanta', state: 'GA', height: `6'1"`, weight: '185' },
    }))
    setSignedIn(true)
  }, [])

  const requestPasswordReset = useCallback(async () => {
    await wait()
  }, [])

  const verifyEmail = useCallback(async (code: string) => {
    await wait(700)
    if (code.length !== 6) throw new Error('Enter the 6-digit code')
    setS((p) => ({ ...p, verified: true }))
    setSignedIn(true)
  }, [])

  const resendCode = useCallback(async () => {
    await wait(600)
  }, [])

  const setPhoto = useCallback((photo?: string) => setS((p) => ({ ...p, photo })), [])
  const setBio = useCallback((bio: string) => setS((p) => ({ ...p, bio: bio.trim() })), [])
  const addUpload = useCallback((u: Upload) => setS((p) => ({ ...p, uploads: [u, ...p.uploads] })), [])
  const setNotify = useCallback((patch: Partial<Session['notify']>) => setS((p) => ({ ...p, notify: { ...p.notify, ...patch } })), [])
  // TODO(backend): call the account-deletion endpoint.
  const deleteAccount = useCallback(async () => {
    await wait(700)
    setS(empty)
    setSignedIn(false)
  }, [])
  const setName = useCallback((name: string) => setS((p) => ({ ...p, name: name.trim() })), [])
  const updateAthlete = useCallback((patch: AthleteProfile) => setS((p) => ({ ...p, athlete: { ...p.athlete, ...patch } })), [])
  const updateRecruiter = useCallback((patch: RecruiterProfile) => setS((p) => ({ ...p, recruiter: { ...p.recruiter, ...patch } })), [])
  const completeOnboarding = useCallback(() => setS((p) => ({ ...p, onboarded: true })), [])
  const setupMaxStats = useCallback(() => setS((p) => ({ ...p, maxStats: true })), [])
  const logGame = useCallback((g: LoggedGame) => setS((p) => ({ ...p, maxStats: true, games: [g, ...p.games] })), [])
  const toggleSaved = useCallback(
    (id: string) => setS((p) => ({ ...p, saved: p.saved.includes(id) ? p.saved.filter((x) => x !== id) : [...p.saved, id] })),
    [],
  )
  const dismissUpgrade = useCallback(() => setS((p) => ({ ...p, upgradeDismissed: true })), [])
  const flip = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  const toggleFollow = useCallback((id: string) => setS((p) => ({ ...p, following: flip(p.following, id) })), [])
  const toggleInterested = useCallback((id: string) => setS((p) => ({ ...p, interested: flip(p.interested, id) })), [])

  const signOut = useCallback(() => {
    setS(empty)
    setSignedIn(false)
  }, [])

  const value = useMemo<SessionContextValue>(
    () => ({
      ...s,
      signedIn,
      chooseRole,
      signUp,
      logIn,
      requestPasswordReset,
      verifyEmail,
      resendCode,
      setName,
      setPhoto,
      setBio,
      addUpload,
      setNotify,
      deleteAccount,
      updateAthlete,
      updateRecruiter,
      completeOnboarding,
      setupMaxStats,
      logGame,
      toggleSaved,
      dismissUpgrade,
      toggleFollow,
      toggleInterested,
      signOut,
    }),
    [s, signedIn, chooseRole, signUp, logIn, requestPasswordReset, verifyEmail, resendCode, setName, setPhoto, setBio, addUpload, setNotify, deleteAccount, updateAthlete, updateRecruiter, completeOnboarding, setupMaxStats, logGame, toggleSaved, dismissUpgrade, toggleFollow, toggleInterested, signOut],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>')
  return ctx
}
