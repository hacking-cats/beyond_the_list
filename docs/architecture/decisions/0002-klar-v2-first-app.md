# 0002. klar prototype as the first Quasar app (V2), V1 kept at /v1/

- **Date:** 2026-11-21
- **Status:** proposed

## Context
A single-file HTML prototype ("klar", V1) was built and styled with the team design system. The repo had no app yet; decision 0001 fixes the stack (Vue 3 + Quasar v2, hash router, GitHub Pages). All contracts are still `draft`, and CLAUDE.md says not to implement a draft contract without asking.

## Decision
- The Quasar app is created in `src/` and klar's screens are mapped onto the planned pages:
  - **Dashboard**: balance, spending overview (bubble chart + ranked list), and "Coming up" (tax set-aside, health insurance deadline, premium reduction).
  - **Movements**: statement lines that explain themselves on tap.
  - **Savings**: savings goal, ideas from spending habits, the resulting plan, and "Your future" (AHV, pillar 3a, individual taxation).
  - **AI chat, Investment ideas, Data generator**: registered but `enabled: false` (placeholder pages, no route, no menu entry).
- **No contract is implemented.** Made-up data lives in `src/shared/demo-data.ts` until the `TransactionSource` fake adapter exists; pages read it directly instead of through `useServices()`.
- Numbers come from pure, tested functions: `engines/savings/goalPlan.ts`, `engines/insights/categoryShares.ts`, `shared/money.ts`.
- The bubble chart uses its own small packing function (`features/dashboard/packCircles.ts`); no chart library was added (AGENTS.md: ask first).
- Styling is the team design system (`src/css/tokens.css`, `components.css`) plus Quasar brand colours from the same tokens.
- V1 is kept unchanged as `public/v1/index.html`, so Pages serves V1 at `/v1/` and V2 at the root.

## Consequences
- When `transaction-source`, `services` and `feature-registry` are frozen, replace the demo-data imports with `useServices()` and move the `FeatureEntry` type into `src/contracts/`.
- `goalPlan` and `categoryShares` should be checked against the savings and insights specs once those are filled in.
- The design system README says "one HTML file, no build step" (its decision B1); V2 replaces that with Quasar. V1 still follows B1.
