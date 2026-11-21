# Feature: Savings

- **Route:** `/savings`
- **Status:** fake (demo data from `src/shared/demo-data.ts`)
- **Services used (via useServices()):** none yet; planned: transactions, assistant
- **Engines used:** savings (`goalPlan`)
- **Decisions:** [0002](../../../docs/architecture/decisions/0002-klar-v2-first-app.md)

## What the user can do
- Pick a goal by icon (house, car, holiday, emergency fund, education, bucket list, children) or add a project of your own with a name and an icon or photo; set amount, already saved and months; see what to save per month.
- Pick savings ideas from their spending habits (never essentials); the plan shows the monthly amount found, months to the goal at that pace, and what is still missing.

## How to test
`npm test` (goalPlan known answers). Visual: `npm run dev`, open `#/savings`.

## Known gaps
- Ideas are fixed demo data, not computed from transactions. Own projects are kept in memory only (lost on reload) until the Storage contract exists.

## Requirements to fill in
- [ ] Acceptance criteria (PM).
- [x] Can the user set a savings goal? Yes (this page).
