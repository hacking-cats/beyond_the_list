# Feature: Coming up

- **Route:** `/coming-up`
- **Status:** fake (demo data from `src/shared/demo-data.ts`)
- **Services used (via useServices()):** none yet
- **Engines used:** savings (`setAsidePerMonth`)
- **Decisions:** [0002](../../../docs/architecture/decisions/0002-klar-v2-first-app.md)

## What the user can do
Set aside money each month for the final tax bill (sliders for amount and months), learn about the 30 November health insurance deadline and the Franchise, and the premium reduction.

## How to test
`npm test` (setAsidePerMonth). Visual: `npm run dev`, open `#/coming-up`.

## Known gaps
- The savings pot is not stored; texts are general, not per canton.
