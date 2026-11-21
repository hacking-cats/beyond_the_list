---
contract: TransactionSource
status: draft
owner: TBD
reviewer: integrator
used_by: [movements, dashboard, engines via the page that loads data, data-generator]
implementations: [fake (sample), csv, bank-api (later, out of MVP)]
---

# TransactionSource

## Purpose
Deliver the user's transactions as `Transaction[]` (see `transaction.md`), so pages and engines never care whether they come from made-up data, a CSV export or, later, a bank API.

## Operations
- **listAccounts() -> Account[]**: accounts available (`{ id, label, kind: "private" | "card" | "savings" }`).
- **listTransactions(query) -> Transaction[]**: transactions matching `{ from?: date, to?: date, accountIds?: string[] }`, sorted by date descending.
- Errors: a source that cannot read returns an error result with a user-safe message key (i18n), never throws raw parser errors to the UI.

## Rules
1. Output always satisfies the `Transaction` rules (integer Rappen, signs, kinds).
2. The same input always yields the same ids (stable across reloads).
3. No network call unless the implementation is explicitly a network source.
4. Never logs raw rows or account ids.

## Fake behaviour
Returns a fixed set of made-up transactions for two accounts covering at least 3 months: salary on the 23rd, rent on the 1st, phone and streaming on the 10th, health insurance on the 29th, groceries (Migros, Coop, Lidl), one refund, one card payment transfer, one suspicious-looking payment. Deterministic, works offline.

## Contract tests
- Shape validator passes for every transaction.
- Date filter returns only rows in range; account filter works.
- Two calls return identical ids.
- Result is sorted by date descending.

## Requirements to fill in
- [ ] Does the user import a CSV in the MVP (file picker), or only the dummy data generator?
- [ ] Does the data generator write through this contract, or through Storage?
- [ ] Is pagination needed for Movements, or is a full list fine for a year of data?

## Open questions
- None yet.
