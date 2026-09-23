import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AppStoreButton } from './AppStoreButton'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import { Magnetic } from './Magnetic'
import { Phone, Avatar } from './mock/Phone'
import { AthleteScreen } from './mock/AthleteScreen'
import { RecruiterScreen } from './mock/RecruiterScreen'
import './Hero.css'

const ease = [0.2, 0.8, 0.2, 1] as const
const yardNumbers = ['10', '20', '30', '40', '50', '40', '30', '20', '10']

type Ping = { lead: ReactNode; title: string; meta: string }

const iconLead = (name: IconName) => (
  <span className="ping__icon">
    <Icon name={name} size={16} />
  </span>
)

// The activity an athlete actually sees on their dashboard: views, saves, messages, trend.
const pings: Ping[] = [
  { lead: <Avatar initials="CR" size={36} hue={30} />, title: 'Coach Reyes viewed your profile', meta: 'Ridgeview · just now' },
  { lead: iconLead('bookmark'), title: 'Saved to a recruiting board', meta: 'State Tech · 2m ago' },
  { lead: <Avatar initials="MA" size={36} hue={160} />, title: 'New message from Coach Allen', meta: '“Great film from Friday…”' },
  { lead: iconLead('chart'), title: 'Profile views up 18% this week', meta: 'Keep the uploads coming' },
]

function LiveFeed({ ready }: { ready: boolean }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (!ready) return
    const t = setInterval(() => setI((n) => (n + 1) % pings.length), 3200)
    return () => clearInterval(t)
  }, [ready])

  const p = pings[i]
  return (
    <div className="ping-slot" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        {ready && (
          <motion.div
            key={i}
            className="ping"
            initial={{ opacity: 0, y: 24, scale: 0.94, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -18, scale: 0.96, filter: 'blur(6px)' }}
            transition={{ duration: 0.6, ease }}
          >
            {p.lead}
            <div>
              <strong>{p.title}</strong>
              <small>{p.meta}</small>
            </div>
            <span className="ping__live" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const backY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const fieldY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // pointer-driven tilt for the device stack
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const tiltY = useSpring(useTransform(px, [-1, 1], [-8, 8]), { stiffness: 80, damping: 20 })
  const tiltX = useSpring(useTransform(py, [-1, 1], [6, -6]), { stiffness: 80, damping: 20 })
  const glowX = useTransform(px, [-1, 1], ['35%', '65%'])

  const show = (delay: number) => ({
    animate: ready ? { opacity: 1, y: 0, x: 0 } : undefined,
    transition: { duration: 0.9, delay, ease },
  })

  return (
    <header
      className="hero"
      id="top"
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        px.set((e.clientX / window.innerWidth) * 2 - 1)
        py.set((e.clientY / window.innerHeight) * 2 - 1)
      }}
    >
      <motion.div className="hero__field" style={{ y: fieldY }} aria-hidden="true">
        {yardNumbers.map((n, i) => (
          <span key={i}>{n}</span>
        ))}
      </motion.div>
      <motion.div className="hero__lights" style={{ ['--gx' as string]: glowX }} aria-hidden="true" />

      <div className="hero__inner wrap">
        <motion.div className="hero__copy" style={{ opacity: copyOpacity }}>
          <motion.span className="eyebrow hero__eyebrow" initial={{ opacity: 0, x: -20 }} {...show(0)}>
            <span className="hero__dot" /> Now live on the App Store
          </motion.span>

          <h1 className="display hero__title">
            {['Get seen.', 'Get recruited.', <>Go <em>next level.</em></>].map((line, i) => (
              <span className="hero__line" key={i}>
                <motion.span
                  initial={{ y: '110%', skewY: 6 }}
                  animate={ready ? { y: '0%', skewY: 0 } : undefined}
                  transition={{ duration: 1.1, delay: 0.1 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="hero__lede" initial={{ opacity: 0, y: 20 }} {...show(0.5)}>
            The recruiting platform built around the athlete. Build a verified profile, log every game with MaxStats,
            drop your highlights, and land on the radar of the coaches who can change your future.
          </motion.p>

          <motion.div className="hero__actions" initial={{ opacity: 0, y: 20 }} {...show(0.65)}>
            <Magnetic>
              <AppStoreButton />
            </Magnetic>
            <a href="#recruiters" className="hero__ghost">
              I'm a recruiter <Icon name="arrow" size={18} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div className="hero__stage" style={{ y: stageY }}>
          <motion.div className="hero__devices" style={{ rotateX: tiltX, rotateY: tiltY }}>
            <motion.div
              className="hero__phone hero__phone--back"
              style={{ y: backY }}
              initial={{ opacity: 0, x: 80 }}
              {...show(0.45)}
            >
              <Phone>
                <RecruiterScreen />
              </Phone>
            </motion.div>
            <motion.div className="hero__phone hero__phone--front" initial={{ opacity: 0, y: 140 }} {...show(0.25)}>
              <Phone>
                <AthleteScreen />
              </Phone>
            </motion.div>
          </motion.div>

          {/* outer div owns CSS positioning; inner motion.div owns the entrance transform */}
          <div className="hero__float hero__float--feed">
            <motion.div initial={{ opacity: 0, y: 20 }} {...show(1)}>
              <LiveFeed ready={ready} />
            </motion.div>
          </div>

          <div className="hero__float hero__float--lower">
            <motion.div initial={{ opacity: 0, x: -60 }} {...show(1.15)}>
              <div className="lower-third">
                <span className="lower-third__num">11</span>
                <span className="lower-third__name">
                  Jordan Mitchell
                  <small>WR · Class of 2027 · Atlanta, GA</small>
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="hero__foot wrap">
        <span>Athletes</span>
        <span>Coaches</span>
        <span>Scouts</span>
        <span className="hero__scroll">
          Scroll <i />
        </span>
      </div>
    </header>
  )
}
