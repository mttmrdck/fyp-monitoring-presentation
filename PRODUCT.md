# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** the FYP lecturer/assessor at a monitoring session, watching the deck on a classroom room projector while the student presents. Job: judge quickly whether the project is focused, technically defensible, measurable and honestly reported.
- **Secondary:** the same assessor reading the PDF version afterwards, without the presenter and without any interaction.
- **Presenter:** the student (Akif), driving the deck live with keyboard or clicker.

## Product Purpose

An 8-slide FYP monitoring presentation (maximum 8, covering only the lecturer's six criteria: project title, introduction, objectives, problem statement, literature review, stakeholder collaboration initiative) for an undergraduate Computer Science FYP: *Explainable and Context-Aware AWS Cloud Misconfiguration and Attack-Path Risk Analyzer — A Terraform-Based Pre-Deployment Analysis with Optional Read-Only AWS Validation* (short label: Cloud Risk Analyzer). Two deliverables share one content source: an interactive website (progressive reveals allowed) and a 16:9 PDF where everything is visible. Success: the lecturer understands the project from the visuals, not from paragraphs.

## Positioning

The analyzer is a focused combination, not a new detection technology: ~10 rule-based checks on Terraform (S3, IAM, EC2 Security Groups), explicit resource/identity/permission relationship modelling, 1–2 predefined evidence-supported potential attack paths, evidence-linked explanations, contextual prioritisation, CLI + HTML report, and an optional, separate, read-only Boto3 validation path. It analyses before deployment; it is not runtime monitoring.

## Operating Context

University FYP monitoring session (presenter + assessor, projector), then PDF review. The project's real artefacts: Terraform HCL, `terraform show -json` plan output, AWS resources, Checkov as the comparison baseline.

## Capabilities and Constraints

- Problem statements PS1–PS3 (Detection → Understanding → Prioritisation) and Objectives O1–O4 are fixed wording-in-meaning.
- Proposal (17 Oct 2026) requirements to preserve: 8–10 labelled scenarios including at least 3 clean and 2 tricky-but-safe; at least 2 chain (attack-path) scenarios; Checkov compared only on shared checks; proposed score = base severity (1–10) × exposure (1.0 internet / 0.6 internal / 0.8 unknown), chains ranked above their findings, thresholds and chain rule fixed before evaluation; FYP1 checkpoint: parser + 5 rules + 1 working chain.
- Website: keyboard, fullscreen, overview, progress, URL per slide, swipe, reduced motion, PDF download.

## Evidence on Hand

- Verified papers (DOI + Crossref checked): Movva et al. 2025; Keerthana 2026; Almarri et al. 2026 — details in `src/data/references.ts`.
- Tool docs (Checkov, Trivy, Prowler, AWS Security Hub) and CIS AWS Foundations Benchmark v7.0.0.
- Progress evidence: proposal (17 Oct), Learning Pathway v2 (26 Oct), `cloud-fyp` venv with Checkov 3.3.29 + Boto3; analyzer repo created with no commits.
- **Absent and never to be fabricated:** results, metrics, charts of performance, implementation, stakeholder feedback, confirmed collaborations. Lejiend Community is a potential outreach channel only (site unreachable when checked).

## Product Principles

1. Show the mechanism, don't describe it: relationships, evidence and flows are drawn.
2. Honesty is visible: planned vs completed, illustrative vs confirmed, always labelled.
3. Fair to existing tools: Checkov graph policies, Prowler and Security Hub attack paths acknowledged.
4. The PDF stands alone: nothing essential depends on interaction.

## Accessibility & Inclusion

Must read on a room projector (strong contrast, large type), keyboard-operable, reduced-motion respected.
