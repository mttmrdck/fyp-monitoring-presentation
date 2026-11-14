import { AnimatePresence, motion } from 'motion/react'
import DecryptedText from '../components/vendor/DecryptedText'
import { Slide, Win, type SlideProps } from '../components/Slide'
import { ExtLink } from '../components/ui'
import { flags, fourQuestions, introStatements, terraform, type Flag } from '../content/content'
import { terraformSource } from '../content/sources'
import { presenter, project } from '../data/site'

/* ───────── 1 · Project title ───────── */

const G = {
  nodes: [
    { id: 'net', x: 60, y: 300, label: '0.0.0.0/0' },
    { id: 'sg', x: 250, y: 190, label: 'aws_security_group.web' },
    { id: 'ec2', x: 430, y: 330, label: 'aws_instance.app' },
    { id: 'iam', x: 620, y: 200, label: 'aws_iam_role.app' },
    { id: 's3', x: 820, y: 330, label: 'aws_s3_bucket.records' },
    { id: 'vpc', x: 200, y: 470, label: 'aws_vpc.main' },
    { id: 'sub', x: 380, y: 560, label: 'aws_subnet.public' },
    { id: 'lb', x: 120, y: 80, label: 'aws_lb.front' },
    { id: 'kms', x: 760, y: 520, label: 'aws_kms_key.data' },
    { id: 'log', x: 600, y: 470, label: 'aws_cloudwatch_log_group' },
    { id: 'rds', x: 860, y: 110, label: 'aws_db_instance.main' },
    { id: 'pol', x: 470, y: 70, label: 'aws_iam_policy.read' },
  ],
  edges: [
    ['lb', 'sg'], ['vpc', 'sg'], ['vpc', 'sub'], ['sub', 'ec2'], ['pol', 'iam'], ['ec2', 'log'], ['s3', 'kms'], ['iam', 'rds'], ['log', 'kms'], ['lb', 'pol'],
  ],
  path: ['net', 'sg', 'ec2', 'iam', 's3'],
}
const at = (id: string) => G.nodes.find((n) => n.id === id)!

