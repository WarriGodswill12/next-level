import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useState } from 'react'
import { Icon, VerifiedBadge } from './Icon'
import { LogoMark } from './Logo'
import { MaskLines, Reveal } from './Reveal'
import './ProfileCard.css'

type CardData = {
  num: string
  first: string
  last: string
  pos: string
  meta: string
  sport: 'football' | 'basketball' | 'soccer'
  stats: [string, string][]
}

// Illustrative athletes, matching the people shown in the app mockups.
const jordan: CardData = {
  num: '11',
  first: 'Jordan',
  last: 'Mitchell',
  pos: 'WR',
  meta: 'Atlanta, GA · Class of 2027',
  sport: 'football',
  stats: [
    ['48', 'REC'],
    ['812', 'YDS'],
    ['9', 'TD'],
  ],
}

const amara: CardData = {
  num: '3',
  first: 'Amara',
  last: 'Okafor',
  pos: 'PG',
  meta: 'Houston, TX · Class of 2027',
  sport: 'basketball',
  stats: [
    ['18.4', 'PPG'],
    ['6.2', 'AST'],
    ['2.1', 'STL'],
  ],
}

const diego: CardData = {
  num: '8',
  first: 'Diego',
  last: 'Ruiz',
  pos: 'CM',
  meta: 'San Diego, CA · Class of 2026',
  sport: 'soccer',
  stats: [
    ['7', 'G'],
    ['11', 'AST'],
    ['89%', 'PASS'],
  ],
}

function CardFront({ d }: { d: CardData }) {
  return (
    <div className={`tc__face tc__front tc--${d.sport}`}>
      <div className="tc__field" aria-hidden="true" />
      <div className="tc__top">
        <span className="tc__brand">
          <LogoMark size={20} /> Next Level
        </span>
        <span className="tc__season">2026</span>
      </div>
      <div className="tc__num" aria-hidden="true">
        {d.num}
      </div>
      <span className="tc__pos">
        <i>{d.pos}</i>
      </span>
      <div className="tc__plate">
        <strong>
          {d.first} <b>{d.last}</b>
        </strong>
        <small>
          <VerifiedBadge size={12} /> {d.meta}
        </small>
      </div>
      <div className="tc__stats">
        {d.stats.map(([v, k]) => (
          <div key={k}>
            <b>{v}</b>
            <small>{k}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

function CardBack({ d }: { d: CardData }) {
  return (
    <div className="tc__face tc__back">
      <div className="tc__back-head">
        <span>Scouting report</span>
        <LogoMark size={22} />
      </div>
      <strong className="tc__back-name">
        {d.first} {d.last}
      </strong>
      <small className="tc__back-meta">
        {d.pos} · {d.meta}
      </small>

      <dl className="tc__measure">
        <div>
          <dt>Height</dt>
          <dd>6'1"</dd>
        </div>
        <div>
          <dt>Weight</dt>
          <dd>185</dd>
        </div>
        <div>
          <dt>40 yd</dt>
          <dd>4.52</dd>
        </div>
        <div>
          <dt>GPA</dt>
          <dd>3.7</dd>
        </div>
      </dl>

      <div className="tc__back-block">
        <span>MaxStats · Season</span>
        <div className="tc__back-line">
          {d.stats.map(([v, k]) => (
            <div key={k}>
              <b>{v}</b>
              <small>{k}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="tc__back-block">
        <span>
          Profile strength <b>82%</b>
        </span>
        <div className="tc__bar">
          <i />
        </div>
      </div>

      <div className="tc__back-foot">
        <span>
          <Icon name="play" size={12} /> 12 highlights
        </span>
        <span>
          <Icon name="share" size={12} /> Share profile
        </span>
      </div>
    </div>
  )
}

function HeroCard() {
  const [flipped, setFlipped] = useState(false)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [14, -14]), { stiffness: 160, damping: 18 })
  const ry = useSpring(useTransform(mx, [0, 1], [-18, 18]), { stiffness: 160, damping: 18 })
  const px = useTransform(mx, [0, 1], [0, 100])
  const py = useTransform(my, [0, 1], [0, 100])
  const holoPos = useMotionTemplate`${px}% ${py}%`
  const glare = useMotionTemplate`radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.45), transparent 45%)`

  return (
    <motion.button
      className="tc tc--hero"
      aria-label={flipped ? 'Show front of profile card' : 'Flip profile card to see scouting report'}
      aria-pressed={flipped}
      style={{ rotateX: rx, rotateY: ry }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width)
        my.set((e.clientY - r.top) / r.height)
      }}
      onPointerLeave={() => {
        mx.set(0.5)
        my.set(0.5)
      }}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="tc__inner"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <CardFront d={jordan} />
        <CardBack d={jordan} />
      </motion.div>
      <motion.span className="tc__holo" style={{ backgroundPosition: holoPos }} aria-hidden="true" />
      <motion.span className="tc__glare" style={{ background: glare }} aria-hidden="true" />
    </motion.button>
  )
}

export function ProfileCard() {
  return (
    <section className="section cards" id="profile">
      <div className="wrap cards__grid">
        <div className="cards__copy">
          <span className="eyebrow">Your profile</span>
          <h2 className="display cards__title">
            <MaskLines lines={['Your card.', <span className="cards__accent">Your story.</span>]} />
          </h2>
          <Reveal>
            <p className="cards__lede">
              Every Next Level profile is built like a pro card: who you are up front, the numbers on the back. Share it
              with one link and let coaches flip through your story in seconds.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="cards__tags">
              <li>
                <Icon name="shield" size={16} /> Verified identity
              </li>
              <li>
                <Icon name="chart" size={16} /> Live MaxStats
              </li>
              <li>
                <Icon name="play" size={16} /> Highlight film
              </li>
              <li>
                <Icon name="share" size={16} /> One-tap sharing
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="cards__stage">
          <motion.div
            className="tc tc--side tc--left"
            initial={{ opacity: 0, x: 60, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: -12 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            aria-hidden="true"
          >
            <CardFront d={amara} />
          </motion.div>
          <motion.div
            className="tc tc--side tc--right"
            initial={{ opacity: 0, x: -60, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: 12 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            aria-hidden="true"
          >
            <CardFront d={diego} />
          </motion.div>
          <Reveal y={80} className="cards__hero">
            <HeroCard />
          </Reveal>
          <span className="cards__hint">
            <Icon name="arrowUpRight" size={14} /> Tap the card to flip it
          </span>
        </div>
      </div>
    </section>
  )
}
