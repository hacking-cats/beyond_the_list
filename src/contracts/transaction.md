---
contract: Transaction
status: draft
owner: TBD (domain expert + ingest developer)
reviewer: integrator
used_by: [every engine, movements, dashboard, transaction-source]
implementations: []
---

# Transaction (data type)

## Purpose
The one shape every transaction has inside the app, whatever its source (sample data, CSV, bank API). Every `TransactionSource` must deliver exactly this.

## Data types

**Money**: an integer number of Rappen (1 CHF = 100 Rappen). Never a float. Displayed Swiss style: `CHF 1'234.50`, negative `-CHF 1'234.50`.

**Transaction**

| Field | Type | Meaning / rule |
|---|---|---|
| `id` | string | Stable hash of account, date, amount and name. Names are not unique, so the name must be part of it |
| `accountId` | string | e.g. `Account1` (private account), `Account3` (credit card) |
| `date` | string `YYYY-MM-DD` | From `transaction_date`; never parsed from the name |
| `amountRappen` | integer, signed | CHF. Money out is negative: `-182000` = CHF 1'820.00 out |
| `kind` | `expense` \| `income` \| `transfer` \| `refund` | Income from a merchant is a `refund` |
| `counterparty` | string | Clean name, e.g. `Orell Füssli` (via `content/merchants.json`) |
| `category` | string, optional | Set by `engines/categorize` |
| `original` | `{ amount: number, currency: string }`, optional | Original amount when not CHF |
| `status` | `settled` \| `pending` | Pending rows stay out of totals |
| `dataIssues` | string[], optional | e.g. `eur-rate-1` when an EUR row shows rate 1.0 |

## Data contract: the challenge CSVs
One CSV per account and year, 15 columns, every amount positive.

| Column | Rule in ingest |
|---|---|
| `type` | expense, income or transfer. Income from a shop is a refund |
| `source_id`, `target_id` | The side that is our account sets the sign |
| `source_label`, `target_label` | Show labels; ids are inconsistent |
| `transaction_date`, `value_date` | Group months by `transaction_date` |
| `amount`, `currency` | Round to Rappen (some EUR rows have long decimals) |
| `exchange_rate`, `base_amount`, `base_currency` | Use `base_amount` (CHF); EUR rows with rate 1.0 get a data issue |
| `status` | All `settled` in the samples; support `pending` |
| `name` | Free text, may contain a date or `#2`; not unique |
| `description` | Empty in the samples; optional |

## Rules
1. `amountRappen` is always an integer.
2. Card payments (`Kreditkarten-Zahlung`, Account1 → Account3) appear in both files: count once, as `transfer`, never as spending.
3. Refunds are matched by merchant and a date window, not by exact amount.
4. Identical rows on the same day are kept (they can be real), each with its own id.
5. Two rows with same date, amount and payer but different name (salary and 13th salary) are both kept.
6. Balances are never computed by summing rows.

## Fake behaviour
Not applicable (data type). The fake `TransactionSource` returns made-up transactions in this shape.

## Contract tests
- Every transaction from any source passes a shape validator (fields, types, integer Rappen).
- Fixture: a card payment present in both files is counted once as transfer.
- Fixture: an EUR row with rate 1.0 carries `dataIssues: ["eur-rate-1"]`.
- Fixture: a pending row is excluded from totals.

## Requirements to fill in
- [ ] Final list of categories (keys) the app uses.
- [ ] Date window for refund matching (days).
- [ ] Do we need more `kind` values (e.g. `cash`, `fee`)?
- [ ] Which fields may the AI ever see? (Default: none of `id`, `accountId`.)

## Open questions (for PostFinance mentors)
- Which exchange rate applies to EUR rows shown with rate 1.0?
- What is the credit card billing cycle?
