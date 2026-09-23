import { motion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { useRef } from 'react'
import './Statement.css'

const text = 'Talent is everywhere. Opportunity is not. We are here to close the gap between the two.'
const words = text.split(' ')

function Word({ word, i, progress }: { word: string; i: number; progress: MotionValue<number> }) {
  const start = i / words.length
  const opacity = useTransform(progress, [start, start + 1 / words.length], [0.12, 1])
  const highlight = word.startsWith('Opportunity') || word.startsWith('gap')
  return (
    <motion.span style={{ opacity }} className={highlight ? 'statement__hl' : undefined}>
      {word}{' '}
    </motion.span>
  )
}

/** Scroll-scrubbed manifesto: words light up as the reader moves through the section. */
export function Statement() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })

  return (
    <section className="section statement">
      <div className="wrap">
        <span className="eyebrow">Why Next Level</span>
        <div ref={ref}>
          <p className="display statement__text">
            {words.map((w, i) => (
              <Word key={i} word={w} i={i} progress={scrollYProgress} />
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
