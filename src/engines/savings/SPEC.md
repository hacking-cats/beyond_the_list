---
engine: savings
status: draft
owner: TBD
---

# Engine: savings

Pure functions: plain data in, plain data out. Money in integer Rappen.

## Purpose
Suggest a savings percentage, spending cuts and cheaper alternatives.

## Functions
- **savingsRate(transactions, month) -> percent**
- **suggestCuts(totals) -> Cut[]**
- **alternatives(transactions, alternativesList) -> Alternative[]**

## Rules
1. Suggestions only use alternatives listed in `content/alternatives.json`.

## Examples (become unit tests)
| Input | Expected output |
|---|---|
| TBD | TBD |

## Requirements to fill in
- [ ] How the suggested percentage is computed.
- [ ] Which categories are never suggested as cuts (rent, health insurance)?
