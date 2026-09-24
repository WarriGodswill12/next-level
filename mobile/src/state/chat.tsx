import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ATHLETE_MESSAGES, RECRUITER_MESSAGES, THREADS } from '@/data/demo'
import { ago } from '@/lib/time'
import { useSession } from './session'

export type ChatMessage = {
  id: string
  from: 'me' | 'them'
  kind: 'text' | 'image' | 'profile'
  text?: string
  /** Local image for kind 'image'. */
  uri?: string
  /** Prospect id, or 'me' for the signed-in athlete's own card (kind 'profile'). */
  profileId?: string
  at: number
  status?: 'sent' | 'delivered' | 'read'
}

export type Convo = {
  id: string
  name: string
  subtitle: string
  personId?: string
  unread: number
  typing: boolean
}

/** Row shape for conversation lists (matches the dashboard preview). */
export type ConvoRow = { id: string; name: string; initials: string; subtitle: string; snippet: string; time: string; unread: number; personId?: string }

type ChatContextValue = {
  convos: Convo[]
  rows: ConvoRow[]
  totalUnread: number
  thread: (id: string) => ChatMessage[]
  convo: (id: string) => Convo | undefined
  send: (id: string, msg: Pick<ChatMessage, 'kind' | 'text' | 'uri' | 'profileId'>) => void
  markRead: (id: string) => void
  /** Returns the existing conversation with this person, or opens a new one. */
  start: (person: { id: string; name: string; subtitle: string; personId?: string }) => string
}

const ChatContext = createContext<ChatContextValue | null>(null)

let seq = 0
const uid = () => `msg-${Date.now()}-${seq++}`

function seed(role: 'athlete' | 'recruiter' | null) {
  const list = role === 'recruiter' ? RECRUITER_MESSAGES : ATHLETE_MESSAGES
  const now = Date.now()
  const convos: Convo[] = list.map((c) => ({ id: c.id, name: c.name, subtitle: c.subtitle, personId: c.personId, unread: c.unread, typing: false }))
  const threads: Record<string, ChatMessage[]> = {}
  for (const c of list) {
    threads[c.id] = (THREADS[c.id] ?? []).map((m) => ({
      id: uid(),
      from: m.from,
      kind: 'text',
      text: m.text,
      at: now - m.minsAgo * 60_000,
      status: m.from === 'me' ? 'read' : undefined,
    }))
  }
  return { convos, threads }
}

const snippetOf = (m?: ChatMessage) => {
  if (!m) return 'Say hello'
  const body = m.kind === 'image' ? 'Photo' : m.kind === 'profile' ? 'Shared a profile' : (m.text ?? '')
  return m.from === 'me' ? `You: ${body}` : body
}

// TODO(backend): simulated delivery, read receipt and one reply per thread, so the states are visible without a server.
const REPLY = { athlete: 'Sounds good. Talk soon!', recruiter: 'Thanks coach, I appreciate it!' }

export function ChatProvider({ children }: { children: ReactNode }) {
  const { role } = useSession()
  const [state, setState] = useState(() => seed(role))
  const replied = useRef(new Set<string>())
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // a different account (or role) gets its own inbox
  useEffect(() => {
    setState(seed(role))
    replied.current.clear()
  }, [role])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms))
  }

  const patchThread = useCallback((id: string, fn: (t: ChatMessage[]) => ChatMessage[]) => {
    setState((s) => ({ ...s, threads: { ...s.threads, [id]: fn(s.threads[id] ?? []) } }))
  }, [])

  const patchConvo = useCallback((id: string, patch: Partial<Convo>) => {
    setState((s) => ({ ...s, convos: s.convos.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  }, [])

  const send = useCallback<ChatContextValue['send']>(
    (id, msg) => {
      const m: ChatMessage = { id: uid(), from: 'me', at: Date.now(), status: 'sent', ...msg }
      patchThread(id, (t) => [...t, m])
      const setStatus = (status: ChatMessage['status']) => patchThread(id, (t) => t.map((x) => (x.id === m.id ? { ...x, status } : x)))
      later(700, () => setStatus('delivered'))
      later(1600, () => setStatus('read'))
      if (!replied.current.has(id)) {
        replied.current.add(id)
        later(2200, () => patchConvo(id, { typing: true }))
        later(4200, () => {
          patchConvo(id, { typing: false })
          patchThread(id, (t) => [...t, { id: uid(), from: 'them', kind: 'text', text: role === 'recruiter' ? REPLY.recruiter : REPLY.athlete, at: Date.now() }])
        })
      }
    },
    [patchThread, patchConvo, role],
  )

  const markRead = useCallback((id: string) => patchConvo(id, { unread: 0 }), [patchConvo])

  const start = useCallback<ChatContextValue['start']>(
    (person) => {
      const existing = state.convos.find((c) => c.id === person.id || (person.personId && c.personId === person.personId))
      if (existing) return existing.id
      setState((s) => ({
        convos: [{ id: person.id, name: person.name, subtitle: person.subtitle, personId: person.personId, unread: 0, typing: false }, ...s.convos],
        threads: { ...s.threads, [person.id]: [] },
      }))
      return person.id
    },
    [state.convos],
  )

  const value = useMemo<ChatContextValue>(() => {
    const last = (id: string) => state.threads[id]?.[state.threads[id]!.length - 1]
    const ordered = [...state.convos].sort((a, b) => (last(b.id)?.at ?? Infinity) - (last(a.id)?.at ?? Infinity))
    return {
      convos: ordered,
      rows: ordered.map((c) => {
        const m = last(c.id)
        return {
          id: c.id,
          name: c.name,
          initials: c.name.slice(0, 2).toUpperCase(),
          subtitle: c.subtitle,
          snippet: c.typing ? 'Typing…' : snippetOf(m),
          time: m ? ago(m.at) : 'new',
          unread: c.unread,
          personId: c.personId,
        }
      }),
      totalUnread: state.convos.reduce((n, c) => n + c.unread, 0),
      thread: (id) => state.threads[id] ?? [],
      convo: (id) => state.convos.find((c) => c.id === id),
      send,
      markRead,
      start,
    }
  }, [state, send, markRead, start])

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>')
  return ctx
}
