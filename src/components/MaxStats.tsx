import { animate, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { MaskLines, Reveal } from './Reveal'
import './MaxStats.css'

// Illustrative game log for the section; not real athlete data.
const games = [
  { wk: 'WK 1', opp: 'vs Lakeside', res: 'W 28–14', rec: 6, yds: 112, td: 2 },
  { wk: 'WK 2', opp: '@ Central', res: 'W 21–17', rec: 4, yds: 68, td: 0 },
  { wk: 'WK 3', opp: 'vs North Hill', res: 'L 10–24', rec: 7, yds: 131, td: 1 },
  { wk: 'WK 4', opp: '@ Westbrook', res: 'W 35–7', rec: 5, yds: 97, td: 2 },
]

const totals = [
  { label: 'Receptions', value: 22 },
  { label: 'Yards', value: 408 },
  { label: 'Touchdowns', value: 5 },
  { label: 'Yds / Rec', value: 18.5, decimals: 1 },
]

function Counter({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.6, ease: [0.2, 0.8, 0.2, 1], onUpdate: setValue })
    return () => controls.stop()
  }, [inView, to])

  return <span ref={ref}>{value.toFixed(decimals)}</span>
}

export function MaxStats() {
  return (
    <section className="section maxstats" id="maxstats">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">MaxStats</span>
            <h2 className="display" style={{ marginTop: 22 }}>
              <MaskLines lines={['Every game.', <span className="outline">On the record.</span>]} />
            </h2>
          </div>
          <Reveal>
            <p>
              MaxStats is the performance tracker built into Next Level. Log each game, build a season history and
              give recruiters numbers they can read in seconds, not a screenshot of a spreadsheet.
            </p>
          </Reveal>
        </div>

        <Reveal y={60}>
          <div className="board">
            <div className="board__top">
              <span className="board__live">
                <i /> Season 2026
              </span>
              <span>Jordan Mitchell · WR · #11</span>
            </div>

            <div className="board__totals">
              {totals.map((t) => (
                <div key={t.label}>
                  <b>
                    <Counter to={t.value} decimals={t.decimals} />
                  </b>
                  <small>{t.label}</small>
                </div>
              ))}
            </div>

            <div className="board__log" role="table" aria-label="Game log">
              <div className="board__row board__row--head" role="row">
                <span role="columnheader">Game</span>
                <span role="columnheader">Result</span>
                <span role="columnheader">REC</span>
                <span role="columnheader">YDS</span>
                <span role="columnheader">TD</span>
              </div>
              {games.map((g, i) => (
                <motion.div
                  className="board__row"
                  role="row"
                  key={g.wk}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <span role="cell">
                    <em>{g.wk}</em> {g.opp}
                  </span>
                  <span role="cell" className={g.res.startsWith('W') ? 'is-w' : 'is-l'}>
                    {g.res}
                  </span>
                  <span role="cell">{g.rec}</span>
                  <span role="cell">{g.yds}</span>
                  <span role="cell">{g.td}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
