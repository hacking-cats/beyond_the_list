# Feature: Savings

- **Route:** `/savings`
- **Status:** real (dummy CSVs in `data/dummy/`, via `src/shared/statements.ts`; decision 0004)
- **Services used (via useServices()):** none yet; planned: transactions, assistant
- **Engines used:** savings (`goalPlan`)
- **Decisions:** [0002](../../../docs/architecture/decisions/0002-klar-v2-first-app.md)

## What the user can do
- Pick a goal by icon (house, car, holiday, emergency fund, education, bucket list, children) or add a project of your own with a name and an icon or photo; set amount, already saved and months; see what to save per month. This part (`SavingsGoal.vue`) is shown on the Coming up tab; both tabs share the goal through `goalState` in `projects.ts`.
- Pick savings ideas from their spending habits (never essentials); the plan shows the monthly amount found, months to the goal at that pace, and what is still missing.
- Cap the children's game and in-app purchases (App Store, Google Play, PlayStation, Xbox, ...): a toggle with a monthly maximum on a slider (starts at the recommended budget from `content/alternatives.json`); switching it on adds the saving (`savingWithCap`) to the plan and shows a confirmation. After OK the card leaves the list (the next idea moves up) and a one-line status with a Change button stays. Prototype: no real card limit is set.

## How to test
`npm test` (goalPlan known answers). Visual: `npm run dev`, open `#/savings`.

## Known gaps
- Ideas are computed from the statements: first cheaper alternatives found in the user's own payments (`engines/savings/alternatives.ts` with `content/alternatives.json`, e.g. ZVV monthly pass, Lidl instead of Coop, Halbtax), then the biggest flexible categories without an alternative, halved; "Already saved" is still a demo value. Own projects are kept in memory only (lost on reload) until the Storage contract exists.

## Requirements to fill in
- [ ] Acceptance criteria (PM).
- [x] Can the user set a savings goal? Yes (on the Coming up tab, `SavingsGoal.vue`; the Savings tab shows the ideas, the game-purchase cap first, and the plan for that goal).
