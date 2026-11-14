/**
 * Real source previews shown in the literature slide.
 * Screenshots were captured from the official pages on 11 Nov 2026 (Playwright, 1440×900).
 * Paper images are page 1 of the publisher PDFs. AWS Security Hub docs could not be captured headlessly,
 * so it is shown as a labelled link, not a recreated screenshot.
 */
import { cis, papers, tools } from '../data/references'

export type Source = {
  id: string
  kind: 'paper' | 'tool'
  name: string
  meta: string
  url: string
  displayUrl: string
  image?: string
  alt?: string
  repo?: { url: string; image: string }
  /** Overrides the default capture caption. */
  captureNote?: string
  docs?: { url: string; label: string }
  what: string
  relevant: string
  differs: string
}

const p = Object.fromEntries(papers.map((x) => [x.id, x]))
const t = Object.fromEntries(tools.map((x) => [x.name, x]))

export const sources: Source[] = [
  {
    id: 'movva',
    kind: 'paper',
    name: 'Movva et al. (2025)',
    meta: p.movva2025.title,
    url: p.movva2025.url,
    displayUrl: 'doi.org/10.34218/IJCST_02_01_002',
    image: '/sources/paper-movva.webp',
    alt: 'First page of Movva et al. (2025), International Journal of Computer Security',
    what: 'Evaluates LLM-based IaC security scanning and drift detection against rule-based tools (Checkov, tfsec).',
    relevant: 'Reports 31% higher detection of context-dependent misconfigurations in its own evaluation: context matters.',
    differs: 'Detection here uses explicit rules and relationships; an LLM only suggests fixes. The 31% figure is not generalised.',
  },
  {
    id: 'keerthana',
    kind: 'paper',
    name: 'Keerthana (2026)',
    meta: p.keerthana2026.title,
    url: p.keerthana2026.url,
    displayUrl: 'doi.org/10.33564/IJEAST.2026.v11i05.010',
    image: '/sources/paper-keerthana.webp',
    alt: 'First page of Keerthana (2026), IJEAST',
    what: 'Exploratory comparison of Checkov with an LLM reviewer on 12 Terraform files.',
    relevant: 'Contrasts deterministic checks with contextual explanation and suggested fixes.',
    differs: 'Exploratory, 12 files. Here, AI fixes are re-scanned by the rules and evaluated on labelled scenarios.',
  },
  {
    id: 'almarri',
    kind: 'paper',
    name: 'Almarri et al. (2026)',
    meta: p.almarri2026.title,
    url: p.almarri2026.url,
    displayUrl: 'mdpi.com/2073-431X/15/7/409',
    image: '/sources/mdpi.webp',
    alt: 'MDPI Computers article page for Almarri et al. (2026)',
    what: 'Systematic review of IAM misconfigurations in cloud database services (studies 2016–2026).',
    relevant: 'Excessive rights and manual policy administration lead to privilege escalation: IAM belongs in scope.',
    differs: 'About cloud databases; not direct evidence about every AWS IAM configuration.',
  },
  {
    id: 'checkov',
    kind: 'tool',
    name: 'Checkov',
    meta: 'Open-source IaC static analysis',
    url: t.Checkov.url,
    displayUrl: 'checkov.io',
    image: '/sources/checkov.webp',
    alt: 'checkov.io home page',
    repo: { url: 'https://github.com/bridgecrewio/checkov', image: '/sources/checkov-gh.webp' },
    what: 'Scans Terraform and other IaC before deployment with built-in policies.',
    relevant: 'Its YAML custom policies can check connections between resources. The comparison baseline.',
    differs: 'This project focuses on a small set of explained, ranked paths, measured against Checkov.',
  },
  {
    id: 'trivy',
    kind: 'tool',
    name: 'Trivy',
    meta: 'Open-source security scanner',
    url: t.Trivy.url,
    displayUrl: 'trivy.dev',
    image: '/sources/trivy.webp',
    alt: 'trivy.dev home page',
    repo: { url: 'https://github.com/aquasecurity/trivy', image: '/sources/trivy-gh.webp' },
    what: 'Finds vulnerabilities, misconfigurations (including IaC) and secrets.',
    relevant: 'Related IaC misconfiguration detection.',
    differs: 'Relationship analysis was not covered in the sources reviewed; this project centres on it.',
  },
  {
    id: 'prowler',
    kind: 'tool',
    name: 'Prowler',
    meta: 'Open-source cloud security platform',
    url: t.Prowler.docUrl,
    displayUrl: 'docs.prowler.com · Attack Paths',
    image: '/sources/prowler.webp',
    alt: 'Prowler documentation, Attack Paths page',
    repo: { url: 'https://github.com/prowler-cloud/prowler', image: '/sources/prowler-gh.webp' },
    what: 'Assesses deployed cloud accounts; Prowler App draws graph-based Attack Paths for AWS.',
    relevant: 'Shows attack-path analysis is valued and feasible.',
    differs: 'Works on a running account; this project works on Terraform before deployment.',
  },
  {
    id: 'securityhub',
    kind: 'tool',
    name: 'AWS Security Hub',
    meta: 'AWS-native security findings',
    url: 'https://aws.amazon.com/security-hub/',
    displayUrl: 'aws.amazon.com/security-hub',
    image: '/sources/securityhub.webp',
    alt: 'AWS Security Hub product page: "Meet your unified security solution", with automated correlation and risk prioritization',
    captureNote: 'Real page · screenshot taken by the presenter, cropped to the website',
    docs: { url: t['AWS Security Hub'].docUrl, label: 'Docs: potential attack path graph' },
    what: 'AWS’s unified security service: correlates threats, vulnerabilities and configurations, and prioritises critical risks in AWS accounts.',
    relevant: 'Correlation and risk prioritisation are core to it; its exposure findings include a potential attack path graph.',
    differs: 'Requires deployed resources; this project reviews the configuration first.',
  },
]

export const terraformSource = {
  url: 'https://developer.hashicorp.com/terraform',
  displayUrl: 'developer.hashicorp.com/terraform',
  image: '/sources/terraform.webp',
}

export const capturedOn = '11 Nov 2026'
export { cis }
