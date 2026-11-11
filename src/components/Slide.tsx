import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

export type Mode = 'web' | 'pdf'

export type SlideProps = {
  /** 'pdf' renders every reveal in its final state. */
  mode: Mode
  step: number
  setStep: (n: number) => void
  active: boolean
}

/** Full-bleed slide. The footer names the lecturer criterion the slide answers. */
export function Slide({ n, criterion, className = '', children }: { n: number; criterion: string; className?: string; children: ReactNode }) {
  return (
    <div className={`slide-body ${className}`}>
      <div className="slide-inner">{children}</div>
      <footer className="slide-foot" aria-hidden="true">
        <span className="slide-foot-n">
          {String(n).padStart(2, '0')}
          <span>/08</span>
        </span>
        <span className="slide-foot-c">{criterion}</span>
        <span className="slide-foot-p">Cloud Risk Analyzer · FYP monitoring</span>
      </footer>
    </div>
  )
}

/** A real browser window around a real screenshot, with its live URL and a link out. */
export function BrowserFrame({
  url,
  displayUrl,
  image,
  alt,
  caption,
  className = '',
  children,
}: {
  url: string
  displayUrl: string
  image?: string
  alt?: string
  caption?: ReactNode
  className?: string
  children?: ReactNode
}) {
  return (
    <figure className={`bw ${className}`}>
      <div className="bw-bar">
        <span className="bw-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <a className="bw-url" href={url} target="_blank" rel="noopener noreferrer">
          <span className="bw-lock" aria-hidden="true" />
          {displayUrl}
          <ArrowUpRight aria-hidden="true" />
          <span className="sr-only"> (opens the real page in a new tab)</span>
        </a>
      </div>
      <div className="bw-view">{image ? <img src={image} alt={alt ?? ''} loading="eager" decoding="async" /> : children}</div>
      {caption ? <figcaption className="bw-cap">{caption}</figcaption> : null}
    </figure>
  )
}

/** Software window chrome for an editor or a terminal. */
export function Win({ title, kind, className = '', children, actions }: { title: string; kind: 'editor' | 'terminal' | 'app'; className?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className={`win win--${kind} ${className}`} aria-label={title}>
      <div className="win-bar">
        <span className="bw-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="win-title">{title}</span>
        {actions ? <span className="win-actions">{actions}</span> : null}
      </div>
      <div className="win-body">{children}</div>
    </section>
  )
}

/** Honest status label. */
export function Tag({ tone, children }: { tone: 'red' | 'blue' | 'amber' | 'green' | 'muted'; children: ReactNode }) {
  return <span className={`tag tag--${tone}`}>{children}</span>
}
