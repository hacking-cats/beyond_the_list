# Feature: Dashboard (tab "Overview")

- **Route:** `/dashboard`
- **Status:** real (dummy CSVs in `data/dummy/`, via `src/shared/statements.ts`; decision 0004)
- **Services used (via useServices()):** none yet; planned: transactions, storage, assistant, notifier
- **Engines used:** insights (`categoryShares`)
- **Decisions:** [0002](../../../docs/architecture/decisions/0002-klar-v2-first-app.md)

## What the user can do
- See where the money goes: one bubble per category (area = monthly spend), petrol for essentials, grapefruit for spending that could be cut. Filter to "only what you could cut", tap a bubble for amount, share and a tip; full ranked list below (table view for accessibility).
- Each bubble shows the category icon (from `content/categories.json`) above the amount; small bubbles show the icon alone. The list shows the same icon in a round badge. Category names stay in the aria-labels and the list.

## Public API
`DashboardPage.vue` (registered in `features/registry.ts`), `BubbleChart.vue`, `packCircles(values, width)`.

## How to test
`npm test` (packCircles: no overlaps, area ∝ value; `src/shared/ui/icons.test.ts`: every category icon is registered). Visual: `npm run dev`, open `#/dashboard`.

## Known gaps
- Reads demo data directly instead of `useServices()` (contracts are draft).
- No suspicious-payment alerts and no AI-editable layout yet.

## Requirements to fill in
- [ ] Acceptance criteria (PM).
- [ ] Widget list and default layout (design).
