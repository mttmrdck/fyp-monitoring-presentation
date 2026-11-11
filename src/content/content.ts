/**
 * Single source of truth for the 8-slide deck. The website reveals it; the PDF prints all of it.
 * Sources: FYP proposal (17–18 Oct 2026), verified references, a real Checkov 3.3.29 run (11 Nov 2026).
 */

export type Status = 'contacted' | 'confirmed' | 'planned' | 'potential'

/* ───── Slide 2 · Introduction: the Terraform the analyzer reads ───── */

export type Flag = { id: 'sg' | 'iam' | 's3'; title: string; resource: string; why: string; fix: string }

export const flags: Record<Flag['id'], Flag> = {
  sg: {
    id: 'sg',
    title: 'SSH open to the whole internet',
    resource: 'aws_security_group.web',
    why: 'Port 22 accepts connections from any IPv4 address (0.0.0.0/0).',
    fix: 'Restrict cidr_blocks to a trusted range, or use managed access instead of SSH.',
  },
  iam: {
    id: 'iam',
    title: 'Role can do anything in S3',
    resource: 'aws_iam_role_policy.app',
    why: 'Action "s3:*" on Resource "*" grants every S3 action on every bucket.',
    fix: 'Scope Action and Resource to the specific bucket and operations the app needs.',
  },
  s3: {
    id: 's3',
    title: 'Bucket has no public access block',
    resource: 'aws_s3_bucket.records',
    why: 'Nothing in the configuration prevents the bucket from being made public later.',
    fix: 'Add aws_s3_bucket_public_access_block with all four settings enabled.',
  },
}

/** Exactly public/sources/checkov/main.tf — the file Checkov was run on. */
export const terraform: { text: string; flag?: Flag['id'] }[] = [
  { text: 'resource "aws_security_group" "web" {' },
  { text: '  ingress {' },
  { text: '    from_port   = 22' },
  { text: '    to_port     = 22' },
  { text: '    protocol    = "tcp"' },
  { text: '    cidr_blocks = ["0.0.0.0/0"]', flag: 'sg' },
  { text: '  }' },
  { text: '}' },
  { text: '' },
  { text: 'resource "aws_instance" "app" {' },
  { text: '  ami                    = "ami-12345678"' },
  { text: '  instance_type          = "t3.micro"' },
  { text: '  vpc_security_group_ids = [aws_security_group.web.id]' },
  { text: '  iam_instance_profile   = aws_iam_instance_profile.app.name' },
  { text: '}' },
  { text: '' },
  { text: 'resource "aws_iam_instance_profile" "app" {' },
  { text: '  role = aws_iam_role.app.name' },
  { text: '}' },
  { text: '' },
  { text: 'resource "aws_iam_role" "app" {' },
  { text: '  assume_role_policy = jsonencode({ Statement = [{ Action = "sts:AssumeRole",' },
  { text: '    Effect = "Allow", Principal = { Service = "ec2.amazonaws.com" } }] })' },
  { text: '}' },
  { text: '' },
  { text: 'resource "aws_iam_role_policy" "app" {' },
  { text: '  role   = aws_iam_role.app.id' },
  { text: '  policy = jsonencode({ Statement = [{' },
  { text: '    Effect = "Allow", Action = "s3:*", Resource = "*"', flag: 'iam' },
  { text: '  }] })' },
  { text: '}' },
  { text: '' },
  { text: 'resource "aws_s3_bucket" "records" {', flag: 's3' },
  { text: '  bucket = "app-records"' },
  { text: '}' },
]

export const introStatements = [
  'Cloud infrastructure is now written as code: Terraform files declare AWS resources before they exist.',
  'A mistake in the file is deployed every time it is applied, and scanners usually report each mistake on its own.',
  'This project analyses selected Terraform before deployment and explains how weaknesses connect.',
]

export const fourQuestions = [
  { k: 'Detect', q: 'What is misconfigured?' },
  { k: 'Explain', q: 'Why is it risky?' },
  { k: 'Connect', q: 'How can weaknesses connect?' },
  { k: 'Prioritise', q: 'What should be fixed first?' },
]

/* ───── Slide 3 · Problem statement ───── */

