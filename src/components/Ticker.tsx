import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { useRef } from 'react'
import './Ticker.css'

const sports = ['Football', 'Basketball', 'Soccer', 'Baseball', 'Track & Field', 'Volleyball', 'Lacrosse', 'Softball', 'Wrestling', 'Hockey']

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/** Marquee whose speed and direction follow the reader's scroll velocity. */
function Band({ baseVelocity, outline }: { baseVelocity: number; outline?: boolean }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(velocity, [-1000, 0, 1000], [-4, 0, 4], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const direction = useRef(1)

  const reduced = useReducedMotion()

  useAnimationFrame((_, delta) => {
    if (reduced) return
    const f = factor.get()
    if (f < 0) direction.current = -1
    else if (f > 0) direction.current = 1
    let move = direction.current * baseVelocity * (delta / 1000)
    // scrolling adds speed in whichever direction the reader is moving
    move += direction.current * move * f
    baseX.set(baseX.get() + move)
  })

  const items = [...sports, ...sports]
  return (
    <motion.div className="ticker__track" style={{ x }}>
      {items.map((s, i) => (
        <span key={i} className={outline ? 'outline' : undefined}>
          {s}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 15 12 8l7 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" />
          </svg>
        </span>
      ))}
    </motion.div>
  )
}

export function Ticker() {
  return (
    <div className="ticker" aria-label="Every sport: football, basketball, soccer, baseball, track and field, volleyball and more">
      <div className="ticker__band ticker__band--back" aria-hidden="true">
        <Band baseVelocity={2} outline />
      </div>
      <div className="ticker__band ticker__band--front" aria-hidden="true">
        <Band baseVelocity={-2.6} />
      </div>
    </div>
  )
}
