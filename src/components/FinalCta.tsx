import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import { useRef } from 'react'
import { AppStoreButton, APP_STORE_URL } from './AppStoreButton'
import { LogoMark } from './Logo'
import { Magnetic } from './Magnetic'
import { MaskLines, Reveal } from './Reveal'
import './FinalCta.css'

export function FinalCta() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  // The panel starts inset from the screen edges as a rounded card and grows to
  // full bleed. Inset is in px/vw (not a scale factor) so it reads just as
  // strongly on a 390px phone as on a wide desktop.
  const inset = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const radius = useTransform(scrollYProgress, [0, 0.85], [36, 0])
  const clipPath = useMotionTemplate`inset(0px calc(${inset} * max(18px, 5vw)) round ${radius}px)`
  const qrRotate = useTransform(scrollYProgress, [0, 1], [-14, -4])

  return (
    <section className="cta" ref={ref}>
      <motion.div className="cta__panel" style={{ clipPath }}>
        <div className="cta__rings" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="wrap cta__inner">
          <div>
            <span className="eyebrow cta__eyebrow">Now on the App Store</span>
            <h2 className="display cta__title">
              <MaskLines lines={['Your next', 'level starts', 'now.']} />
            </h2>
            <Reveal delay={0.2}>
              <div className="cta__actions">
                <Magnetic>
                  <AppStoreButton variant="dark" size="lg" />
                </Magnetic>
                <p>Available on iPhone. Athletes and recruiters welcome.</p>
              </div>
            </Reveal>
          </div>

          <motion.div className="cta__qr" style={{ rotate: qrRotate }}>
            <div className="cta__qr-code">
              <QRCodeSVG value={APP_STORE_URL} size={176} bgColor="#ffffff" fgColor="#0B0B0C" level="H" />
              <span className="cta__qr-logo">
                <LogoMark size={34} />
              </span>
            </div>
            <strong>Scan to download</strong>
            <small>Point your iPhone camera here</small>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
