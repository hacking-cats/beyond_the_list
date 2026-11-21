# 0003. Bottom tab bar with icons instead of a hamburger menu

- **Date:** 2026-11-21
- **Status:** proposed

## Context
AGENTS.md planned one layout with a header, a hamburger button and a drawer generated from the feature registry. The design system said "no bottom navigation" because its prototype had a single screen. The app now has five pages that people switch between all the time, on older phones, often with limited German. A hamburger menu hides the pages behind an extra tap and a list of words.

## Decision
- Navigation is a **bottom tab bar**, always visible, fixed to the bottom of the screen. No hamburger menu, no drawer.
- Tabs are **icons only** (Material outlined), each with an accessible name and a tooltip, so they work without reading and with screen readers.
- Tabs are generated from the feature registry (`order` = position, disabled features have no tab).
- Order: Overview, Explained, Savings, Coming up, My future.

## Consequences
- AGENTS.md, the root README, `src/layouts/README.md` and the design system (layout, do/don't, AI instructions) are updated to match.
- Pull request #4 (the first app) no longer deviates from the agreed layout.
- The `feature-registry` contract still says "drawer" in its wording; changing that is a separate `contract-change` pull request.
- A bottom bar fits about five tabs. If more pages become enabled (AI chat, Investment ideas), the team decides which ones get a tab.
