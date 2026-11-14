/**
 * Presenter details shown on the title slide.
 * Empty strings are hidden. Only "Akif" appears in the FYP proposal byline,
 * so the remaining fields are left for the presenter to fill in.
 */
export const presenter = {
  name: 'Muhammad Akif Zafran Bin Mohd Zulkifly',
  short: 'Akif',
  matric: '23001990',
  programme: 'Bachelor of Computer Science (Information Systems)',
  university: '',
  supervisor: 'Dr. Fairuz Amalina Narudin',
}

export const project = {
  title: 'Explainable Cloud Security Analyzer with Attack-Path Analysis and AI-Assisted Remediation',
  subtitle: 'A Terraform-Based Pre-Deployment Analysis with Optional Read-Only AWS Validation',
  short: 'Cloud Risk Analyzer',
  occasion: 'FYP Monitoring Presentation',
  status: 'Tentative title',
}

export type Status = 'completed' | 'in-progress' | 'planned' | 'optional'

export const statusLabel: Record<Status, string> = {
  completed: 'Completed',
  'in-progress': 'In progress',
  planned: 'Planned',
  optional: 'Optional',
}
