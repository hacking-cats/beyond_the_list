# Feature: Movements (tab "Explained")

- **Route:** `/movements`
- **Status:** placeholder (stopgap): shows the single-file "Beyond the List" prototype from `public/v2/` in a frame
- **Services used (via useServices()):** none
- **Engines used:** none (the prototype carries its own precomputed facts)
- **Decisions:** [0002](../../../docs/architecture/decisions/0002-klar-v2-first-app.md), 0007 (Explained as the tap-a-line module, PR for #27)

## What the user can do
Everything the prototype offers, inside the tab: tap any statement line to see what it means, the Highlights strip, Yes/No actions on suspicious lines, suggested follow-up questions and the time jump between 23 September and 23 December 2025. The frame fills the space between the header and the tab bar.

## How to test
Visual: `npm run dev`, open `#/movements`, tap a line, tap "→ 23 Dec". The prototype's own demo rehearsal (from the prototype repo, `tests/demo_check.js`) passes against `/v2/`.

## Known gaps
- The prototype shows the original Jeanine, not the single-mother persona the rest of the app uses.
- English only: the language switch does not reach it. No `useServices()`; numbers are not from `src/engines/`.
- Typed questions show the prototype's offline answer.
- Replaced by the real port: issues #28–#31 (parent #25). The previous per-category list is in git history.

## Requirements to fill in
- [ ] Which filters, and their defaults.
