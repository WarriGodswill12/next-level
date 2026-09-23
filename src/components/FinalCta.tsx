import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { AppStoreButton } from './AppStoreButton'
import { MaskLines, Reveal } from './Reveal'
import './FinalCta.css'

export function FinalCta() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  const radius = useTransform(scrollYProgress, [0, 1], [48, 0])

  return (
    <section className="cta" ref={ref}>
      <motion.div className="cta__panel" style={{ scale, borderRadius: radius }}>
        <div className="cta__rings" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="wrap cta__inner">
          <span className="eyebrow cta__eyebrow">Now on the App Store</span>
          <h2 className="display cta__title">
            <MaskLines lines={['Your next', 'level starts', 'now.']} />
          </h2>
          <Reveal delay={0.2}>
            <div className="cta__actions">
              <AppStoreButton variant="dark" size="lg" />
              <p>Available on iPhone. Athletes and recruiters welcome.</p>
            </div>
          </Reveal>
        </div>
      </motion.div>
    </section>
  )
}
