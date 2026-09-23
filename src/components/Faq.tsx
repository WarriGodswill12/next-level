import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Icon } from './Icon'
import { MaskLines } from './Reveal'
import './Faq.css'

// Review these answers against the launch plan before going live.
const faqs = [
  {
    q: 'What is Next Level?',
    a: 'Next Level is a recruiting platform that connects athletes with recruiters and coaches. Athletes build a verified profile with their stats and highlights; recruiters discover, save and message the athletes who fit their program.',
  },
  {
    q: 'What is MaxStats?',
    a: 'MaxStats is the performance tracker built into the app. Set up your MaxStats profile, add each game as you play it, and your season stats and full history show up on your profile for recruiters to see.',
  },
  {
    q: 'How do recruiters find me?',
    a: 'Recruiters see recommended athletes on their dashboard, can save prospects to their board and open your full profile. When they view, favorite or message you, it shows up on your dashboard.',
  },
  {
    q: 'I am a coach or scout. Is Next Level for me?',
    a: 'Yes. Recruiter accounts get their own dashboard with recommended athletes, a saved prospects list, activity and direct messaging.',
  },
  {
    q: 'Is Next Level on Android?',
    a: 'Next Level is launching on iPhone first through the App Store. Android is on the roadmap.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="section faq" id="faq">
      <div className="wrap faq__grid">
        <div>
          <span className="eyebrow">FAQ</span>
          <h2 className="display faq__title">
            <MaskLines lines={['Questions,', 'answered.']} />
          </h2>
        </div>
        <ul className="faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <li key={f.q} className={isOpen ? 'is-open' : undefined}>
                <button aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                  <span className="faq__n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="faq__q">{f.q}</span>
                  <span className="faq__toggle">
                    <Icon name="plus" size={18} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
