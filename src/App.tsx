import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, LayoutGrid, Maximize2, Minimize2, X } from 'lucide-react'
import { slides } from './slides'
import { project } from './data/site'
import PrintDeck from './PrintDeck'
import { References } from './slides/Closing'

const TOTAL = slides.length
const PDF_FILE = 'FYP-Monitoring-Presentation.pdf'

function readHash(): number {
  const m = window.location.hash.match(/^#\/(\d+)/)
  if (!m) return 0
  const n = Number(m[1]) - 1
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), TOTAL - 1) : 0
}

function isTypingTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false
  return t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)
}

const FLOW_QUERY = '(max-width: 899px), (orientation: portrait) and (max-width: 1199px)'

function useFlow() {
  const [flow, setFlow] = useState(() => window.matchMedia(FLOW_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(FLOW_QUERY)
    const on = () => setFlow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return flow
}

const BAR = 60

function useScale(flow: boolean) {
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    if (flow) return
    const fit = () => setScale(Math.min(window.innerWidth / 1920, (window.innerHeight - BAR) / 1080))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [flow])
  return scale
}

export default function App() {
  if (new URLSearchParams(window.location.search).has('pdf')) return <PrintDeck />
  return <Deck />
}

function Deck() {
  const [index, setIndex] = useState(readHash)
  const [steps, setSteps] = useState<number[]>(() => slides.map(() => 0))
  const [overview, setOverview] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [dir, setDir] = useState<1 | -1>(1)
  const flow = useFlow()
  const scale = useScale(flow)
  const overviewRef = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const flowRef = useRef<HTMLDivElement>(null)

  const go = useCallback((n: number) => {
    setIndex((cur) => {
      const next = Math.min(Math.max(n, 0), TOTAL - 1)
      if (next !== cur) setDir(next > cur ? 1 : -1)
      return next
    })
  }, [])

  const setStepFor = useCallback((slide: number, n: number) => {
    const max = slides[slide].steps ?? 0
    setSteps((s) => s.map((v, i) => (i === slide ? Math.min(Math.max(n, 0), max) : v)))
  }, [])

  const next = useCallback(() => {
    const max = slides[index].steps ?? 0
    if (steps[index] < max) setStepFor(index, steps[index] + 1)
    else go(index + 1)
  }, [index, steps, go, setStepFor])

  const prev = useCallback(() => {
    if ((slides[index].steps ?? 0) > 0 && steps[index] > 0) setStepFor(index, steps[index] - 1)
    else go(index - 1)
  }, [index, steps, go, setStepFor])

  useEffect(() => {
    const target = `#/${index + 1}`
    if (window.location.hash !== target) history.replaceState(null, '', target)
    document.title = `${String(index + 1).padStart(2, '0')} · ${slides[index].title} — ${project.short}`
    flowRef.current?.scrollTo({ top: 0 })
  }, [index])

  useEffect(() => {
    const onHash = () => go(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [go])

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => undefined)
  }, [])

  const openOverview = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null
    setOverview(true)
  }, [])
  const closeOverview = useCallback(() => {
    setOverview(false)
    requestAnimationFrame(() => lastFocus.current?.focus?.())
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      if (isTypingTarget(e.target)) return
      if (overview) {
        if (e.key === 'Escape') {
          e.preventDefault()
          closeOverview()
        }
        return
      }
      const onControl = e.target instanceof HTMLElement && /^(BUTTON|A|SUMMARY)$/.test(e.target.tagName)
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault()
          next()
          break
        case ' ':
          if (onControl) return
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          prev()
          break
        case 'Home':
          e.preventDefault()
          go(0)
          break
        case 'End':
          e.preventDefault()
          go(TOTAL - 1)
          break
        case 'o':
        case 'O':
          e.preventDefault()
          openOverview()
          break
        case 'f':
        case 'F':
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overview, next, prev, go, openOverview, closeOverview, toggleFullscreen])

  useEffect(() => {
    let x0 = 0
    let y0 = 0
    let tracking = false
    const onStart = (e: TouchEvent) => {
      const t = e.target as HTMLElement
      tracking = !overview && !t.closest('.hscroll, input, textarea, select')
      x0 = e.touches[0].clientX
      y0 = e.touches[0].clientY
    }
    const onEnd = (e: TouchEvent) => {
      if (!tracking) return
      const dx = e.changedTouches[0].clientX - x0
      const dy = e.changedTouches[0].clientY - y0
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) {
        if (dx < 0) go(index + 1)
        else go(index - 1)
      }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [index, overview, go])

  useEffect(() => {
    if (!overview) return
    const root = overviewRef.current
    root?.querySelector<HTMLElement>('[aria-current="true"]')?.focus()
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !root) return
      const items = root.querySelectorAll<HTMLElement>('button, a')
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', trap)
    return () => window.removeEventListener('keydown', trap)
  }, [overview])

  const current = slides[index]
  const maxStep = current.steps ?? 0

  return (
    <div className={`deck ${flow ? 'deck--flow' : 'deck--canvas'}`} data-dir={dir}>
      <a className="skip" href="#slide-main">
        Skip to slide content
      </a>

      <main id="slide-main" className="stage" aria-roledescription="presentation" style={{ bottom: flow ? undefined : BAR }} ref={flowRef}>
        {slides.map((s, i) => {
          if (flow && i !== index) return null
          const Comp = s.Component
          const state = i === index ? 'active' : i < index ? 'past' : 'future'
          return (
            <section
              key={s.id}
              className={`slide slide--${s.id}`}
              data-state={state}
              aria-hidden={i !== index}
              inert={i !== index}
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${TOTAL}: ${s.title}`}
            >
              <div className="canvas" style={flow ? undefined : { transform: `translate(-50%, -50%) scale(${scale})` }}>
                <Comp mode="web" active={i === index} step={steps[i]} setStep={(n) => setStepFor(i, n)} />
              </div>
            </section>
          )
        })}
      </main>

      <footer className="bar">
        <div className="progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${(index + 1) / TOTAL})` }} />
        </div>
        <p className="bar-where">
          <span className="bar-n">
            {String(index + 1).padStart(2, '0')}
            <span>/{TOTAL}</span>
          </span>
          <span className="bar-title">{current.title}</span>
        </p>
        {maxStep ? (
          <p className="bar-step" aria-live="polite">
            Step {steps[index] + 1} of {maxStep + 1}
            {steps[index] < maxStep ? <span className="bar-step-k"> · Next reveals more</span> : null}
          </p>
        ) : null}
        <div className="bar-actions">
          <a className="bar-btn bar-btn--text" href={`/${PDF_FILE}`} download={PDF_FILE}>
            <Download aria-hidden="true" />
            <span>PDF</span>
          </a>
          <button className="bar-btn bar-btn--text" onClick={openOverview} aria-label="Slides and sources (O)" title="Slides and sources (O)">
            <LayoutGrid aria-hidden="true" />
            <span>Sources</span>
          </button>
          <button className="bar-btn bar-hide-flow" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'} title="Fullscreen (F)">
            {fullscreen ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
          </button>
          <button className="bar-btn" onClick={prev} disabled={index === 0 && steps[0] === 0} aria-label="Previous (Left arrow)">
            <ChevronLeft aria-hidden="true" />
          </button>
          <button className="bar-btn bar-btn--next" onClick={next} disabled={index === TOTAL - 1} aria-label="Next (Right arrow or Space)">
            <span>{steps[index] < maxStep ? 'Reveal next' : 'Next'}</span>
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </footer>

      {overview ? (
        <div className="overview" role="dialog" aria-modal="true" aria-label="Slides and sources" ref={overviewRef} onClick={(e) => e.target === e.currentTarget && closeOverview()}>
          <div className="overview-inner">
            <div className="overview-head">
              <h2>8 slides · sources</h2>
              <p className="overview-keys">
                <kbd>←</kbd> <kbd>→</kbd> navigate · <kbd>Space</kbd> next · <kbd>F</kbd> fullscreen · <kbd>O</kbd> this panel
              </p>
              <a className="bar-btn bar-btn--text" href={`/${PDF_FILE}`} download={PDF_FILE}>
                <Download aria-hidden="true" />
                <span>Download PDF</span>
              </a>
              <button className="bar-btn" onClick={closeOverview} aria-label="Close (Esc)">
                <X aria-hidden="true" />
              </button>
            </div>
            <ol className="overview-grid">
              {slides.map((s, i) => (
                <li key={s.id}>
                  <button
                    className="ov-tile"
                    aria-current={i === index ? 'true' : undefined}
                    onClick={() => {
                      go(i)
                      setOverview(false)
                    }}
                  >
                    <span className="ov-n">{String(i + 1).padStart(2, '0')} · {s.criterion}</span>
                    <span className="ov-title">{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="ov-refs">
              <References compact />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
