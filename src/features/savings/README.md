# Feature: Savings

- **Route:** `/savings`
- **Status:** real (dummy CSVs in `data/dummy/`, via `src/shared/statements.ts`; decision 0004)
- **Services used (via useServices()):** none yet; planned: transactions, assistant
- **Engines used:** savings (`goalPlan`)
- **Decisions:** [0002](../../../docs/architecture/decisions/0002-klar-v2-first-app.md)

## What the user can do
- Pick a goal by icon (house, car, holiday, emergency fund, education, bucket list, children) or add a project of your own with a name and an icon or photo; set amount, already saved and months; see what to save per month. This part (`SavingsGoal.vue`) is shown on the Coming up tab; both tabs share the goal through `goalState` in `projects.ts`.
- Pick savings ideas from their spending habits (never essentials); the plan shows the monthly amount found, months to the goal at that pace, and what is still missing.
- Cap the children's game and in-app purchases (App Store, Google Play, PlayStation, Xbox, ...): a toggle with a monthly maximum on a slider (starts at the recommended budget from `content/alternatives.json`); switching it on adds the saving (`savingWithCap`) to the plan and shows a confirmation. Until then it is the first card on the page; after OK it closes into a round "Games" button with a tick and the limit, and tapping it opens the card again. Prototype: no real card limit is set.
- The other ideas are round buttons in the dashboard group colours, with a short label (`altShort.*` or the category's short name) and the saving; tapping one opens its card under that row (one at a time). Coming from a dashboard bubble opens that category's idea.
- Talk to a PostFinance specialist (`AdviceBooking.vue`, right after the game-purchase limit): pick a topic (saving, investing, retirement 3a), branch or video, a day and a free time from **sample** times (`engines/advice/sampleSlots.ts`). The confirmation says it is a prototype and shows how to book for real: PostFinance App or e-finance, the PostFinance advice page, or by phone (`content/postfinance-links.json`). Nothing is sent to PostFinance. The confirmation offers **Add to my calendar**: a calendar file (.ics, for Apple, Outlook, Android) or a Google Calendar link; the entry says "sample, not booked" (`engines/advice/calendar.ts`).
- Investment ideas with PostFinance links at the end (`src/features/invest/InvestIdeas.vue`).

## How to test
`npm test` (goalPlan known answers, `engines/advice/sampleSlots.test.ts`, `engines/advice/calendar.test.ts`). Visual: `npm run dev`, open `#/savings`.

## Known gaps
- Ideas are computed from the statements: first cheaper alternatives found in the user's own payments (`engines/savings/alternatives.ts` with `content/alternatives.json`, e.g. ZVV monthly pass, Lidl instead of Coop, Halbtax), then the biggest flexible categories without an alternative, halved; "Already saved" is still a demo value. Own projects are kept in memory only (lost on reload) until the Storage contract exists.

## Requirements to fill in
- [ ] Acceptance criteria (PM).
- [x] Can the user set a savings goal? Yes (on the Coming up tab, `SavingsGoal.vue`; the Savings tab shows the ideas, the game-purchase cap first, and the plan for that goal).
