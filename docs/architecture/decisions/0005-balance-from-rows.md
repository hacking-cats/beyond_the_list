# 0005. Compute the balance from the payments

- **Date:** 2026-11-21
- **Status:** accepted; the "since <date>" label is replaced by decision 0006

## Context
The Transaction contract said "Balances are never computed by summing rows", so the header shows "money left over this month" (income minus spending) instead of a balance. Users expect to see how much money they have. The challenge CSVs list payments but contain no balance and no opening balance.

## Decision
- The balance of an account is its opening balance plus the sum of its settled rows from the opening date (Transaction contract, rule 6; insights `balance()`).
- Per account, from that account's own rows: a transfer between our accounts counts on both sides and cancels out in the total.
- Pending rows are left out and may be shown as "pending".
- Without a known opening balance, it is 0 on the first day of the data, and the app labels the number "since <date>" so it is never mistaken for the bank's balance.

## Consequences
- With the dummy data, the private account ends 2025 at CHF 8'816.36 and the card at −CHF 163.63 (owed), CHF 8'652.73 together, counted from 0 on 1 January 2025.
- A wrong or missing row makes every later balance wrong; the label "since <date>" and, later, a real opening balance (open question in the contract) limit the damage.
- The header can switch from "left over this month" to the balance in a separate feature pull request once this contract change is merged.
