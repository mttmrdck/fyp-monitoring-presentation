import { GraduationCap, MessagesSquare, Users, Wrench } from 'lucide-react'
import { Slide } from '../components/Slide'
import { ExtLink } from '../components/ui'
import { collaborator, stakeholders, statusInfo, summarySteps, type Status } from '../content/content'
import { cis, lejiend, papers, terraformJsonDoc, tools } from '../data/references'

/* ───────── 7 · Stakeholder collaboration ───────── */

const icons = [GraduationCap, Wrench, Users]

export function S7Stakeholders() {
  const c = collaborator
  return (
    <Slide n={8} criterion="Stakeholder collaboration initiative" className="s7">
      <h2 className="h2">A community collaborator, and who else shapes the work.</h2>
      <div className="s7-grid">
        <article className="collab" aria-label="Collaborator: Lejiend Community">
          <p className="collab-status">
            <span className="st st--confirmed" aria-hidden="true" />
            {c.statusText} · confirmed
          </p>
          <h3 className="collab-name">
            <MessagesSquare aria-hidden="true" />
            {c.name}
          </h3>
          <p className="collab-links">
            <ExtLink href={c.href}>lejiend.com/community</ExtLink>
            <ExtLink href={c.owner.href}>{c.owner.label}</ExtLink>
          </p>
          <p className="collab-k">Input sought from the community</p>
          <ul className="collab-list">
            {c.contributes.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="collab-k">How it improves the project</p>
          <p className="collab-improves">{c.improves}</p>
        </article>
        <ol className="others" aria-label="Other stakeholders">
          {stakeholders.map((x, i) => {
            const I = icons[i]
            return (
              <li key={x.who} className={`other other--${x.status}`}>
                <p className="other-status">
                  <span className={`st st--${x.status}`} aria-hidden="true" />
                  {x.statusText}
                </p>
                <h3>
                  <I aria-hidden="true" />
                  {x.who}
                </h3>
                <p className="other-role">{x.role}</p>
                <p className="other-seek">
                  <b>Input sought</b> {x.seek}
                </p>
                {x.links ? (
                  <p className="other-links">
                    {x.links.map((l) => (
                      <ExtLink key={l.href} href={l.href}>
                        {l.label}
                      </ExtLink>
                    ))}
                  </p>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
      <p className="s7-key">
        {(['confirmed', 'contacted', 'planned', 'potential'] as Status[]).map((st) => (
          <span key={st}>
            <span className={`st st--${st}`} aria-hidden="true" />
            <b>{statusInfo[st].label}</b> {statusInfo[st].note}
          </span>
        ))}
      </p>
    </Slide>
  )
}

/* ───────── 8 · Summary & references ───────── */

export function References({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`refs ${compact ? 'refs--compact' : ''}`}>
      <h3 className="refs-h">References</h3>
      <ol>
        {papers.map((p) => (
          <li key={p.id}>
            {p.authors} ({p.year}). <ExtLink href={p.url}>{p.title}</ExtLink>. <i>{p.venue}</i>. https://doi.org/{p.doi}
          </li>
        ))}
      </ol>
      <h3 className="refs-h">Tools, documentation &amp; standards</h3>
      <ul>
        {tools.map((t) => (
          <li key={t.name}>
            <ExtLink href={t.url}>{t.name}</ExtLink> · <ExtLink href={t.docUrl}>{t.docLabel.replace(`${t.name}: `, '')}</ExtLink>
          </li>
        ))}
        <li>
          <ExtLink href="https://developer.hashicorp.com/terraform">Terraform documentation</ExtLink> · <ExtLink href={terraformJsonDoc.url}>JSON output format</ExtLink>
        </li>
        <li>
          <ExtLink href={cis.url}>
            {cis.label} {cis.version}
          </ExtLink>
        </li>
        <li>
          <ExtLink href={lejiend.url}>{lejiend.label}</ExtLink> (collaborator · community owner: linkedin.com/in/lejiend)
        </li>
      </ul>
      <p className="refs-note">Screenshots of official pages captured 11 Nov 2026 for academic reference.</p>
    </div>
  )
}

export function S8Summary() {
  return (
    <Slide n={9} criterion="Summary" className="s8">
      <ol className="s8-steps">
        {summarySteps.map((x, i) => (
          <li key={x.k}>
            <span className="s8-k">{x.k}</span>
            <span className="s8-d">{x.d}</span>
            {i < summarySteps.length - 1 ? <span className="s8-arrow" aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>
      <div className="s8-grid">
        <div>
          <p className="s8-line">
            From configuration findings to <em>contextual</em> cloud security understanding.
          </p>
          <p className="s8-q">Thank you. Questions?</p>
        </div>
        <References />
      </div>
    </Slide>
  )
}
