# Feature: Movements (tab "Explained")

- **Route:** `/movements`
- **Status:** real (dummy CSVs in `data/dummy/`, via `src/shared/statements.ts`; decision 0004)
- **Services used (via useServices()):** none yet; planned: transactions
- **Engines used:** none yet; planned: categorize
- **Decisions:** [0002](../../../docs/architecture/decisions/0002-klar-v2-first-app.md)

## What the user can do
See the payments of the newest month in the statements (both accounts); tap a line to read what its category means in plain language. Taxes, health insurance and electricity advance payments carry the attention icon and "New to you?"; refunds are marked.

## How to test
Visual: `npm run dev`, open `#/movements`, tap a line.

## Known gaps
- Explanations are per category (`src/i18n/*/categories.ts`), not per payment. Only the newest month is shown; no filters yet.

## Requirements to fill in
- [ ] Which filters, and their defaults.
- [ ] Tap a row: detail view? Fix a category?
