import { Icon, VerifiedBadge } from '../Icon'
import { Avatar } from './Phone'

/** Mirrors DashboardScreen.tsx: header → hero card → MaxStats → stats strip → quick uploads. */
export function AthleteScreen() {
  return (
    <div className="app">
      <header className="app-header">
        <Avatar initials="JM" size={34} />
        <div className="app-header__text">
          <small>Welcome back,</small>
          <strong>Jordan</strong>
        </div>
        <span className="app-chip">
          <Icon name="search" size={16} />
        </span>
        <span className="app-chip">
          <Icon name="bell" size={16} />
          <i className="app-chip__badge">3</i>
        </span>
      </header>

      <section className="app-hero">
        <div className="app-hero__top">
          <Avatar initials="JM" size={52} online />
          <div className="app-hero__id">
            <strong>
              Jordan Mitchell <VerifiedBadge size={14} />
            </strong>
            <small>Wide Receiver · Atlanta, GA</small>
            <div className="app-pills">
              <span>Football</span>
              <span>Class of 2027</span>
            </div>
          </div>
          <div className="app-hero__actions">
            <Icon name="edit" size={14} />
            <Icon name="share" size={14} />
          </div>
        </div>
        <div className="app-strength">
          <div className="app-strength__row">
            <span>Profile strength</span>
            <b>82%</b>
          </div>
          <div className="app-strength__bar">
            <i style={{ width: '82%' }} />
          </div>
        </div>
      </section>

      <section className="app-maxstats">
        <div className="app-section-title">
          <span>
            MaxStats <em>2026 season</em>
          </span>
          <Icon name="arrow" size={14} />
        </div>
        <div className="app-maxstats__line">
          {[
            ['REC', '48'],
            ['YDS', '812'],
            ['TD', '9'],
            ['YPC', '16.9'],
          ].map(([k, v]) => (
            <div key={k}>
              <b>{v}</b>
              <small>{k}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="app-strip">
        {[
          ['eye', 'Views', '1.2k', '+18%'],
          ['heart', 'Favorites', '64', '+6'],
          ['chat', 'Messages', '12', '+3'],
        ].map(([icon, label, value, delta]) => (
          <div key={label}>
            <span className="app-strip__label">
              <Icon name={icon as 'eye'} size={12} /> {label}
            </span>
            <b>{value}</b>
            <small className="app-up">▲ {delta}</small>
          </div>
        ))}
      </section>

      <section>
        <div className="app-section-title">
          <span>Quick uploads</span>
          <span className="app-link">View all</span>
        </div>
        <div className="app-uploads">
          <span className="app-thumb app-thumb--turf">
            <Icon name="play" size={14} />
            <em>0:42</em>
          </span>
          <span className="app-thumb app-thumb--night">
            <Icon name="play" size={14} />
            <em>1:15</em>
          </span>
          <span className="app-thumb app-thumb--add">
            <Icon name="plus" size={18} />
          </span>
        </div>
      </section>
    </div>
  )
}
