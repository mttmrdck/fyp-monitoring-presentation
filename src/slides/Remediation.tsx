import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import { Slide, Tag, Win, type SlideProps } from '../components/Slide'
import { aiContract, fixFindings, fixFlow, fixMeasures, fixModes, ownerLabel, type FixMode } from '../content/content'

/* ───────── 7 · AI-assisted remediation ───────── */

type Decision = 'accepted' | 'rejected' | null

function chosen(mode: FixMode, picked: string[]) {
  return fixFindings.filter((f) => {
    if (mode === 'all') return true
    if (mode === 'severity') return f.severity === 'High'
    if (mode === 'paths') return f.breaksPath
    return picked.includes(f.id)
  })
}

export function S7Remediation({ mode, step, setStep }: SlideProps) {
  const pdf = mode === 'pdf'
  const [fixMode, setFixMode] = useState<FixMode>('severity')
  const [picked, setPicked] = useState<string[]>(['iam'])
  const [decision, setDecision] = useState<Decision>(null)
  const phase = pdf ? 3 : Math.min(step, 3)
  const lit = (p: number) => pdf || phase === p
  const sel = chosen(fixMode, picked)
  const outcome: Decision | 'pending' = pdf ? 'accepted' : (decision ?? (phase >= 3 ? 'accepted' : 'pending'))

  const pickMode = (m: FixMode) => {
    setFixMode(m)
    setDecision(null)
    if (step !== 1) setStep(1)
  }
  const toggle = (id: string) => {
    setFixMode('selected')
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
    setDecision(null)
    if (step !== 1) setStep(1)
  }
  const decide = (d: Exclude<Decision, null>) => {
    setDecision(d)
    setStep(3)
  }
  const open = sel.length ? fixFindings.filter((f) => !sel.includes(f)) : fixFindings

  return (
    <Slide n={7} criterion="Proposed concept · extends O3 (remediation guidance)" className="rx">
      <div className="rx-head">
        <h2 className="h2">
          AI-assisted <em>remediation</em>
        </h2>
        <p className="rx-rule">
          <span>Rules detect</span>
          <span className="rx-ai">AI suggests</span>
          <span>You approve</span>
          <span>Rules re-check</span>
        </p>
      </div>

      {/* The seven-step workflow, with who does each step */}
      <div className="rx-flow" aria-label="Workflow">
        <p className="rx-band rx-band--a">Existing analyzer · slides 2–6</p>
        <p className="rx-band rx-band--b">Extension · AI-assisted fix</p>
        <p className="rx-band rx-band--c">Outside the tool</p>
        <ol className="rx-steps">
          {fixFlow.map((s, i) => (
            <li key={s.title} className={`rx-step rx-step--${s.who} ${lit(s.phase) ? 'is-lit' : ''} ${i === 6 ? 'is-outside' : ''}`}>
              <button type="button" onClick={() => setStep(s.phase)} tabIndex={pdf ? -1 : 0} aria-pressed={lit(s.phase)}>
                <span className="rx-n">
                  {i + 1}
                  <span className="rx-who">{ownerLabel[s.who]}</span>
                </span>
                <span className="rx-t">{s.title}</span>
                <span className="rx-d">{s.d}</span>
              </button>
              {i === 4 ? (
                <span className="rx-gate" aria-label="Reject stops here">
                  <X aria-hidden="true" /> reject → main.tf unchanged
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="rx-grid">
        {/* 4 · choose findings */}
        <section className={`rx-col ${lit(1) ? 'is-lit' : ''}`} aria-label="Step 4: choose what to fix">
          <p className="s6-step">
            <span>4</span>Choose what AI should fix
          </p>
          <Win title="report.html · Fix with AI" kind="app" actions={<Tag tone="amber">Planned mock-up</Tag>}>
            <div className="rx-pick">
              <div className="rx-modes" role="group" aria-label="Fix mode">
                {fixModes.map((m) => (
                  <button key={m.id} type="button" aria-pressed={fixMode === m.id} onClick={() => pickMode(m.id)} tabIndex={pdf ? -1 : 0}>
                    {m.label}
                  </button>
                ))}
              </div>
              <table className="rx-table">
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="sr-only">Fix</span>
                    </th>
                    <th scope="col">Finding</th>
                    <th scope="col">Severity</th>
                    <th scope="col">Breaks path</th>
                  </tr>
                </thead>
                <tbody>
                  {fixFindings.map((f) => {
                    const on = sel.includes(f)
                    return (
                      <tr key={f.id} className={on ? 'is-on' : ''}>
                        <td>
                          <button type="button" className="rx-box" role="checkbox" aria-checked={on} aria-label={`Fix: ${f.title}`} onClick={() => toggle(f.id)} tabIndex={pdf ? -1 : 0}>
                            {on ? <Check aria-hidden="true" /> : null}
                          </button>
                        </td>
                        <td>
                          <span className="rx-f">{f.title}</span>
                          <span className="rx-r">{f.resource}</span>
                        </td>
                        <td>
                          <span className={`rx-sev rx-sev--${f.severity.toLowerCase()}`}>{f.severity}</span>
                        </td>
                        <td className="rx-path">{f.breaksPath ? 'Internet → S3' : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <dl className="rx-contract">
                {aiContract.map((c) => (
                  <div key={c.k} className={c.k === 'Never' ? 'is-never' : ''}>
                    <dt>{c.k}</dt>
                    <dd>{c.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Win>
        </section>

        {/* 5 · review the diff */}
        <section className={`rx-col ${lit(2) ? 'is-lit' : ''}`} aria-label="Step 5: review the suggested change">
          <p className="s6-step">
            <span>5</span>Review the suggested diff
          </p>
          <Win
            title={`main.tf · ${sel.length} suggested change${sel.length === 1 ? '' : 's'}`}
            kind="editor"
            className="rx-diffwin"
            actions={
              pdf ? null : (
                <span className="rx-actions">
                  <button type="button" className="rx-btn rx-btn--no" onClick={() => decide('rejected')} aria-pressed={decision === 'rejected'} disabled={!sel.length}>
                    Reject
                  </button>
                  <button type="button" className="rx-btn rx-btn--ok" onClick={() => decide('accepted')} aria-pressed={decision === 'accepted'} disabled={!sel.length}>
                    Accept
                  </button>
                </span>
              )
            }
          >
            <div className="rx-diff">
              {sel.length ? (
                sel.map((f) => (
                  <div key={f.id} className="rx-hunk">
                    <p className="rx-at">
                      @@ {f.at} · {f.resource}
                    </p>
                    {f.minus.map((l) => (
                      <p key={l} className="rx-l rx-l--minus">
                        <span aria-hidden="true">-</span>
                        <code>{l}</code>
                      </p>
                    ))}
                    {f.plus.map((l) => (
                      <p key={l} className="rx-l rx-l--plus">
                        <span aria-hidden="true">+</span>
                        <code>{l}</code>
                      </p>
                    ))}
                    <p className="rx-why">
                      <b>Why</b> {f.why}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rx-empty">Tick at least one finding.</p>
              )}
            </div>
          </Win>
        </section>

        {/* 6 · validate and re-scan */}
        <section className={`rx-col ${lit(3) ? 'is-lit' : ''}`} aria-label="Step 6: validate and re-scan">
          <p className="s6-step">
            <span>6</span>Validate &amp; re-scan
          </p>
          <Win title="$ after accept · same rule engine" kind="terminal" className="rx-termwin">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={outcome + sel.map((f) => f.id).join()} className="term rx-term" initial={pdf ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {outcome === 'accepted' && sel.length ? (
                  <>
                    <p>
                      <span className="term-k">$</span> terraform fmt -check
                    </p>
                    <p className="rx-ok">✓ formatted</p>
                    <p>
                      <span className="term-k">$</span> terraform validate
                    </p>
                    <p className="rx-ok">✓ Success! The configuration is valid.</p>
                    <p>
                      <span className="term-k">$</span> analyzer scan plan.json
                    </p>
                    {sel.map((f) => (
                      <p key={f.id} className="rx-ok">
                        ✓ resolved&nbsp; {f.title}
                      </p>
                    ))}
                    {open.map((f) => (
                      <p key={f.id} className="rx-open">
                        • still open&nbsp; {f.title} <span className="term-k">(not selected)</span>
                      </p>
                    ))}
                    {sel.some((f) => f.breaksPath) ? <p className="rx-ok">✓ path Internet → S3 broken</p> : <p className="rx-open">• path Internet → S3 still present</p>}
                    <p className="rx-ok">✓ 0 new findings</p>
                  </>
                ) : outcome === 'rejected' ? (
                  <p className="rx-open">Rejected · main.tf unchanged · nothing to validate.</p>
                ) : (
                  <p className="term-k">Waiting for accept or reject…</p>
                )}
              </motion.div>
            </AnimatePresence>
          </Win>
          <div className={`rx-deploy ${lit(3) ? 'is-lit' : ''}`}>
            <span className="rx-n">7</span>
            <p>
              <b>Deploy?</b> Your call. The tool never runs <code>terraform apply</code>.
            </p>
          </div>
        </section>
      </div>

      <p className="rx-foot">
        <span>
          <b>Measured</b> {fixMeasures.join(' · ')}
        </span>
        <span>
          <b>Literature</b> Keerthana (2026): LLM review suggests Terraform fixes; here every suggestion is re-checked by rules.
        </span>
      </p>
    </Slide>
  )
}
