# Content as data

Reviewed by the domain expert and translators through pull requests, without touching code. Files are append-only: add your entry, do not reorder.

| File | Shape (one entry) | Used by |
|---|---|---|
| `categories.json` | `{ "key": "food", "icon": "restaurant", "color": "#..." }` | categorize, dashboard |
| `merchants.json` | `{ "match": ["OrellFuessli", "Orell_Füssli"], "name": "Orell Füssli", "category": "books" }` | categorize |
| `alternatives.json` | `{ "from": "Migros", "to": "Lidl", "category": "food", "source": "<link>" }` | savings |
| `invest-products.json` | `{ "key": "...", "name": "...", "url": "<official postfinance.ch link>", "risk": "low" }` | invest |

Never invent PostFinance products: every entry in `invest-products.json` needs its official link.
