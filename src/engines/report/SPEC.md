---
engine: report
status: draft
owner: TBD
---

# Engine: report

Pure functions: plain data in, plain data out. Money in integer Rappen.

## Purpose
Collect the facts for the written monthly report, so the assistant only has to put them into words.

## Functions
- **monthlyFacts(transactions, month) -> ReportFacts** (totals, top categories, change vs last month, alerts, savings)

## Rules
1. Facts are summaries: no transaction lists, no account ids.
2. Every number in the written report must come from these facts.

## Examples (become unit tests)
| Input | Expected output |
|---|---|
| TBD | TBD |

## Requirements to fill in
- [ ] Sections of the report (PM).
- [ ] Comparison period (last month, same month last year).
