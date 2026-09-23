import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { AppStoreButton } from './AppStoreButton'
import { Icon } from './Icon'
import { Phone, Avatar } from './mock/Phone'
import { AthleteScreen } from './mock/AthleteScreen'
import './Hero.css'

const ease = [0.2, 0.8, 0.2, 1] as const
const yardNumbers = ['10', '20', '30', '40', '50', '40', '30', '20', '10']

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [-6, 2])
  const floatY = useTransform(scrollYProgress, [0, 1], [0, -260])
  const fieldY = useTransform(scrollYProgress, [0, 1], [0, 120])

  return (
    <header className="hero" id="top" ref={ref}>
      <motion.div className="hero__field" style={{ y: fieldY }} aria-hidden="true">
        {yardNumbers.map((n, i) => (
          <span key={i}>{n}</span>
        ))}
      </motion.div>
      <div className="hero__lights" aria-hidden="true" />

      <div className="hero__inner wrap">
        <div className="hero__copy">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            Now on the App Store
          </motion.span>

          <h1 className="display hero__title">
            {['Get seen.', 'Get recruited.', <>Go <em>next level.</em></>].map((line, i) => (
              <span className="hero__line" key={i}>
                <motion.span
                  initial={{ y: '110%', skewY: 6 }}
                  animate={{ y: '0%', skewY: 0 }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="hero__lede"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
          >
            The recruiting platform built around the athlete. Build a verified profile, log every game with MaxStats,
            drop your highlights, and land on the radar of the coaches who can change your future.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease }}
          >
            <AppStoreButton />
            <a href="#recruiters" className="hero__ghost">
              I'm a recruiter <Icon name="arrow" size={18} />
            </a>
          </motion.div>
        </div>

        <div className="hero__stage">
          <motion.div
            className="hero__phone"
            style={{ y: phoneY, rotate: phoneRotate }}
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.3, ease }}
          >
            <Phone>
              <AthleteScreen />
            </Phone>
          </motion.div>

          <motion.div className="hero__float hero__float--toast" style={{ y: floatY }}>
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2, ease }}
              className="toast"
            >
              <Avatar initials="CR" size={34} hue={30} />
              <div>
                <strong>Coach Reyes viewed your profile</strong>
                <small>Ridgeview · just now</small>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__float hero__float--lower"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1.45, ease }}
          >
            <div className="lower-third">
              <span className="lower-third__num">11</span>
              <span className="lower-third__name">
                Jordan Mitchell
                <small>WR · Class of 2027 · Atlanta, GA</small>
              </span>
            </div>
          </motion.div>
        </div>
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
