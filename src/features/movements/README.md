# Feature: Movements

- **Route:** `/movements`
- **Status:** fake (demo data from `src/shared/demo-data.ts`)
- **Services used (via useServices()):** none yet; planned: transactions
- **Engines used:** none yet; planned: categorize
- **Decisions:** [0002](../../../docs/architecture/decisions/0002-klar-v2-first-app.md)

## What the user can do
See the statement; tap a line to read what it means in plain language. Lines that are often new to newcomers (tax instalment, Serafe) carry the attention icon and "New to you?".

## How to test
Visual: `npm run dev`, open `#/movements`, tap a line.

## Known gaps
- Explanations are fixed texts in `src/i18n/*/movements.ts`, one per demo line.

## Requirements to fill in
- [ ] Which filters, and their defaults.
- [ ] Tap a row: detail view? Fix a category?
