import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { AppStoreButton, APP_STORE_URL } from './AppStoreButton'
import { lockScroll, scrollToHash } from '../lib/smoothScroll'
import './Nav.css'

const links = [
  ['Athletes', '#athletes'],
  ['Recruiters', '#recruiters'],
  ['MaxStats', '#maxstats'],
  ['How it works', '#how'],
  ['FAQ', '#faq'],
]

const ease = [0.76, 0, 0.24, 1] as const

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 600 && y > prev && !open)
  })

  useEffect(() => {
    lockScroll(open)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // let the menu start closing before the page moves
    setTimeout(() => scrollToHash(href), open ? 350 : 0)
  }

  return (
    <>
      <nav className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`}>
        <div className="nav__inner wrap">
          <a href="#top" onClick={go('#top')} aria-label="Next Level home">
            <Logo />
          </a>
          <ul className="nav__links">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href} onClick={go(href)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav__right">
            <a className="nav__cta" href={APP_STORE_URL} target="_blank" rel="noreferrer">
              Get the app
            </a>
            <button
              className="nav__burger"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <i />
              <i />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="menu__field" aria-hidden="true" />
            <ul className="menu__links wrap">
              {links.map(([label, href], i) => (
                <li key={href}>
                  <motion.a
                    href={href}
                    onClick={go(href)}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.6, delay: 0.12 + i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <small>{String(i + 1).padStart(2, '0')}</small>
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="menu__foot wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <AppStoreButton />
              <span>Built for athletes, coaches & scouts.</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
