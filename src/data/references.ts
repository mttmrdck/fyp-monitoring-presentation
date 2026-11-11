/**
 * Every reference below was checked on 11 Nov 2026:
 * - DOIs resolved through doi.org and matched Crossref metadata (title, authors, venue, pages).
 * - Documentation URLs returned HTTP 200.
 * Lejiend Community is kept as an outreach channel but its page did not respond during the check.
 */

export type Paper = {
  id: string
  authors: string
  year: string
  title: string
  venue: string
  url: string
  doi: string
  focus: string
  relevance: string
  caution: string
}

export const papers: Paper[] = [
  {
    id: 'movva2025',
    authors: 'Movva, D. K., Pullikallu, A. R., & Sugasi, M. K.',
    year: '2025',
    title: 'Infrastructure-as-Code Security and Drift Detection Using LLMs',
    venue: 'International Journal of Computer Security, 2(1), 9–25',
    url: 'https://doi.org/10.34218/IJCST_02_01_002',
    doi: '10.34218/IJCST_02_01_002',
    focus: 'IaC security analysis; rule-based tools compared with LLM-based contextual interpretation.',
    relevance:
      'Discusses limits of predefined rules for context-dependent misconfigurations: the gap this project addresses with explicit relationship modelling instead.',
    caution:
      'Reports a 31% higher detection rate for context-dependent misconfigurations in its own evaluation. Paper-specific; this project does not use LLMs.',
  },
  {
    id: 'keerthana2026',
    authors: 'Keerthana, K. S.',
    year: '2026',
    title: 'Static Analysis and LLM-Based Review for Terraform Security and Cost Issues: An Exploratory Comparative Study',
    venue: 'International Journal of Engineering Applied Sciences and Technology, 11(5), 95–99',
    url: 'https://doi.org/10.33564/IJEAST.2026.v11i05.010',
    doi: '10.33564/IJEAST.2026.v11i05.010',
    focus: 'Compares Checkov static analysis with an LLM-based reviewer on Terraform.',
    relevance:
      'Contrasts deterministic policy checks with contextual explanation and suggested fixes; informs the explainability goal and the Checkov baseline.',
    caution: 'Exploratory study on 12 Terraform files. Metrics are dataset-specific and not generalised here.',
  },
  {
    id: 'almarri2026',
    authors: 'Almarri, A., Alawadh, A., Alsayed, M., & Rafique, M. A.',
    year: '2026',
    title: 'Analyzing Identity and Access Management (IAM) Misconfigurations in Cloud Databases',
    venue: 'Computers, 15(7), 409',
    url: 'https://doi.org/10.3390/computers15070409',
    doi: '10.3390/computers15070409',
    focus: 'Systematic review of IAM misconfiguration patterns in cloud database services (studies 2016–2026).',
    relevance:
      'Identifies excessive rights and manual policy administration as sources of privilege escalation; supports including IAM in scope.',
    caution: 'Concerns cloud databases / DBaaS. Not direct experimental evidence about every AWS IAM configuration.',
  },
]

export type Tool = {
  name: string
  category: string
  input: string
  approach: string
  relationship: string
  url: string
  docLabel: string
  docUrl: string
}

export const tools: Tool[] = [
  {
    name: 'Checkov',
    category: 'IaC static analysis',
    input: 'Terraform and other IaC, before deployment',
    approach: 'Built-in policies plus custom policies; YAML policies can check connections between resources.',
    relationship: 'Detection baseline for the comparison',
    url: 'https://www.checkov.io/',
    docLabel: 'Checkov: YAML custom policies (connection state)',
    docUrl: 'https://www.checkov.io/3.Custom%20Policies/YAML%20Custom%20Policies.html',
  },
  {
    name: 'Trivy',
    category: 'Security scanner',
    input: 'IaC files, containers, file systems, repositories',
    approach: 'Scanner-based checks for misconfigurations, vulnerabilities and secrets.',
    relationship: 'Related misconfiguration detection',
    url: 'https://trivy.dev/',
    docLabel: 'Trivy: misconfiguration scanning',
    docUrl: 'https://trivy.dev/docs/latest/guide/scanner/misconfiguration/',
  },
  {
    name: 'Prowler',
    category: 'Cloud security posture',
    input: 'Live AWS (and other) accounts',
    approach: 'Posture and compliance checks, including CIS; Prowler App offers graph-based Attack Paths for AWS.',
    relationship: 'Post-deployment AWS assessment',
    url: 'https://docs.prowler.com/',
    docLabel: 'Prowler: Attack Paths',
    docUrl: 'https://docs.prowler.com/user-guide/tutorials/prowler-app-attack-paths',
  },
  {
    name: 'AWS Security Hub',
    category: 'Cloud security management',
    input: 'Deployed AWS resources',
    approach: 'Aggregates findings; exposure findings include a potential attack path graph.',
    relationship: 'Existing cloud-native attack-path context',
    url: 'https://docs.aws.amazon.com/securityhub/',
    docLabel: 'AWS Security Hub: potential attack path graph',
    docUrl: 'https://docs.aws.amazon.com/securityhub/latest/userguide/potential-attack-path-graph.html',
  },
]

export const cis = {
  label: 'CIS Amazon Web Services Foundations Benchmark',
  version: 'v7.0.0',
  versionNote: 'Latest version announced in the CIS Benchmarks April 2026 update.',
  url: 'https://www.cisecurity.org/benchmark/amazon_web_services',
  versionUrl: 'https://www.cisecurity.org/insights/blog/cis-benchmarks-april-2026-update',
}

export const terraformJsonDoc = {
  label: 'Terraform: JSON output format (terraform show -json)',
  url: 'https://developer.hashicorp.com/terraform/internals/json-format',
}

export const lejiend = {
  label: 'Lejiend Community',
  url: 'https://lejiend.com/community',
  note: 'Link supplied by the presenter; the page did not respond when checked on 11 Nov 2026.',
}
