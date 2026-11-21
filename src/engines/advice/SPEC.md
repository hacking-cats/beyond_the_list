---
engine: advice
status: draft
owner: TBD
---

# Engine: advice

Pure functions: plain data in, plain data out. "Today" is an input.

## Purpose
Sample appointment times for the "Talk to a PostFinance specialist" booking prototype on the Savings page. PostFinance has no public booking interface; real appointments are booked in the PostFinance App, e-finance or by phone (links in `content/postfinance-links.json`).

## Functions
- **sampleSlots(today, count = 6) -> AdviceDay[]**: the next `count` days from tomorrow, Sundays skipped. Weekdays 08:30–18:30 (six slots), Saturdays 08:30–14:00 (four slots). Slot taken when (day of month + slot position) % 3 = 0; the fourth day is fully booked.
- **firstFreeDay(days) -> AdviceDay | undefined**

## Rules
1. Same input, same output (no clock, no randomness).
2. Times are samples; the UI always says so and shows how to book for real.

## Examples (unit tests in `sampleSlots.test.ts`)
| Input | Expected output |
|---|---|
| today 2026-11-21 (Sat) | 23, 24, 25, 26, 27, 28 Nov; 26 Nov fully booked; 28 Nov has Saturday times |
| today 2026-12-30, count 3 | 31 Dec, 1 Jan, 2 Jan |
