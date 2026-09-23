import './Logo.css'

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#0B5FFF" />
      <path d="M9 20.5 16 13.5l7 7" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="square" />
      <path d="M9 13 16 6l7 7" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="3.2" strokeLinecap="square" />
      <rect x="9" y="24" width="14" height="2.6" fill="#fff" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo__word">
        Next<span>Level</span>
      </span>
    </span>
  )
}
