import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

/** External link: opens in a new tab, keeps the arrow glued to the last word. */
export function ExtLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={`ext ${className}`} href={href} target="_blank" rel="noopener noreferrer">
      <span>{children}</span>
      {' '}
      <ArrowUpRight aria-hidden="true" className="ext-icon" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

/** A reveal control: a clearly labelled button, web only. */
export function RevealButton({ onClick, children, pressed }: { onClick: () => void; children: ReactNode; pressed?: boolean }) {
  return (
    <button type="button" className="reveal-btn" onClick={onClick} aria-pressed={pressed}>
      {children}
    </button>
  )
}
