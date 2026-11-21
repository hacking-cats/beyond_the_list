---
engine: alerts
status: draft
owner: TBD
---

# Engine: alerts

Pure functions: plain data in, plain data out. Money in integer Rappen.

## Purpose
Flag payments that look suspicious so the user can approve them or be redirected to a bank adviser.

## Functions
- **detect(transactions, history) -> Alert[]** where Alert = `{ transactionId, reason, severity }`

## Rules
1. Each alert has a reason key (i18n) the user can understand.
2. Deterministic: same input, same alerts.

## Examples (become unit tests)
| Input | Expected output |
|---|---|
| TBD | TBD |

## Requirements to fill in
- [ ] The rules: unusual amount, new merchant abroad, duplicates on the same day, ...?
- [ ] Thresholds per rule.
