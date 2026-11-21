---
engine: invest
status: draft
owner: TBD
---

# Engine: invest

Pure functions: plain data in, plain data out. Money in integer Rappen.

## Purpose
Match the user's surplus and goals to PostFinance products listed in `content/invest-products.json`.

## Functions
- **matchProducts(surplusRappen, goal, products) -> ProductMatch[]**

## Rules
1. Only products from `content/invest-products.json`; never invented.
2. Output is an idea, not advice; each match carries the official link.

## Examples (become unit tests)
| Input | Expected output |
|---|---|
| TBD | TBD |

## Requirements to fill in
- [ ] Product list with official links (domain expert).
- [ ] Minimum surplus before any idea is shown.
