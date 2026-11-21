# 0002. klar prototype as the first Quasar app (V2), V1 kept at /v1/

- **Date:** 2026-11-21
- **Status:** proposed

## Context
A single-file HTML prototype ("klar", V1) was built and styled with the team design system. The repo had no app yet; decision 0001 fixes the stack (Vue 3 + Quasar v2, hash router, GitHub Pages). All contracts are still `draft`, and CLAUDE.md says not to implement a draft contract without asking.

## Decision
- The Quasar app is created in `src/` and looks and behaves exactly like klar V1: header with EN/DE, greeting and balance, then **five tabs generated from the feature registry**, in klar's order:
  1. **Explained** (`movements`): statement lines that explain themselves on tap.
  2. **Coming up** (`coming-up`, new): tax set-aside, health insurance deadline, premium reduction.
  3. **My future** (`my-future`, new): AHV, pillar 3a, individual taxation.
  4. **Savings** (`savings`): savings goal, ideas from spending habits, the resulting plan.
  5. **Overview** (`dashboard`): spending bubbles, ranked list.
  - **AI chat, Investment ideas, Data generator**: registered but `enabled: false` (placeholder pages, no route, no tab).
- **Bottom tab bar with icons** (see [decision 0003](0003-bottom-tab-bar.md)). Order: Overview, Explained, Savings, Coming up, My future. Icons are Material outlined SVGs from `@quasar/extras` (`src/shared/ui/icons.ts`), each tab with an accessible name.
- **Savings goals are icons**: house, car, holiday, emergency fund, education, bucket list, children, plus "Add new project" (own name, icon or photo). Projects live in memory only (`features/savings/projects.ts`) until the Storage contract is frozen; a photo is a data URL that never leaves the phone.
- **Money is shown as in klar and the design system** (`1'234.50 CHF`, minus sign U+2212). This differs from AGENTS.md (`CHF 1'234.50`); `src/shared/money.ts` is the only place to change if the team keeps the AGENTS.md format.
- **No contract is implemented.** Made-up data lives in `src/shared/demo-data.ts` until the `TransactionSource` fake adapter exists; pages read it directly instead of through `useServices()`.
- Numbers come from pure, tested functions: `engines/savings/goalPlan.ts`, `engines/insights/categoryShares.ts`, `shared/money.ts`.
- The bubble chart uses its own small packing function (`features/dashboard/packCircles.ts`); no chart library was added (AGENTS.md: ask first).
- Styling is the team design system (`src/css/tokens.css`, `components.css`) plus Quasar brand colours from the same tokens.
- V1 is kept unchanged as `public/v1/index.html`, so Pages serves V1 at `/v1/` and V2 at the root.

## Consequences
- When `transaction-source`, `services` and `feature-registry` are frozen, replace the demo-data imports with `useServices()` and move the `FeatureEntry` type into `src/contracts/`.
- `goalPlan` and `categoryShares` should be checked against the savings and insights specs once those are filled in.
- The design system README says "one HTML file, no build step" (its decision B1); V2 replaces that with Quasar. V1 still follows B1.
