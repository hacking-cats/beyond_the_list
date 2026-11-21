# 0006. Show the balance without a "since <date>" note

- **Date:** 2026-11-21
- **Status:** proposed

## Context
Decision 0005 and Transaction contract rule 6 required the header to label a balance computed from an unknown opening balance as "Balance since 1 January 2025, counted from your statements (they have no starting balance)". In the demo, the team found the note distracting on the main screen: users read the big number first and the note did not help them.

## Decision
- The header shows the computed balance (total, private account, credit card) without the "since <date>" note.
- The calculation itself does not change: opening balance + settled rows per account, 0 on the first day of the data when unknown.
- `balance()` still returns `sinceDate`, so any place that explains the number (for example the AI's answers, or a future info button) can say how it was calculated.

## Consequences
- With the dummy data the header can look like a real bank balance although it starts at 0. That is acceptable for the demo; with real data the opening balance must come from the bank (open question in the contract), and this decision should be revisited.
- Contract rule 6 and insights SPEC rule 4 are updated to match.
