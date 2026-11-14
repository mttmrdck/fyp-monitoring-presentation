import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BrowserFrame, Slide, type SlideProps } from '../components/Slide'
import { ExtLink } from '../components/ui'
import { capturedOn, sources, type Source } from '../content/sources'
import { papers } from '../data/references'

const DIRECTION_SHORT = 'Terraform detection + relationships + evidence + prioritisation, with AI-suggested fixes re-checked by the rules. Measured against Checkov.'

const DIRECTION =
  'A focused combination, not a new technique: detection + relationships + evidence + prioritisation, plus AI-suggested fixes that the rules re-check. Measured against Checkov.'

function NotCaptured({ s }: { s: Source }) {
  return (
    <div className="nocap">
      <p className="nocap-t">Not captured</p>
      <p>The official AWS documentation page does not render in an automated browser, so no screenshot is shown rather than a recreated one.</p>
      <ExtLink href={s.url}>Open the AWS Security Hub documentation</ExtLink>
    </div>
  )
}

function Notes({ s }: { s: Source }) {
  const paper = papers.find((p) => p.url === s.url)
  return (
    <dl className="notes">
      <div>
        <dt>What it is</dt>
        <dd>{s.what}</dd>
      </div>
      <div>
        <dt>Relevant here</dt>
        <dd>{s.relevant}</dd>
      </div>
      <div>
        <dt>{s.kind === 'paper' ? 'Limit' : 'How this project differs'}</dt>
        <dd>{s.differs}</dd>
      </div>
      {paper ? <p className="notes-cite">{`${paper.authors} (${paper.year}). ${paper.venue}.`}</p> : null}
    </dl>
  )
}

export function S5Literature({ mode, step, setStep }: SlideProps) {
  const [view, setView] = useState<'site' | 'repo'>('site')
  if (mode === 'pdf') return <S5Print />
  const s = sources[Math.min(step, sources.length - 1)]
  const showRepo = view === 'repo' && s.repo
  return (
    <Slide n={5} criterion="Literature review" className="s5">
      <h2 className="h2">
        What already exists, and where this project fits.
      </h2>
      <div className="s5-grid">
        <nav className="s5-rail" aria-label="Sources">
          <p className="rail-h">Research papers</p>
          {sources
            .filter((x) => x.kind === 'paper')
            .map((x) => (
              <button key={x.id} type="button" className={`rail-i ${x.id === s.id ? 'is-on' : ''}`} onClick={() => setStep(sources.indexOf(x))} aria-current={x.id === s.id}>
                <span className="rail-n">{x.name}</span>
                <span className="rail-m">{x.meta}</span>
              </button>
            ))}
          <p className="rail-h">Existing tools</p>
          {sources
            .filter((x) => x.kind === 'tool')
            .map((x) => (
              <button key={x.id} type="button" className={`rail-i ${x.id === s.id ? 'is-on' : ''}`} onClick={() => setStep(sources.indexOf(x))} aria-current={x.id === s.id}>
                <span className="rail-n">{x.name}</span>
                <span className="rail-m">{x.meta}</span>
              </button>
            ))}
        </nav>
        <div className="s5-view">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={s.id + (showRepo ? 'r' : '')} className="s5-view-in" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
              <BrowserFrame
                className={`s5-bw ${s.kind === 'paper' ? 's5-bw--paper' : ''}`}
                url={showRepo ? s.repo!.url : s.url}
                displayUrl={showRepo ? s.repo!.url.replace('https://', '') : s.displayUrl}
                image={showRepo ? s.repo!.image : s.image}
                alt={showRepo ? `${s.name} GitHub repository` : s.alt}
                caption={s.image ? s.captureNote ?? `Real page · captured ${capturedOn}${s.kind === 'paper' && s.id !== 'almarri' ? ' · first page of the article (publisher PDF)' : ''}` : undefined}
              >
                {!s.image ? <NotCaptured s={s} /> : null}
              </BrowserFrame>
              <div className="s5-side">
                <p className="s5-name">{s.name}</p>
                {s.kind === 'paper' ? <p className="s5-title">{s.meta}</p> : null}
                {s.repo ? (
                  <div className="seg seg--sm" role="group" aria-label="Show">
                    <button type="button" aria-pressed={view === 'site'} onClick={() => setView('site')}>
                      Website
                    </button>
                    <button type="button" aria-pressed={view === 'repo'} onClick={() => setView('repo')}>
                      GitHub
                    </button>
                  </div>
                ) : null}
                <Notes s={s} />
                <ExtLink href={s.url}>{s.kind === 'paper' ? 'Open the paper (DOI)' : 'Open the official source'}</ExtLink>
                {s.docs ? <ExtLink href={s.docs.url}>{s.docs.label}</ExtLink> : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <p className="direction">
        <strong>Research direction</strong>
        {DIRECTION}
      </p>
    </Slide>
  )
}

/** PDF: every source visible at once; the real tool pages lead. */
function S5Print() {
  const ps = sources.filter((x) => x.kind === 'paper')
  const ts = sources.filter((x) => x.kind === 'tool')
  return (
    <Slide n={5} criterion="Literature review" className="s5 s5--print">
      <h2 className="h2">What already exists, and where this project fits.</h2>
      <div className="lp-tools">
        {ts.map((s) => (
          <article key={s.id} className="lp-tool">
            <BrowserFrame className="lp-bw" url={s.url} displayUrl={s.displayUrl} image={s.image} alt={s.alt}>
              {!s.image ? <NotCaptured s={s} /> : null}
            </BrowserFrame>
            <p className="lp-name">{s.name}</p>
            <p className="lp-l">{s.what}</p>
            <p className="lp-l">
              <b>Differs:</b> {s.differs}
            </p>
          </article>
        ))}
      </div>
      <div className="lp-papers">
        {ps.map((s) => {
          const paper = papers.find((p) => p.url === s.url)!
          return (
            <article key={s.id} className="lp-paper">
              <img src={s.image} alt={s.alt} className="lp-thumb" />
              <div>
                <p className="lp-cite">
                  {paper.authors} ({paper.year}). <ExtLink href={paper.url}>{paper.title}</ExtLink>.
                </p>
                <p className="lp-l">{s.relevant}</p>
              </div>
            </article>
          )
        })}
      </div>
      <p className="direction">
        <strong>Direction</strong>
        {DIRECTION_SHORT}
      </p>
    </Slide>
  )
}
