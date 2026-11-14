# Design — interactive research showcase

The deck shows the real thing: real Terraform, real scanner output, real tool and paper pages in browser windows, and a relationship path the lecturer can click through. Nine slides, one dominant visual each.

## Stage and canvas

- One near-black stage (`#0B0D12`) with two faint corner lights; no frames, no card grids.
- Each slide is designed at **1920 × 1080**; the website scales it to the viewport, the PDF prints it 1:1. Phones and portrait tablets reflow (`.deck--flow`).
- A quiet footer carries the slide number and the lecturer criterion it answers — never an eyebrow above the heading.

## Real software surfaces

| Surface | Use | Look |
|---|---|---|
| Browser window (`BrowserFrame`) | official sites, GitHub, paper pages | light macOS chrome, live URL bar that opens the real page |
| Editor (`Win kind="editor"`) | Terraform | `#0F1319`, line numbers, red squiggles + gutter dot on risky lines |
| Terminal (`Win kind="terminal"`) | Checkov output | `#07090C`, real output lines |
| App window (`Win kind="app"`) | planned report | light report surface, labelled *Planned mock-up* |

## Colour has jobs

Red = risk and the potential path · blue = the proposed analyzer and emphasis · violet = the AI model (slide 7, the O3 pipeline stage, Fix/Validate on the summary) · amber = planned / mock-up · green = passed checks / confirmed · cyan reserved for input.

## Type

Inter Tight 600–650 for headings (2.8em, title 4.4em), one Instrument Serif italic word per heading, Inter for body, JetBrains Mono only for code, output, resource names and URLs.

## Motion (Motion library)

Title resolves once (React Bits `DecryptedText`) while the path draws; slide 3's nodes move from scattered findings into a chain (layout springs) and links draw; panels cross-fade on selection. Reduced motion stops all of it; the PDF renders final states.
