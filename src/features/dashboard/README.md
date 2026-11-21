# Feature: Dashboard

- **Route:** `/dashboard`
- **Status:** fake (demo data from `src/shared/demo-data.ts`)
- **Services used (via useServices()):** none yet; planned: transactions, storage, assistant, notifier
- **Engines used:** insights (`categoryShares`), savings (`setAsidePerMonth`)
- **Decisions:** [0002](../../../docs/architecture/decisions/0002-klar-v2-first-app.md)

## What the user can do
- See the balance and where the money goes: one bubble per category (area = monthly spend), petrol for essentials, grapefruit for spending that could be cut. Filter to "only what you could cut", tap a bubble for amount, share and a tip; full ranked list below (table view for accessibility).
- "Coming up": set aside money for the final tax bill, the health insurance switch deadline, premium reduction.

## Public API
`DashboardPage.vue` (registered in `features/registry.ts`), `BubbleChart.vue`, `packCircles(values, width)`.

## How to test
`npm test` (packCircles: no overlaps, area ∝ value). Visual: `npm run dev`, open `#/dashboard`.

## Known gaps
- Reads demo data directly instead of `useServices()` (contracts are draft).
- No suspicious-payment alerts and no AI-editable layout yet.

## Requirements to fill in
- [ ] Acceptance criteria (PM).
- [ ] Widget list and default layout (design).
