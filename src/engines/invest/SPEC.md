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
- **matchProducts(facts, products, locale) -> ProductIdea[]** (`src/engines/invest/matchProducts.ts`): `facts.hasEarnedIncome` from the statements; `locale` picks the postfinance.ch page language (en, de, fr, it; others get en).

## Rules
1. Only products from `content/invest-products.json`; never invented.
2. Output is an idea, not advice; each match carries the official link.

## Examples (become unit tests)
| Input | Expected output |
|---|---|
| salary, 4 products, en-US | fundSavingPlan, retirement3a, etfSavingPlan, eAssetManagement (easiest start first, then smallest minimum) |
| no salary | same without retirement3a (pillar 3a needs own earned income) |
| locale fr / ar | French pages / English pages |
| no products | empty list |

## Requirements to fill in
- [x] Product list with official links (from postfinance.ch, 21 Nov 2026; domain expert to confirm).
- [ ] Minimum surplus before any idea is shown.