function TitleGraph({ mode }: { mode: SlideProps['mode'] }) {
  const d = G.path.map((id, i) => `${i ? 'L' : 'M'}${at(id).x} ${at(id).y}`).join(' ')
  return (
    <svg className="tgraph" viewBox="0 0 1110 640" role="img" aria-label="A graph of AWS resources; one potential path runs from the internet through a security group, an EC2 instance and an IAM role to an S3 bucket">
      {G.edges.map(([a, b]) => (
        <line key={a + b} className="tg-e" x1={at(a).x} y1={at(a).y} x2={at(b).x} y2={at(b).y} />
      ))}
      <motion.path
        className="tg-path"
        d={d}
        initial={mode === 'pdf' ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      {G.nodes.map((n) => {
        const onPath = G.path.includes(n.id)
        return (
          <g key={n.id} className={`tg-n ${onPath ? 'is-path' : ''} ${n.id === 's3' ? 'is-target' : ''}`}>
            <rect x={n.x - 12} y={n.y - 12} width={24} height={24} rx={4} />
            <text x={n.x + 22} y={n.y + 6}>
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function S1Title({ mode }: SlideProps) {
  const dec = (text: string, delay = 0) =>
    mode === 'pdf' ? (
      text
    ) : (
      <DecryptedText text={text} animateOn="view" sequential revealDirection="start" speed={22} maxIterations={8} useOriginalCharsOnly={false} className="dec" encryptedClassName="dec-enc" style={{ animationDelay: `${delay}ms` }} />
    )
  return (
    <Slide n={1} criterion="Project title" className="s1">
      <div className="s1-grid">
        <div>
          <h1 className="s1-title">
            {dec('Explainable Cloud Security Analyzer with ')}
            <em>{dec('Attack‑Path')}</em>
            {dec(' Analysis and AI‑Assisted Remediation')}
          </h1>
          <p className="s1-sub">{project.subtitle}</p>
          <dl className="s1-meta">
            <div>
              <dt>Presented by</dt>
              <dd>
                <strong>{presenter.name}</strong> · {presenter.matric}
              </dd>
              <dd>{presenter.programme}</dd>
            </div>
            <div>
              <dt>Supervisor</dt>
              <dd>
                <strong>{presenter.supervisor}</strong>
              </dd>
              <dd>
                {project.occasion} · Tentative title
              </dd>
            </div>
          </dl>
        </div>
        <TitleGraph mode={mode} />
      </div>
    </Slide>
  )
}

/* ───────── 2 · Introduction ───────── */

const order: Flag['id'][] = ['sg', 'iam', 's3']
/** Callouts open downward except the IAM one, which opens upward so it never collides with the S3 note. */
const opensUp: Record<Flag['id'], boolean> = { sg: false, iam: true, s3: false }

function Callout({ id, open, onSelect, pdf }: { id: Flag['id']; open: boolean; onSelect: () => void; pdf: boolean }) {
  const f = flags[id]
  return (
    <div className={`callout ${open ? 'is-open' : ''} ${opensUp[id] ? 'is-up' : ''}`}>
      {pdf ? (
        <p className="callout-t">{f.title}</p>
      ) : (
        <button type="button" className="callout-t" onClick={onSelect} aria-expanded={open}>
          {f.title}
        </button>
      )}
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div className="callout-body" initial={pdf ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
            <p className="callout-res">{f.resource}</p>
            <p>
              <b>Why</b> {f.why}
            </p>
            <p>
              <b>Fix</b> {f.fix}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function S2Intro({ mode, step, setStep }: SlideProps) {
  const pdf = mode === 'pdf'
  const sel = order[Math.min(step, 2)]
  return (
    <Slide n={2} criterion="Introduction" className="s2">
      <div className="s2-grid">
        <div className="s2-left">
          <h2 className="h2">One file builds the cloud, and its mistakes.</h2>
          <ol className="s2-statements">
            {introStatements.map((t, i) => (
              <li key={i}>
                <span className="num">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
          <ul className="s2-q" aria-label="The project's four questions">
            {fourQuestions.map((q) => (
              <li key={q.k}>
                <strong>{q.k}</strong>
                <span>{q.q}</span>
              </li>
            ))}
          </ul>
          <p className="s2-src">
            <ExtLink href={terraformSource.url}>Terraform documentation · developer.hashicorp.com</ExtLink>
          </p>
        </div>
        <Win
          title="main.tf  ·  the file Checkov scans on slide 6"
          kind="editor"
          className="s2-editor"
          actions={
            <a className="win-link" href="/sources/checkov/main.tf" target="_blank" rel="noopener noreferrer">
              open file
            </a>
          }
        >
          <ol className="code" aria-label="Terraform configuration">
            {terraform.map((l, i) => {
              const flagged = l.flag
              const on = Boolean(flagged && (pdf || flagged === sel))
              return (
                <li key={i} className={`${flagged ? 'is-flag' : ''} ${on ? 'is-sel' : ''}`}>
                  <span className="ln">{i + 1}</span>
                  {flagged && !pdf ? (
                    <button type="button" className="code-flag" onClick={() => setStep(order.indexOf(flagged))} aria-pressed={on} aria-label={`Line ${i + 1}: ${flags[flagged].title}`}>
                      <code>{l.text}</code>
                    </button>
                  ) : (
                    <code>{l.text || ' '}</code>
                  )}
                  {flagged ? <span className="gutter-mark" aria-hidden="true" /> : null}
                  <span className="note-cell">{flagged ? <Callout id={flagged} open={on} pdf={pdf} onSelect={() => setStep(order.indexOf(flagged))} /> : null}</span>
                </li>
              )
            })}
          </ol>
        </Win>
      </div>
    </Slide>
  )
}
