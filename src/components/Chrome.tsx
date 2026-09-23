import { animate, AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { LogoMark } from './Logo'
import { lockScroll } from '../lib/smoothScroll'
import './Chrome.css'

/** Thin brand-blue bar tracking page progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />
}

const MIN_SHOW_MS = 1400
const MAX_WAIT_MS = 6000

/** Resolves once fonts and the window's assets are in, capped so a slow asset never traps the visitor. */
function pageReady() {
  const loaded = new Promise<void>((resolve) => {
    if (document.readyState === 'complete') resolve()
    else window.addEventListener('load', () => resolve(), { once: true })
  })
  const cap = new Promise<void>((resolve) => setTimeout(resolve, MAX_WAIT_MS))
  return Promise.race([Promise.all([loaded, document.fonts.ready]), cap])
}

/**
 * Preloader, shown on every page load: the logo builds, a 0→100 counter runs
 * while fonts and assets load, then a blue panel wipes up to reveal the page.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true)
  const [count, setCount] = useState(0)
  const progress = useMotionValue(0)
  const barScale = useTransform(progress, [0, 100], [0, 1])
  useMotionValueEvent(progress, 'change', (v) => setCount(Math.round(v)))

  useEffect(() => {
    // a preloader always reveals the page from the top
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    lockScroll(true)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // creep toward 90 while loading; the last stretch waits for the real signal
    const creep = animate(progress, 90, { duration: reduced ? 0.2 : 1.2, ease: [0.3, 0, 0.2, 1] })
    let cancelled = false

    const minTime = new Promise((r) => setTimeout(r, reduced ? 300 : MIN_SHOW_MS))
    Promise.all([pageReady(), minTime]).then(() => {
      if (cancelled) return
      creep.stop()
      animate(progress, 100, { duration: 0.35, ease: 'easeOut' }).then(() => {
        if (!cancelled) setShow(false)
      })
    })

    return () => {
      cancelled = true
      creep.stop()
    }
  }, [progress])

  return (
    <AnimatePresence
      onExitComplete={() => {
        lockScroll(false)
        onDone()
      }}
    >
      {show && (
        <motion.div
          className="intro"
          role="status"
          aria-label={`Loading Next Level, ${count}%`}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <LogoMark size={72} inverted />
          </motion.div>
          <div className="intro__word">
            {'Next Level'.split('').map((c, i) => (
              <motion.span
                key={i}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.035, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {c === ' ' ? ' ' : c}
              </motion.span>
            ))}
          </div>
          <div className="intro__meta" aria-hidden="true">
            <span>Loading the lineup</span>
            <span className="intro__count">{String(count).padStart(3, '0')}</span>
          </div>
          <motion.i className="intro__bar" style={{ scaleX: barScale }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
