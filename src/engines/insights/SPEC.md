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
- **balance(transactions, accountId, opening: { amountRappen, date }, asOf) -> { balanceRappen, sinceDate, pendingRappen }**: per account, from that account's own rows (before transfers are merged away)

## Rules
1. Transfers and pending rows are excluded from spending.
2. Refunds are netted against their merchant.
3. If safe to spend is negative, return it as is; the UI shows a calm warning.
4. Balance = opening balance + settled rows of that account from the opening date to `asOf` (Transaction contract, rule 6). Unknown opening balance: `0` on the first day of the data; the UI shows "since <date>".

## Examples (become unit tests)
| Input | Expected output |
|---|---|
| Dummy Account1 (private account), opening 0 on 2025-01-01, as of 2025-12-31 | `balanceRappen: 881636` (CHF 8'816.36) |
| Dummy Account3 (credit card), opening 0 on 2025-01-01, as of 2025-12-31 | `balanceRappen: -16363` (CHF 163.63 owed) |
| Both together | CHF 8'652.73; the 12 card payments cancel out |

## Requirements to fill in
- [ ] Exact safe-to-spend formula (which upcoming bills count).
- [ ] How is payday detected (largest income, or set by the user)?
