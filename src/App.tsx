import { MotionConfig } from 'motion/react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Ticker } from './components/Ticker'
import { Playbook } from './components/Playbook'
import { Athletes, Recruiters } from './components/Audience'
import { Statement } from './components/Statement'
import { MaxStats } from './components/MaxStats'
import { Faq } from './components/Faq'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Playbook />
        <Athletes />
        <Recruiters />
        <Statement />
        <MaxStats />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </MotionConfig>
  )
}
