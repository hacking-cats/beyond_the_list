# Design system: Beyond the List

Mobile-first visual foundation for our hackathon prototype: a bank statement where every line can be tapped and explained.

This folder is the single source of truth for the UI. The app is one HTML file that uses `tokens.css`; Lovable is used only for screen sketches (decision B4).

## Product in one sentence

A statement list; tap a line, a sheet explains it (what it is, your picture, worth knowing, follow-up questions), in one of three tones. The demo ends with a jump of three months.

## For humans

1. `foundations/brand.md`
2. `foundations/layout.md`, `foundations/accessibility.md`
3. `components/`: the five things we actually build
4. `foundations/tone.md` before touching any text

## See it

Open `preview.html` in any browser: every component with real texts, at phone width. After changing `tokens.css`, `components.css` or `icons.svg`, rebuild it with `python3 build_preview.py`.

## Building the app (no Lovable needed)

| File | What it is |
|---|---|
| `tokens.css` | Colours, type, spacing, motion as CSS variables |
| `components.css` | Ready classes for every component |
| `icons.svg` | Seven outline icons as an SVG sprite |
| `preview.html` | The markup to copy for each component |
| `ai/claude-context.md` | Give this to Claude when building the app |

All of it goes into the one HTML file: CSS inside `<style>`, the icons at the top of `<body>`.

`ai/lovable-instructions.md` is optional, only for sketching screens.

## What changed from v1, and why

The structure, the layout rules and the accessibility rules of v1 are kept. Changes:

- **Scope:** the product shrank to one scenario, so the components are the ones that scenario needs (statement line, answer sheet, tone block, question chips, time jump). Inputs, forms, bottom navigation, snackbar, empty and skeleton states are out.
- **Contrast:** the palette is kept; four text colours were darkened slightly so that every text colour meets WCAG 2.2 AA (measured values in `foundations/accessibility.md`). Yellow, grapefruit and light blue are never used for text.
- **One typeface:** Inter with a system fallback. The mono font was only for IBANs and IDs, which we don't show.
- **Tokens for the app:** `tokens.css` holds the same values as CSS variables, because the app is plain HTML.
- **Tone:** linked to our tone and wit rules (T1–T4), so generated UI never rewrites or removes the texts.
