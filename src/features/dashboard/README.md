# Feature: Dashboard (tab "Overview")

- **Route:** `/dashboard`
- **Status:** real (dummy CSVs in `data/dummy/`, via `src/shared/statements.ts`; decision 0004)
- **Services used (via useServices()):** none yet; planned: transactions, storage, assistant, notifier
- **Engines used:** insights (`categoryShares`)
- **Decisions:** [0002](../../../docs/architecture/decisions/0002-klar-v2-first-app.md)

## What the user can do
- See where the money goes: one bubble per category (area = monthly spend). Colours from the PostFinance palette, one per group (design system, brand.md): petrol for essentials - recurring, light petrol for essentials - non-recurring (outlined in petrol), and grapefruit, the only alert colour, for spending that could be cut back; the detail of a cut-back category uses the red action tone. The legend names all three groups. Filter to "only what you could cut", tap a bubble for amount, share and a tip.
- The list below is grouped in three parts, each with its monthly total and share: **Essentials - recurring** (rent, health insurance, electricity, taxes, phone plan), **Essentials - non-recurring** (health, transport, clothes, eating out, other), **Could cut back** (online shopping, hobbies/books/events, holidays and travel, streaming and apps). Groups come from `group` in `content/categories.json`; only "could cut back" is suggested on the Savings page.
- Each bubble shows the category icon (from `content/categories.json`) above the amount; small bubbles show the icon alone. The list shows the same icon in a round badge. Category names stay in the aria-labels and the list.

## Public API
`DashboardPage.vue` (registered in `features/registry.ts`), `BubbleChart.vue`, `packCircles(values, width)`.

## How to test
`npm test` (packCircles: no overlaps, area ∝ value; `src/shared/ui/icons.test.ts`: every category icon is registered). Visual: `npm run dev`, open `#/dashboard`.

## Known gaps
- Reads demo data directly instead of `useServices()` (contracts are draft).
- No suspicious-payment alerts and no AI-editable layout yet.

## Tips
Tapping a bubble shows the biggest cheaper alternative found in that category (same engine and texts as the Savings page), also for essentials like groceries and transport; otherwise the category's general tip.

## Requirements to fill in
- [ ] Acceptance criteria (PM).
- [ ] Widget list and default layout (design).
