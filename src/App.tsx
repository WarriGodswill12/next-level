import { MotionConfig } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Ticker } from './components/Ticker'
import { Statement } from './components/Statement'
import { OldWay } from './components/OldWay'
import { Playbook } from './components/Playbook'
import { Athletes, Recruiters } from './components/Audience'
import { ProfileCard } from './components/ProfileCard'
import { MaxStats } from './components/MaxStats'
import { Faq } from './components/Faq'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'
import { Intro, ScrollProgress } from './components/Chrome'
import { scrollToHash, startSmoothScroll } from './lib/smoothScroll'

export default function App() {
  const [ready, setReady] = useState(false)
  // reveal the hero only once the display face is in, so headlines never flash in a fallback
  const onIntroDone = useCallback(() => {
    document.fonts.ready.then(() => setReady(true))
  }, [])

  useEffect(() => startSmoothScroll(), [])

  // Route every in-page anchor through the smooth scroller.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey) return
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      const hash = a?.getAttribute('href')
      if (!hash || hash === '#') return
      e.preventDefault()
      scrollToHash(hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Intro onDone={onIntroDone} />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Ticker />
        <Statement />
        <OldWay />
        <Playbook />
        <Athletes />
        <ProfileCard />
        <Recruiters />
        <MaxStats />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </MotionConfig>
  )
}
