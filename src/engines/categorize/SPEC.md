---
engine: categorize
status: draft
owner: TBD
---

# Engine: categorize

Pure functions: plain data in, plain data out. Money in integer Rappen.

## Purpose
Map messy merchant names to one clean name and a category using `content/merchants.json` and `content/categories.json`.

## Functions
- **categorize(transaction, merchants, userRules) -> { counterparty, category }**

## Rules
1. User corrections win over preset rules.
2. Unknown merchants go to `other`.

## Examples (become unit tests)
| Input | Expected output |
|---|---|
| TBD | TBD |

## Requirements to fill in
- [ ] Category list and keyword list (domain expert).
- [ ] Are user corrections in the MVP?
