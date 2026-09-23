import type { ReactNode } from 'react'
import { Icon } from '../Icon'
import './Phone.css'

export function Phone({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone__screen">
        <div className="phone__island" />
        <StatusBar />
        <div className="phone__body">{children}</div>
        <TabBar />
      </div>
    </div>
  )
}

function StatusBar() {
  return (
    <div className="app-status">
      <span>9:41</span>
      <span className="app-status__icons">
        <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden="true">
          <rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" fill="currentColor" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" fill="currentColor" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
          <rect x=".5" y=".5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor" />
          <rect x="23" y="4" width="1.6" height="4" rx=".8" fill="currentColor" opacity=".4" />
        </svg>
      </span>
    </div>
  )
}

function TabBar() {
  return (
    <div className="app-tabs">
      <span className="is-active">
        <Icon name="grid" size={19} />
        Home
      </span>
      <span>
        <Icon name="search" size={19} />
        Discover
      </span>
      <span>
        <Icon name="chat" size={19} />
        Messages
      </span>
      <span>
        <Icon name="edit" size={19} />
        Profile
      </span>
    </div>
  )
}

/** Initials avatar used across the app (initials-fallback, as in AthleteHeroCard). */
export function Avatar({ initials, size = 36, hue = 220, online }: { initials: string; size?: number; hue?: number; online?: boolean }) {
  return (
    <span
      className="app-avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(140deg, hsl(${hue} 70% 46%), hsl(${hue + 30} 60% 22%))`,
      }}
    >
      {initials}
      {online && <i className="app-avatar__dot" />}
    </span>
  )
}
