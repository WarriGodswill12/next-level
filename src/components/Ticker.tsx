import './Ticker.css'

const sports = ['Football', 'Basketball', 'Soccer', 'Baseball', 'Track & Field', 'Volleyball', 'Lacrosse', 'Softball', 'Wrestling', 'Hockey']

function Row({ outline }: { outline?: boolean }) {
  // Content is doubled so the -50% keyframe loops seamlessly.
  const items = [...sports, ...sports]
  return (
    <div className="ticker__track">
      {items.map((s, i) => (
        <span key={i} className={outline ? 'outline' : undefined}>
          {s}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 15 12 8l7 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" />
          </svg>
        </span>
      ))}
    </div>
  )
}

export function Ticker() {
  return (
    <div className="ticker" aria-label="Sports on Next Level">
      <div className="ticker__band ticker__band--back" aria-hidden="true">
        <Row outline />
      </div>
      <div className="ticker__band ticker__band--front">
        <Row />
      </div>
    </div>
  )
}
