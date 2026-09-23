import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

let lenis: Lenis | null = null

/** Weighted inertial scrolling on desktop; native scrolling on touch and for reduced-motion users. */
export function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) })
  // the preloader may have locked scrolling before Lenis existed
  if (document.documentElement.style.overflow === 'hidden') lenis.stop()
  let raf = 0
  const loop = (time: number) => {
    lenis?.raf(time)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  return () => {
    cancelAnimationFrame(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToHash(hash: string) {
  const target = hash === '#top' ? 0 : document.querySelector<HTMLElement>(hash)
  if (target === null) return
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.4 })
  } else {
    const top = typeof target === 'number' ? 0 : target.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop()
  else lenis?.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
