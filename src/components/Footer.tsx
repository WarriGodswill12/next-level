import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Logo } from './Logo'
import { AppStoreButton } from './AppStoreButton'
import { Icon } from './Icon'
import { scrollToHash } from '../lib/smoothScroll'
import './Footer.css'

const columns = [
  { title: 'Product', links: [['For athletes', '#athletes'], ['For recruiters', '#recruiters'], ['MaxStats', '#maxstats'], ['How it works', '#how']] },
  { title: 'Company', links: [['About', '#'], ['Careers', '#'], ['Contact', '#']] },
  { title: 'Legal', links: [['Privacy', '#'], ['Terms', '#']] },
]

// Swap in the real handles once the accounts exist.
const socials = [
  {
    label: 'Instagram',
    href: '#',
    path: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.2-1.6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
  },
  {
    label: 'TikTok',
    href: '#',
    path: 'M14 3h3a4.5 4.5 0 0 0 4 4v3a7.4 7.4 0 0 1-4-1.2V15a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3V3Z',
  },
  {
    label: 'X',
    href: '#',
    path: 'M4 4h4.6l3.9 5.3L17.2 4H20l-6.2 7.1L20.5 20h-4.6l-4.3-5.8L6.5 20H3.7l6.6-7.6L4 4Z',
  },
]

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const wordY = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])

  return (
    <footer className="footer" ref={ref}>
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p>The recruiting platform built around the athlete.</p>
            <AppStoreButton />
          </div>
          {columns.map((c) => (
            <div key={c.title} className="footer__col">
              <h4>{c.title}</h4>
              <ul>
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__mid">
          <ul className="footer__social">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} aria-label={s.label}>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d={s.path} fill="currentColor" fillRule="evenodd" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
          <button className="footer__top-btn" onClick={() => scrollToHash('#top')}>
            Back to top
            <span>
              <Icon name="arrow" size={16} style={{ transform: 'rotate(-90deg)' }} />
            </span>
          </button>
        </div>

        <div className="footer__word-wrap" aria-hidden="true">
          {/* SVG text with a fixed textLength always spans exactly the container width */}
          <motion.svg className="footer__word" viewBox="0 0 1000 170" style={{ y: wordY }}>
            <text x="2" y="163" textLength="996" lengthAdjust="spacingAndGlyphs">
              NEXT <tspan className="footer__word-accent">LEVEL</tspan>
            </text>
          </motion.svg>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Next Level. All rights reserved.</span>
          <span>Apple and App Store are trademarks of Apple Inc.</span>
        </div>
      </div>
    </footer>
  )
}
