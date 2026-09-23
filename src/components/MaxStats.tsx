import { animate, AnimatePresence, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { MaskLines, Reveal } from './Reveal'
import './MaxStats.css'

type Game = { wk: string; opp: string; res: string; v: [number, number, number] }
type Sport = {
  id: string
  label: string
  athlete: string
  cols: [string, string, string]
  games: Game[]
  totals: (g: Game[]) => { label: string; value: number; decimals?: number }[]
}

const sum = (g: Game[], i: number) => g.reduce((n, x) => n + x.v[i], 0)
const avg = (g: Game[], i: number) => sum(g, i) / g.length

// Illustrative game logs; the totals are derived from them so the board always adds up.
const sports: Sport[] = [
  {
    id: 'football',
    label: 'Football',
    athlete: 'Jordan Mitchell · WR · #11',
    cols: ['REC', 'YDS', 'TD'],
    games: [
      { wk: 'WK 1', opp: 'vs Lakeside', res: 'W 28–14', v: [6, 112, 2] },
      { wk: 'WK 2', opp: '@ Central', res: 'W 21–17', v: [4, 68, 0] },
      { wk: 'WK 3', opp: 'vs North Hill', res: 'L 10–24', v: [7, 131, 1] },
      { wk: 'WK 4', opp: '@ Westbrook', res: 'W 35–7', v: [5, 97, 2] },
    ],
    totals: (g) => [
      { label: 'Receptions', value: sum(g, 0) },
      { label: 'Yards', value: sum(g, 1) },
      { label: 'Touchdowns', value: sum(g, 2) },
      { label: 'Yds / Rec', value: sum(g, 1) / sum(g, 0), decimals: 1 },
    ],
  },
  {
    id: 'basketball',
    label: 'Basketball',
    athlete: 'Amara Okafor · PG · #3',
    cols: ['PTS', 'REB', 'AST'],
    games: [
      { wk: 'GM 1', opp: 'vs Westlake', res: 'W 64–58', v: [22, 5, 7] },
      { wk: 'GM 2', opp: '@ Kingston', res: 'L 51–55', v: [16, 4, 6] },
      { wk: 'GM 3', opp: 'vs Bayview', res: 'W 70–49', v: [19, 6, 5] },
      { wk: 'GM 4', opp: '@ Cedar Park', res: 'W 62–60', v: [17, 3, 8] },
    ],
    totals: (g) => [
      { label: 'Points / game', value: avg(g, 0), decimals: 1 },
      { label: 'Rebounds / game', value: avg(g, 1), decimals: 1 },
      { label: 'Assists / game', value: avg(g, 2), decimals: 1 },
      { label: 'Games', value: g.length },
    ],
  },
  {
    id: 'soccer',
    label: 'Soccer',
    athlete: 'Diego Ruiz · CM · #8',
    cols: ['G', 'A', 'SH'],
    games: [
      { wk: 'MD 1', opp: 'vs Rio Vista', res: 'W 2–0', v: [1, 1, 3] },
      { wk: 'MD 2', opp: '@ Mesa', res: 'D 1–1', v: [0, 1, 2] },
      { wk: 'MD 3', opp: 'vs Coronado', res: 'W 3–1', v: [1, 2, 4] },
      { wk: 'MD 4', opp: '@ Del Mar', res: 'L 0–1', v: [0, 0, 1] },
    ],
    totals: (g) => [
      { label: 'Goals', value: sum(g, 0) },
      { label: 'Assists', value: sum(g, 1) },
      { label: 'Shots', value: sum(g, 2) },
      { label: 'Goal contributions', value: sum(g, 0) + sum(g, 1) },
    ],
  },
]

/** Counts to `to` once visible, then re-counts from wherever it is whenever `to` changes. */
function Counter({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const [value, setValue] = useState(0)
  const current = useRef(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(current.current, to, {
      duration: 1.2,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => {
        current.current = v
        setValue(v)
      },
    })
    return () => controls.stop()
  }, [inView, to])

  return <span ref={ref}>{value.toFixed(decimals)}</span>
}

export function MaxStats() {
  const [active, setActive] = useState(0)
  const sport = sports[active]
  const totals = sport.totals(sport.games)

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
              <div className="board__tabs" role="tablist" aria-label="Choose a sport">
                {sports.map((s, i) => (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={i === active}
                    className={i === active ? 'is-active' : undefined}
                    onClick={() => setActive(i)}
                  >
                    {i === active && (
                      <motion.span layoutId="board-tab" className="board__tab-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                    )}
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
              <span className="board__who">
                <i /> {sport.athlete}
              </span>
            </div>

            <div className="board__totals">
              {totals.map((t) => (
                <div key={t.label}>
                  <b>
                    <Counter to={t.value} decimals={t.decimals} />
                  </b>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.small key={t.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                      {t.label}
                    </motion.small>
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="board__log" role="table" aria-label={`${sport.label} game log`}>
              <div className="board__row board__row--head" role="row">
                <span role="columnheader">Game</span>
                <span role="columnheader">Result</span>
                {sport.cols.map((c) => (
                  <span role="columnheader" key={c}>
                    {c}
                  </span>
                ))}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={sport.id} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                  {sport.games.map((g, i) => (
                    <motion.div
                      className="board__row"
                      role="row"
                      key={g.wk}
                      initial={{ opacity: 0, x: -24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      <span role="cell">
                        <em>{g.wk}</em> {g.opp}
                      </span>
                      <span role="cell" className={g.res.startsWith('W') ? 'is-w' : g.res.startsWith('L') ? 'is-l' : 'is-d'}>
                        {g.res}
                      </span>
                      {g.v.map((n, j) => (
                        <span role="cell" key={j}>
                          {n}
                        </span>
                      ))}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
