---
engine: ingest
status: draft
owner: TBD
---

# Engine: ingest

Pure functions: plain data in, plain data out. Money in integer Rappen.

## Purpose
Turn the rows of the challenge CSVs into `Transaction[]` following the data contract in `src/contracts/transaction.md`.

## Functions
- **parseCsv(text, accountId) -> { rows, errors }**
- **toTransactions(rows, ownAccountIds) -> Transaction[]**
- **mergeAccounts(lists) -> Transaction[]**: removes the duplicated card payments

## Rules
1. Every rule listed in `src/contracts/transaction.md` holds.
2. Round to Rappen once, in ingest; never later.

## Examples (become unit tests)
| Input | Expected output |
|---|---|
| TBD | TBD |

## Requirements to fill in
- [ ] Anonymised fixtures in `tests/fixtures/` with known answers (never real bank exports). Full-year dummy input is in `data/dummy/`.
- [ ] Separator and encoding of the challenge files.
