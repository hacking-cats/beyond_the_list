# Content as data

Reviewed by the domain expert and translators through pull requests, without touching code. Files are append-only: add your entry, do not reorder.

| File | Shape (one entry) | Used by |
|---|---|---|
| `categories.json` | `{ "key": "food", "icon": "restaurant", "color": "#...", "kind": "essential" }` (`kind`: `essential` or `flexible`, never suggested as a cut when essential) | categorize, dashboard, savings |
| `merchants.json` | `{ "match": ["OrellFuessli", "Orell_Füssli"], "name": "Orell Füssli", "category": "books" }` | categorize |
| `alternatives.json` | `{ "from": "Migros", "to": "Lidl", "category": "food", "source": "<link>" }` | savings |
| `invest-products.json` | `{ "key": "fundSavingPlan", "icon": "savings", "minRappen": 2000, "needsEarnedIncome": false, "easiestStart": true, "urls": { "en": "<official postfinance.ch link>", "de": "…", "fr": "…", "it": "…" } }` (name, description and fees are translated in `src/i18n/<locale>/invest.ts` under `products.<key>`) | invest, savings |
| `postfinance-links.json` | `{ "savingPlanComparison": { "en": "<official link>", "de": "…", "fr": "…", "it": "…" } }` | invest |

Never invent PostFinance products: every entry in `invest-products.json` needs its official link.
