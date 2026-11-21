# 0004. The app reads the dummy CSVs (before the contracts are frozen)

- **Date:** 2026-11-21
- **Status:** proposed

## Context
`data/dummy/` holds a year of made-up transactions in the challenge format (Account1 private account, Account3 credit card). The app still showed hand-written demo numbers. The `Transaction` and `TransactionSource` contracts and the ingest, categorize, insights and savings engine specs are all `draft`.

## Decision
- The CSVs are bundled with the app (`?raw` imports in `src/shared/transactions.ts`) and turned into transactions by pure engines:
  - `engines/ingest`: `parseCsv`, `toTransactions`, `mergeAccounts` (rules from `src/contracts/transaction.md`: integer Rappen rounded once, the side that is our account sets the sign, the credit card payment counted once as a transfer, income from a shop is a refund, identical rows kept, EUR rows with rate 1.0 flagged).
  - `engines/categorize`: merchant rules in `content/merchants.json`, categories in `content/categories.json` (with an extra `kind`: `essential` or `flexible`); unknown merchants go to `other`.
  - `engines/insights/monthly.ts`: month summary, average monthly spending per category over the last 12 months, payments per month, tax per year.
  - `engines/savings/suggestCuts.ts`: halve the biggest flexible categories (never essentials).
- All pages use these numbers: header (money left over in the newest month: income minus spending, not an account balance), Overview, Explained (the newest month), Savings ideas, Coming up (tax paid last year), My future (texts for someone with a salary).
- Category texts are shared in `src/i18n/<locale>/categories.ts`.
- `Transaction` lives in `engines/ingest/types.ts` until the contract is frozen; it adds `originalName`.

## Consequences
- When the contracts are frozen, `src/shared/transactions.ts` becomes the CSV adapter of `TransactionSource` behind `useServices()`; the engines stay.
- The engine specs' open questions are answered here provisionally (averaging window 12 months, cut = 50%); the owners should confirm or change them.
- Tests use the dummy files as known answers; per `data/dummy/README.md`, those files must not be edited in place.
