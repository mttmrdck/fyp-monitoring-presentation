import { AnimatePresence, motion } from 'motion/react'
import { Database, Globe, KeyRound, Server, ShieldAlert } from 'lucide-react'
import { Slide, type SlideProps } from '../components/Slide'
import { evaluation, objectives, pipeline, problems, ruleCatalogue, type Part } from '../content/content'

/* ───────── 3 · Problem statement ───────── */

// Node positions in a 1000×440 stage: scattered (isolated findings) vs. aligned (connected path).
const nodes = [
  { id: 'net', icon: Globe, title: 'Internet', iso: { x: 40, y: 320 }, con: { x: 0, y: 170 } },
  { id: 'sg', icon: ShieldAlert, title: 'Security Group', finding: 'SSH open to 0.0.0.0/0', iso: { x: 100, y: 60 }, con: { x: 240, y: 170 } },
  { id: 'ec2', icon: Server, title: 'EC2 instance', iso: { x: 480, y: 310 }, con: { x: 480, y: 170 } },
  { id: 'iam', icon: KeyRound, title: 'IAM role', finding: 's3:* on every resource', iso: { x: 470, y: 50 }, con: { x: 720, y: 170 } },
  { id: 's3', icon: Database, title: 'S3 bucket', finding: 'No public access block', iso: { x: 900, y: 190 }, con: { x: 960, y: 170 } },
]
const links = ['allows SSH', 'attached to', 'runs with', 'can access']

