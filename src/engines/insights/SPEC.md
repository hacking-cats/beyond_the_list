---
engine: insights
status: draft
owner: TBD
---

# Engine: insights

Pure functions: plain data in, plain data out. Money in integer Rappen.

## Purpose
Compute the numbers behind the dashboard: totals per month and category, trends, recurring payments, pay-cycle dates and safe to spend until the next payday.

## Functions
- **monthlyTotals(transactions, month) -> { incomeRappen, spentRappen, byCategory }**
- **recurring(transactions) -> RecurringPayment[]**
- **payCycle(transactions, today) -> { lastPayday, nextPayday }**
- **safeToSpend(transactions, today) -> { perDayRappen, untilDate }**

## Rules
1. Transfers and pending rows are excluded from spending.
2. Refunds are netted against their merchant.
3. If safe to spend is negative, return it as is; the UI shows a calm warning.

## Examples (become unit tests)
| Input | Expected output |
|---|---|
| TBD | TBD |

## Requirements to fill in
- [ ] Exact safe-to-spend formula (which upcoming bills count).
- [ ] How is payday detected (largest income, or set by the user)?
