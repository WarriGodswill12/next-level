import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useMedia } from '../hooks/useMedia'
import { Icon, VerifiedBadge } from './Icon'
import { MaskLines } from './Reveal'
import './Playbook.css'

type Step = { n: string; title: string; body: string; visual: ReactNode }

const steps: Step[] = [
  {
    n: '01',
    title: 'Build your profile',
    body: 'Position, class year, location, sport. The guided completion flow shows exactly what is missing until your profile is at full strength.',
    visual: (
      <div className="pb-vis pb-vis--strength">
        <div className="pb-vis__row">
          <span>Profile strength</span>
          <b>100%</b>
        </div>
        <div className="pb-bar">
          <motion.i
            initial={{ width: '12%' }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </div>
        <div className="pb-checks">
          <span>
            <Icon name="shield" size={14} /> Verified
          </span>
          <span>Bio</span>
          <span>Photos</span>
          <span>Academics</span>
        </div>
      </div>
    ),
  },
  {
    n: '02',
    title: 'Log every game',
    body: 'MaxStats turns your season into a real stat history, game by game. No screenshots, no guesswork: numbers a coach can read in seconds.',
    visual: (
      <div className="pb-vis pb-vis--stats">
        {[
          ['PTS', '24'],
          ['REB', '9'],
          ['AST', '6'],
          ['STL', '3'],
        ].map(([k, v]) => (
          <div key={k}>
            <b>{v}</b>
            <small>{k}</small>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: '03',
    title: 'Drop your highlights',
    body: 'Upload game film and photos straight from your phone. Your best plays live on your profile, ready the moment a recruiter opens it.',
    visual: (
      <div className="pb-vis pb-vis--reel">
        <span className="pb-reel pb-reel--a">
          <Icon name="play" size={16} />
        </span>
        <span className="pb-reel pb-reel--b">
          <Icon name="play" size={16} />
        </span>
        <span className="pb-reel pb-reel--c">
          <Icon name="upload" size={18} />
        </span>
      </div>
    ),
  },
  {
    n: '04',
    title: 'Get discovered',
    body: 'Recruiters find you through recommendations, save you to their board and message you directly. You see every view, favorite and message.',
    visual: (
      <div className="pb-vis pb-vis--msg">
        <div className="pb-bubble">
          <strong>
            Coach Reyes <VerifiedBadge size={12} />
          </strong>
          Loved your film from Friday. Are you free for a call this week?
        </div>
        <div className="pb-bubble pb-bubble--me">Yes coach! Anytime after practice.</div>
      </div>
    ),
  },
]

export function Playbook() {
  const desktop = useMedia('(min-width: 1000px)')
  const track = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-58%'])
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="playbook" id="how">
      <div ref={track} className={desktop ? 'playbook__track is-pinned' : 'playbook__track'}>
        <div className="playbook__sticky">
          <div className="wrap playbook__head">
            <span className="eyebrow">How it works</span>
            <h2 className="display">
              <MaskLines
                lines={[
                  <>
                    The <span className="outline">Playbook</span>
                  </>,
                ]}
              />
            </h2>
            {desktop && (
              <div className="playbook__progress">
                <motion.i style={{ width: progress }} />
              </div>
            )}
          </div>

          <motion.ol className="playbook__cards" style={desktop ? { x } : undefined}>
            {steps.map((s, i) => (
              <li className="pb-card" key={s.n} style={{ ['--i' as string]: i }}>
                <span className="pb-card__n">{s.n}</span>
                {s.visual}
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
