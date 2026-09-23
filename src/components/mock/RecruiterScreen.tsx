import { Icon, VerifiedBadge } from '../Icon'
import { Avatar } from './Phone'

const recommended = [
  { i: 'AO', name: 'Amara Okafor', pos: 'PG · 2027', stat: '18.4 PPG', hue: 12, saved: true },
  { i: 'DR', name: 'Diego Ruiz', pos: 'CM · 2026', stat: '11 AST', hue: 150, saved: false },
  { i: 'KT', name: 'Kai Thompson', pos: 'QB · 2027', stat: '2,940 YDS', hue: 220, saved: false },
  { i: 'SL', name: 'Sofia Lang', pos: '400m · 2028', stat: '54.1s PR', hue: 280, saved: true },
]

/** Mirrors RecruiterDashboardScreen.tsx: header → stats row → recommended athletes → messages. */
export function RecruiterScreen() {
  return (
    <div className="app">
      <header className="app-header">
        <Avatar initials="CR" size={34} hue={30} />
        <div className="app-header__text">
          <small>Head Coach · Ridgeview</small>
          <strong>Coach Reyes</strong>
        </div>
        <span className="app-chip">
          <Icon name="search" size={16} />
        </span>
        <span className="app-chip">
          <Icon name="bell" size={16} />
          <i className="app-chip__badge">5</i>
        </span>
      </header>

      <section className="app-strip">
        {[
          ['Saved', '24'],
          ['Viewed', '138'],
          ['Contacted', '9'],
        ].map(([label, value]) => (
          <div key={label}>
            <span className="app-strip__label">{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </section>

      <section>
        <div className="app-section-title">
          <span>Recommended athletes</span>
          <span className="app-toggle">
            <Icon name="grid" size={12} />
            <i />
          </span>
        </div>
        <div className="app-athletes">
          {recommended.map((a) => (
            <div className="app-athlete" key={a.name}>
              <div className="app-athlete__top">
                <Avatar initials={a.i} size={34} hue={a.hue} />
                <span className={a.saved ? 'app-save is-saved' : 'app-save'}>
                  <Icon name="bookmark" size={12} />
                </span>
              </div>
              <strong>
                {a.name} <VerifiedBadge size={11} />
              </strong>
              <small>{a.pos}</small>
              <b>{a.stat}</b>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="app-section-title">
          <span>Recent messages</span>
          <span className="app-link">View all</span>
        </div>
        <div className="app-msg">
          <Avatar initials="AO" size={30} hue={12} />
          <div>
            <strong>Amara Okafor</strong>
            <small>Thanks coach! I'll send my full game tape…</small>
          </div>
          <i className="app-msg__dot" />
        </div>
      </section>
    </div>
  )
}
