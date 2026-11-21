# Feature: Savings

- **Route:** `/savings`
- **Status:** fake (demo data from `src/shared/demo-data.ts`)
- **Services used (via useServices()):** none yet; planned: transactions, assistant
- **Engines used:** savings (`goalPlan`)
- **Decisions:** [0002](../../../docs/architecture/decisions/0002-klar-v2-first-app.md)

## What the user can do
- Pick a goal (house, car, holiday, other), set amount, already saved and months; see what to save per month.
- Pick savings ideas from their spending habits (never essentials); the plan shows the monthly amount found, months to the goal at that pace, and what is still missing.
- "Your future": AHV coverage, pillar 3a, individual taxation from 2032.

## How to test
`npm test` (goalPlan known answers). Visual: `npm run dev`, open `#/savings`.

## Known gaps
- Ideas are fixed demo data, not computed from transactions; nothing is saved.

## Requirements to fill in
- [ ] Acceptance criteria (PM).
- [x] Can the user set a savings goal? Yes (this page).
