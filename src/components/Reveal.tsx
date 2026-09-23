import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

export function Reveal({ children, delay = 0, y = 40, className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Headline that slides up line-by-line from behind a mask.
 * Visibility is observed on the wrapper: the masked lines themselves start
 * clipped, so an observer on them would never fire.
 */
export function MaskLines({ lines, className, delay = 0 }: { lines: ReactNode[]; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })

  return (
    <span ref={ref} className={className} style={{ display: 'block' }}>
      {lines.map((line, i) => (
        <span key={i} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.04em' }}>
          <motion.span
            style={{ display: 'block' }}
            initial={{ y: '105%' }}
            animate={inView ? { y: '0%' } : undefined}
            transition={{ duration: 1, delay: delay + i * 0.09, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