export const problems = [
  {
    id: 'PS1',
    stage: 'Detect',
    short: 'Detected weaknesses stay unconnected',
    title: 'Limited contextual analysis of interconnected IaC configurations',
    text: 'Rule-based IaC scanners detect known patterns, but coverage depends on the rules implemented. Individual findings may not show how resources, identities and permissions interact to form a broader risk.',
  },
  {
    id: 'PS2',
    stage: 'Understand',
    short: 'The reader must work out why it matters',
    title: 'Limited explainability of interconnected security findings',
    text: 'A finding may name a weakness, yet the reader still has to work out the evidence, the wider implication and how related configurations contribute to the risk.',
  },
  {
    id: 'PS3',
    stage: 'Prioritise',
    short: 'Combined risk is not ranked as one',
    title: 'Limited contextual prioritisation of combined cloud security risks',
    text: 'The same weakness can matter more or less depending on surrounding resources and permissions. Scoring weaknesses independently may not communicate combined risk.',
  },
]

/* ───── Slide 4 · Objectives ───── */

export type Part = 'input' | 'rules' | 'graph' | 'explain' | 'report' | 'eval'

export const objectives: { id: string; short: string; text: string; parts: Part[]; answers?: string }[] = [
  {
    id: 'O1',
    short: 'Detect selected misconfigurations in Terraform',
    text: 'To identify and analyse selected AWS cloud misconfigurations in Terraform Infrastructure as Code using a rule-based assessment approach.',
    parts: ['input', 'rules'],
    answers: 'PS1',
  },
  {
    id: 'O2',
    short: 'Model relationships to find potential attack paths',
    text: 'To develop context-aware analysis that models relationships between selected AWS resources, identities and permissions to identify potential attack paths.',
    parts: ['graph'],
    answers: 'PS1',
  },
  {
    id: 'O3',
    short: 'Explain with evidence, then prioritise',
    text: 'To develop an explainable risk assessment approach that provides evidence-linked findings, remediation guidance and contextual risk prioritisation.',
    parts: ['explain', 'report'],
    answers: 'PS2 · PS3',
  },
  {
    id: 'O4',
    short: 'Evaluate on labelled scenarios against Checkov',
    text: 'To evaluate the proposed analyzer using labelled Terraform test scenarios, comparison with an existing IaC security scanner, and optional read-only validation against selected live AWS configurations.',
    parts: ['eval'],
  },
]

export const pipeline: { id: Part; title: string; detail: string }[] = [
  { id: 'input', title: 'Terraform', detail: 'HCL + plan JSON' },
  { id: 'rules', title: 'Rule checks', detail: '~10 rules · S3 · IAM · SG' },
  { id: 'graph', title: 'Relationship graph', detail: 'resources · identities · permissions' },
  { id: 'explain', title: 'Explain & prioritise', detail: 'evidence · fix · ranking' },
  { id: 'report', title: 'CLI / HTML report', detail: 'read before deploying' },
]

export const evaluation = [
  '8–10 labelled Terraform scenarios: ≥3 clean, 2 tricky-but-safe, ≥2 attack-path chains',
  'Compared with Checkov on shared checks: precision, recall, F1',
  'Optional: read-only Boto3 check of an owned sandbox account; nothing is changed',
]

/* ───── Slide 6 · Proposed concept: a real Checkov run, then the connected view ───── */

export const checkovRun = {
  command: 'checkov -f main.tf --compact --framework terraform',
  version: 'Checkov 3.3.29',
  date: '11 Nov 2026',
  summary: 'Passed checks: 22, Failed checks: 17, Skipped checks: 0',
  /** Verbatim lines from the run, filtered to the three weaknesses in this example. */
  lines: [
    { check: 'CKV_AWS_24', name: 'Ensure no security groups allow ingress from 0.0.0.0:0 to port 22', resource: 'aws_security_group.web', node: 'sg' },
    { check: 'CKV_AWS_355', name: 'Ensure no IAM policies documents allow "*" as a statement\'s resource for restrictable actions', resource: 'aws_iam_role_policy.app', node: 'iam' },
    { check: 'CKV_AWS_288', name: 'Ensure IAM policies does not allow data exfiltration', resource: 'aws_iam_role_policy.app', node: 'iam' },
    { check: 'CKV2_AWS_6', name: 'Ensure that S3 bucket has a Public Access block', resource: 'aws_s3_bucket.records', node: 's3' },
  ],
  others: 13,
}

