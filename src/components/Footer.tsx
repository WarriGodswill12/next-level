import { Logo } from './Logo'
import './Footer.css'

const columns = [
  { title: 'Product', links: [['For athletes', '#athletes'], ['For recruiters', '#recruiters'], ['MaxStats', '#maxstats'], ['How it works', '#how']] },
  { title: 'Company', links: [['About', '#'], ['Careers', '#'], ['Contact', '#']] },
  { title: 'Legal', links: [['Privacy', '#'], ['Terms', '#']] },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p>The recruiting platform built around the athlete.</p>
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
        <div className="footer__word display" aria-hidden="true">
          Next Level
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Next Level</span>
          <span>Apple and App Store are trademarks of Apple Inc.</span>
        </div>
      </div>
    </footer>
  )
}
