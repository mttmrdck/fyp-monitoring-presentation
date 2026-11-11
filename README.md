# Cloud Risk Analyzer — FYP Monitoring Presentation

An 8-slide interactive presentation built to the lecturer's six monitoring criteria, plus a matching 8-page PDF (`dist/FYP-Monitoring-Presentation.pdf`, 1920×1080, every reveal shown, links clickable). See `CONTENT-MAP.md` for which slide answers which criterion.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build:all    # type-check + build + PDF
npm run preview      # serve dist/ at http://localhost:4173
npm test             # 75 website + PDF checks (after build:all)
npm run lint
```

## Presenting

| Key | Action |
| --- | --- |
| → / Space | Next — reveals the slide's next step first (button reads *Reveal next*) |
| ← | Previous / step back |
| Home / End | First / last slide |
| O | Slides & sources (all references) |
| F | Fullscreen |

Everything can be driven with Next alone. Interactive extras: click a red Terraform line (slide 2), switch isolated/connected and open a problem statement (3), pick an objective to light its part of the analyzer (4), pick a paper or tool and switch Website/GitHub (5), click attack-path nodes and *Highlight the full path* (6).

## Real sources

- `public/sources/*.webp` — screenshots of the official Checkov, Trivy, Prowler and Terraform pages and their GitHub repositories, and the MDPI article page, captured 11 Nov 2026; paper images are pages from the publishers' PDFs. AWS Security Hub documentation could not be captured headlessly and is shown as a labelled link.
- Slide 6's terminal shows real output from Checkov 3.3.29 run on the slide's Terraform (22 passed, 17 failed).
- The report window on slide 6 is a labelled mock-up of planned output.

## Where to edit

| What | File |
| --- | --- |
| Slide content (objectives, problems, path, stakeholders…) | `src/content/content.ts` |
| Source previews and notes | `src/content/sources.ts` |
| Papers, tool links, CIS version | `src/data/references.ts` |
| Presenter details | `src/data/site.ts` |
| Slide order and reveal steps | `src/slides/index.ts` |

After editing, run `npm run build:all` so the PDF matches the website.

Libraries: React 19, Motion (transitions, path drawing, layout animation), lucide-react, and one React Bits component (`DecryptedText`, vendored with credit) on the title.
