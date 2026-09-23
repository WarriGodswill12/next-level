import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Icon } from './Icon'
import { MaskLines } from './Reveal'
import './OldWay.css'

const rows = [
  { label: 'Getting seen', old: 'Cold-emailing every coach and hoping someone opens it.', next: 'Recommended straight onto recruiter dashboards.' },
  { label: 'Your numbers', old: 'Stats in a spreadsheet screenshot nobody trusts.', next: 'MaxStats game logs with a full season history.' },
  { label: 'Your film', old: 'Links scattered across five different platforms.', next: 'Highlights live on your profile, one tap away.' },
  { label: 'Feedback', old: 'Silence. You never know if anyone looked.', next: 'See every view, favorite and message as it happens.' },
]

function Digit({ value }: { value: number }) {
  return (
    <span className="sb__digit">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function OldWay() {
  const [score, setScore] = useState(0)

  return (
    <section className="section oldway">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">The matchup</span>
            <h2 className="display" style={{ marginTop: 22 }}>
              <MaskLines lines={['Old way', <span className="outline">vs. next level</span>]} />
            </h2>
          </div>
          <p>Recruiting was built for the athletes who were already found. Here is how the game changes for everyone else.</p>
        </div>

        <div className="sb">
          <div className="sb__head">
            <div className="sb__team sb__team--old">
              <small>Away</small>
              <strong>The old way</strong>
            </div>
            <div className="sb__score" aria-label={`Score: old way 0, Next Level ${score}`}>
              <span className="sb__digit sb__digit--dim">0</span>
              <i>:</i>
              <Digit value={score} />
            </div>
            <div className="sb__team sb__team--new">
              <small>Home</small>
              <strong>Next Level</strong>
            </div>
          </div>

          <ol className="sb__rows">
            {rows.map((r, i) => (
              <motion.li
                key={r.label}
                className="sb__row"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -30% 0px' }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                onViewportEnter={() => setScore((s) => Math.max(s, i + 1))}
              >
                <span className="sb__label">
                  <em>Q{i + 1}</em> {r.label}
                </span>
                <p className="sb__old">
                  <span className="sb__x" aria-hidden="true">
                    ✕
                  </span>
                  {r.old}
                </p>
                <p className="sb__new">
                  <span className="sb__check" aria-hidden="true">
                    <Icon name="arrowUpRight" size={14} strokeWidth={2.4} />
                  </span>
                  {r.next}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