export const pathNodes = [
  { id: 'net', title: 'Internet', type: '0.0.0.0/0' },
  { id: 'sg', title: 'Security Group', type: 'aws_security_group.web' },
  { id: 'ec2', title: 'EC2 instance', type: 'aws_instance.app' },
  { id: 'iam', title: 'IAM role', type: 'aws_iam_role.app' },
  { id: 's3', title: 'S3 bucket', type: 'aws_s3_bucket.records' },
] as const

/** The configuration evidence the analyzer must find to draw each link. */
export const pathEdges = [
  { label: 'allows SSH from', evidence: 'cidr_blocks = ["0.0.0.0/0"], port 22 (main.tf:3–6)' },
  { label: 'attached to', evidence: 'vpc_security_group_ids = [aws_security_group.web.id] (main.tf:13)' },
  { label: 'runs with role', evidence: 'iam_instance_profile → aws_iam_instance_profile.app (role = aws_iam_role.app.name)' },
  { label: 'can access', evidence: 'aws_iam_role_policy.app (role = aws_iam_role.app.id): Action = "s3:*", Resource = "*"' },
]

export const plannedReport = {
  title: 'Potential attack path: Internet → S3 bucket',
  why: 'An internet-reachable instance runs with a role that can read and write every S3 bucket, including app-records.',
  rank: 'Ranked above its four individual findings, as one combined risk.',
  fix: 'Break any one link: restrict SSH, detach the role, or scope the policy to the bucket it needs.',
  caveat: 'A potential path built from configuration evidence, not a confirmed exploit.',
}

/* ───── Slide 7 · Stakeholders (statuses as stated by the presenter, 11 Nov 2026) ───── */

export const collaborator = {
  name: 'Lejiend Community',
  status: 'confirmed' as Status,
  statusText: 'Collaborator',
  href: 'https://lejiend.com/community',
  owner: { label: 'Community owner · Lejiend', href: 'https://www.linkedin.com/in/lejiend/' },
  contributes: [
    'Practitioner feedback on the Terraform test scenarios',
    'Review of whether the attack-path explanations are clear',
    'A channel to reach cloud and technology practitioners',
  ],
  improves: 'Scenarios and explanations shaped by people who use cloud infrastructure, not only by the author.',
}

export const stakeholders: { who: string; role: string; seek: string; status: Status; statusText: string; links?: { label: string; href: string }[] }[] = [
  {
    who: 'Dr. Fairuz Amalina Narudin',
    role: 'FYP supervisor · academic guidance',
    seek: 'Scope, rule selection, evaluation design',
    status: 'confirmed',
    statusText: 'Supervisor',
  },
  {
    who: 'Farhan Helmy',
    role: 'AI & full-stack engineer (as described on his site)',
    seek: 'Technical feedback on the analyzer and its report',
    status: 'contacted',
    statusText: 'Contacted',
    links: [
      { label: 'farhanhelmy.com', href: 'https://farhanhelmy.com' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-farhan-helmy/' },
    ],
  },
  {
    who: 'Wider cloud security practitioners',
    role: 'Industry perspectives',
    seek: 'Common AWS misconfiguration patterns',
    status: 'potential',
    statusText: 'Potential',
  },
]

export const statusInfo: Record<Status, { label: string; note: string }> = {
  confirmed: { label: 'Confirmed', note: 'agreed role' },
  contacted: { label: 'Contacted', note: 'asked, response pending' },
  planned: { label: 'Planned', note: 'outreach planned' },
  potential: { label: 'Potential', note: 'identified only' },
}

/* ───── Slide 8 · Summary ───── */

export const summarySteps = [
  { k: 'Detect', d: 'selected misconfigurations in Terraform' },
  { k: 'Connect', d: 'resources, identities and permissions' },
  { k: 'Explain', d: 'evidence and remediation' },
  { k: 'Prioritise', d: 'combined risk first' },
]