export function S3Problem({ mode, step, setStep }: SlideProps) {
  const pdf = mode === 'pdf'
  const connected = pdf || step >= 1
  const open = (i: number) => pdf || step === i + 2
  const t = pdf ? { duration: 0 } : { type: 'spring' as const, stiffness: 120, damping: 20 }
  return (
    <Slide n={3} criterion="Problem statement" className="s3">
      <h2 className="h2">
        Three findings. <em>One</em> potential path.
      </h2>
      <div className="s3-grid">
        <div className="s3-stage-wrap">
          {!pdf ? (
            <div className="seg" role="group" aria-label="View">
              <button type="button" aria-pressed={!connected} onClick={() => setStep(0)}>
                Isolated findings
              </button>
              <button type="button" aria-pressed={connected} onClick={() => setStep(Math.max(1, step))}>
                Connected view
              </button>
            </div>
          ) : null}
          <div className={`s3-stage ${connected ? 'is-connected' : ''}`}>
            <svg className="s3-links" viewBox="0 0 1180 400" aria-hidden="true">
              {links.map((l, i) => {
                const a = nodes[i].con
                const b = nodes[i + 1].con
                return (
                  <g key={l}>
                    <motion.line
                      x1={a.x + 220}
                      y1={a.y + 22}
                      x2={b.x}
                      y2={b.y + 22}
                      initial={false}
                      animate={{ pathLength: connected ? 1 : 0, opacity: connected ? 1 : 0 }}
                      transition={pdf ? { duration: 0 } : { duration: 0.5, delay: connected ? 0.35 + i * 0.15 : 0 }}
                    />
                    <motion.text x={(a.x + 220 + b.x) / 2} y={a.y + 84} textAnchor="middle" initial={false} animate={{ opacity: connected ? 1 : 0 }} transition={{ duration: pdf ? 0 : 0.3, delay: connected && !pdf ? 0.6 + i * 0.15 : 0 }}>
                      {l}
                    </motion.text>
                  </g>
                )
              })}
            </svg>
            {nodes.map((n, i) => {
              const pos = connected ? n.con : n.iso
              return (
                <motion.div
                  key={n.id}
                  className={`s3-node ${n.finding ? 'has-finding' : 'is-context'} ${n.id === 's3' ? 'is-target' : ''}`}
                  initial={false}
                  animate={{ x: pos.x, y: pos.y, opacity: connected || n.finding ? 1 : 0.35 }}
                  transition={{ ...t, delay: pdf ? 0 : i * 0.04 }}
                >
                  <span className="s3-node-box">
                    <n.icon aria-hidden="true" />
                    {n.title}
                  </span>
                  {n.finding ? <span className="s3-finding">{n.finding}</span> : null}
                </motion.div>
              )
            })}
          </div>
          <p className="s3-caption">
            {connected
              ? 'Connected: each link must be proven from the configuration. Only then is it one combined potential risk.'
              : 'Isolated: a scanner reports three separate findings.'}
          </p>
        </div>
        <ol className="ps">
          {problems.map((p, i) => (
            <li key={p.id} className={`ps-item ${open(i) ? 'is-open' : ''}`}>
              <button type="button" className="ps-head" onClick={() => setStep(i + 2)} aria-expanded={open(i)} tabIndex={pdf ? -1 : 0}>
                <span className="ps-stage">{p.stage}</span>
                <span className="ps-short">
                  <span className="ps-id">{p.id}</span>
                  {p.short}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open(i) ? (
                  <motion.div className="ps-body" initial={pdf ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <p className="ps-title">{p.title}</p>
                    <p className="ps-text">{p.text}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          ))}
        </ol>
      </div>
    </Slide>
  )
}

/* ───────── 4 · Objectives ───────── */

export function S4Objectives({ mode, step, setStep }: SlideProps) {
  const pdf = mode === 'pdf'
  const sel = Math.min(step, 3)
  const lit = (part: Part) => pdf || objectives[sel].parts.includes(part)
  return (
    <Slide n={4} criterion="Objectives" className="s4">
      <h2 className="h2">
        Four objectives, one analyzer.
      </h2>
      <div className="pipe" aria-label="Proposed analyzer">
        {pipeline.map((p, i) => (
          <div key={p.id} className={`pipe-stage ${p.id === 'fix' ? 'pipe-stage--ext' : ''} ${lit(p.id) ? 'is-lit' : ''}`}>
            <p className="pipe-t">{p.title}</p>
            <p className="pipe-d">{p.detail}</p>
            {i < pipeline.length - 1 ? <span className="pipe-arrow" aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
      <section className={`rules ${lit('rules') ? 'is-lit' : ''}`} aria-label="The 10 planned rules">
        <p className="rules-h">
          <b>10 rules</b> each mapped to CIS / AWS guidance
          <span className="rules-key">
            <span className="rules-dot" aria-hidden="true" /> found in slide 2's main.tf
          </span>
        </p>
        {ruleCatalogue.map((g) => (
          <div key={g.group} className="rules-g">
            <p className="rules-gh">{g.group}</p>
            <ol>
              {g.rules.map((r) => (
                <li key={r.n} className={r.demo ? 'is-demo' : ''}>
                  <span className="rules-n">{String(r.n).padStart(2, '0')}</span>
                  {r.t}
                  {r.demo ? <span className="rules-dot" aria-label="(in main.tf)" /> : null}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
      <ol className="objs">
        {objectives.slice(0, 3).map((o, i) => {
          const on = pdf || i === sel
          return (
            <li key={o.id} className={`obj obj--${o.id} ${on ? 'is-on' : ''}`}>
              <button type="button" className="obj-head" onClick={() => setStep(i)} aria-pressed={on} tabIndex={pdf ? -1 : 0}>
                <span className="obj-id">{o.id}</span>
                <span className="obj-short">{o.short}</span>
              </button>
              {pdf || on ? <p className="obj-text">{o.text}</p> : null}
              {o.answers ? <p className="obj-ans">Answers {o.answers}</p> : null}
            </li>
          )
        })}
      </ol>
        <div className={`pipe-eval ${lit('eval') ? 'is-lit' : ''}`}>
        <button type="button" className="obj-head obj-head--eval" onClick={() => setStep(3)} aria-pressed={pdf || sel === 3} tabIndex={pdf ? -1 : 0}>
          <span className="obj-id">O4</span>
          <span className="obj-short">{objectives[3].short}</span>
        </button>
        <div className="pipe-eval-body">
          {pdf || sel === 3 ? <p className="obj-text">{objectives[3].text}</p> : null}
          <ul>
            {evaluation.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      </div>
    </Slide>
  )
}
