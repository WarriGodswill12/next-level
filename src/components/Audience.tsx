import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import { MaskLines, Reveal } from './Reveal'
import { Phone } from './mock/Phone'
import { AthleteScreen } from './mock/AthleteScreen'
import { RecruiterScreen } from './mock/RecruiterScreen'
import './Audience.css'

type Point = { icon: IconName; title: string; body: string }

type Props = {
  id: string
  tone: 'paper' | 'night'
  eyebrow: string
  lines: ReactNode[]
  lede: string
  points: Point[]
  screen: ReactNode
  flip?: boolean
  jersey: string
}

function AudienceSection({ id, tone, eyebrow, lines, lede, points, screen, flip, jersey }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const jerseyX = useTransform(scrollYProgress, [0, 1], flip ? ['-8%', '8%'] : ['8%', '-8%'])

  return (
    <section id={id} ref={ref} className={`section aud aud--${tone} ${flip ? 'aud--flip' : ''}`}>
      <motion.span className="aud__jersey" style={{ x: jerseyX }} aria-hidden="true">
        {jersey}
      </motion.span>
      <div className="wrap aud__grid">
        <div className="aud__copy">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="display aud__title">
            <MaskLines lines={lines} />
          </h2>
          <Reveal>
            <p className="aud__lede">{lede}</p>
          </Reveal>
          <ul className="aud__points">
            {points.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={i * 0.07} y={24}>
                  <span className="aud__icon">
                    <Icon name={p.icon} size={20} />
                  </span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        <motion.div className="aud__stage" style={{ y: phoneY }}>
          <Phone>{screen}</Phone>
        </motion.div>
      </div>
    </section>
  )
}

export function Athletes() {
  return (
    <AudienceSection
      id="athletes"
      tone="paper"
      eyebrow="For athletes"
      jersey="23"
      lines={['Your career.', 'Your call.']}
      lede="Stop waiting to be noticed. Next Level puts your stats, film and story in one profile built to be found, and tells you the moment someone is looking."
      points={[
        { icon: 'shield', title: 'A verified profile', body: 'Sport, position, class year and location, with a verified check coaches can trust.' },
        { icon: 'chart', title: 'Profile strength', body: 'A guided flow shows exactly what to add next, so nothing holds your profile back.' },
        { icon: 'eye', title: 'Know who is watching', body: 'Views, favorites and messages, with week-over-week movement right on your dashboard.' },
        { icon: 'qr', title: 'One link, everywhere', body: 'Share your profile in a DM, a bio or an email to a coach, with one tap.' },
      ]}
      screen={<AthleteScreen />}
    />
  )
}

export function Recruiters() {
  return (
    <AudienceSection
      id="recruiters"
      tone="night"
      flip
      eyebrow="For recruiters & coaches"
      jersey="07"
      lines={['Find them', <span className="aud__accent">first.</span>]}
      lede="Your next signing is already out there. Next Level brings the right athletes to you, with the numbers and film to make the call faster."
      points={[
        { icon: 'grid', title: 'Recommended athletes', body: 'A daily board of prospects matched to what your program needs. Grid or list, your call.' },
        { icon: 'bookmark', title: 'Save your board', body: 'Save prospects in a tap and track them in one place across the season.' },
        { icon: 'chart', title: 'Stats with a history', body: 'MaxStats game logs show how an athlete performs week in, week out.' },
        { icon: 'chat', title: 'Message directly', body: 'Reach athletes in the app. No middlemen, no lost emails.' },
      ]}
      screen={<RecruiterScreen />}
    />
  )
}
