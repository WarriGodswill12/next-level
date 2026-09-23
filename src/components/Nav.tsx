import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { APP_STORE_URL } from './AppStoreButton'
import './Nav.css'

const links = [
  ['Athletes', '#athletes'],
  ['Recruiters', '#recruiters'],
  ['MaxStats', '#maxstats'],
  ['FAQ', '#faq'],
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav__inner wrap">
        <a href="#top" aria-label="Next Level home">
          <Logo />
        </a>
        <ul className="nav__links">
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
        <a className="nav__cta" href={APP_STORE_URL} target="_blank" rel="noreferrer">
          Get the app
        </a>
      </div>
    </nav>
  )
}
