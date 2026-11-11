import { AnimatePresence, motion } from 'motion/react'
import { Database, Globe, KeyRound, Server, ShieldAlert } from 'lucide-react'
import { Slide, Tag, Win, type SlideProps } from '../components/Slide'
import { checkovRun, pathEdges, pathNodes, plannedReport } from '../content/content'

const icons = { net: Globe, sg: ShieldAlert, ec2: Server, iam: KeyRound, s3: Database }

export function S6Concept({ mode, step, setStep }: SlideProps) {
  const pdf = mode === 'pdf'
  const full = pdf || step >= pathNodes.length
  const sel = full ? -1 : step
  const selId = sel >= 0 ? pathNodes[sel].id : null
  return (
    <Slide n={6} criterion="Proposed concept · supports Introduction and Literature review" className="s6">
      <h2 className="h2">
        From separate findings to one explained path.
      </h2>
      <div className="s6-grid">
        <section className="s6-col" aria-label="Step 1: real Checkov output">
          <p className="s6-step">
            <span>1</span>Today: real scanner output
          </p>
          <Win
            title={`$ ${checkovRun.command}`}
            kind="terminal"
            actions={
              <>
                <a className="win-link" href="/sources/checkov/main.tf" target="_blank" rel="noopener noreferrer">
                  main.tf
                </a>
                <a className="win-link" href="/sources/checkov/checkov-output.txt" target="_blank" rel="noopener noreferrer">
                  full output
                </a>
              </>
            }
          >
            <div className="term">
              <p className="term-sum">{checkovRun.summary}</p>
              {checkovRun.lines.map((l) => (
                <div key={l.check} className={`term-f ${selId === l.node || full ? 'is-hit' : ''}`}>
                  <p>
                    <span className="term-k">Check:</span> {l.check}: "{l.name}"
                  </p>
                  <p className="term-fail">
                    FAILED for resource: <span>{l.resource}</span>
                  </p>
                </div>
              ))}
              <p className="term-more">… and {checkovRun.others} other failed checks, listed one by one</p>
            </div>
          </Win>
          <p className="s6-note">
            Real output from {checkovRun.version} on the main.tf from slide 2, {checkovRun.date}. The findings are right, but each is reported on its own.
          </p>
        </section>

        <section className="s6-col s6-path" aria-label="Step 2: the relationships behind the findings">
          <p className="s6-step">
            <span>2</span>The analyzer connects them
          </p>
          <ol className="chain">
            {pathNodes.map((n, i) => {
              const I = icons[n.id]
              const on = full || i === sel
              return (
                <li key={n.id} className={`chain-i ${on ? 'is-on' : ''} ${full ? 'is-full' : ''}`}>
                  <button type="button" className={`chain-n ${n.id === 's3' ? 'is-target' : ''}`} onClick={() => setStep(i)} aria-pressed={on} tabIndex={pdf ? -1 : 0}>
                    <I aria-hidden="true" />
                    <span className="chain-t">{n.title}</span>
                    <span className="chain-k">{n.type}</span>
                  </button>
                  {i < pathEdges.length ? (
                    <div className={`chain-e ${full || i === sel ? 'is-on' : ''}`}>
                      <span className="chain-l">{pathEdges[i].label}</span>
                      <code className="chain-ev">{pathEdges[i].evidence}</code>
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ol>
          {!pdf ? (
            <button type="button" className="btn btn--red" onClick={() => setStep(pathNodes.length)} aria-pressed={full}>
              Highlight the full path
            </button>
          ) : null}
        </section>

        <section className="s6-col" aria-label="Step 3: what the analyzer would report">
          <p className="s6-step">
            <span>3</span>What it would report
          </p>
          <Win title="cloud-risk-analyzer · report.html" kind="app" actions={<Tag tone="amber">Planned mock-up</Tag>}>
            <AnimatePresence initial={false} mode="wait">
              {full ? (
                <motion.div key="r" className="rep" initial={pdf ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <p className="rep-rank">#1 · combined risk</p>
                  <p className="rep-t">{plannedReport.title}</p>
                  <p className="rep-path">Internet → Security Group → EC2 → IAM role → S3 bucket</p>
                  <dl>
                    <div>
                      <dt>Why</dt>
                      <dd>{plannedReport.why}</dd>
                    </div>
                    <div>
                      <dt>Evidence</dt>
                      <dd>4 links, each tied to a line of main.tf</dd>
                    </div>
                    <div>
                      <dt>Priority</dt>
                      <dd>{plannedReport.rank}</dd>
                    </div>
                    <div>
                      <dt>Fix</dt>
                      <dd>{plannedReport.fix}</dd>
                    </div>
                  </dl>
                </motion.div>
              ) : (
                <motion.p key="w" className="rep-wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Step through the path, then highlight it to see the report.
                </motion.p>
              )}
            </AnimatePresence>
          </Win>
          <p className="s6-note s6-note--red">{plannedReport.caveat}</p>
        </section>
      </div>
    </Slide>
  )
}
