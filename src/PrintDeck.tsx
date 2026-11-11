import { useEffect } from 'react'
import { slides } from './slides'

/**
 * Static print view (?pdf): every sheet at 1920×1080, every reveal in its final state.
 * Used by scripts/export-pdf.mjs; not linked from the deck.
 */
export default function PrintDeck() {
  useEffect(() => {
    document.documentElement.dataset.print = 'true'
    document.title = 'FYP Monitoring Presentation — Cloud Risk Analyzer'
    void document.fonts.ready.then(() => {
      ;(window as unknown as { __deckReady: boolean }).__deckReady = true
    })
  }, [])
  return (
    <main className="print-deck">
      {slides.map((s) => {
        const Comp = s.Component
        return (
          <section key={s.id} className={`print-page print-page--${s.id}`} aria-label={s.title}>
            <div className="canvas">
              <Comp mode="pdf" active step={99} setStep={() => undefined} />
            </div>
          </section>
        )
      })}
    </main>
  )
}
