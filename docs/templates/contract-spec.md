---
contract: <Name>
status: draft          # draft -> review -> frozen
owner: <who fills in the requirements>
reviewer: integrator
used_by: [<features or engines>]
implementations: [fake]
---

# <Name>

## Purpose
One or two sentences: what this contract lets the app do, and why it is an interface (it has more than one implementation).

## Data types
Plain-text description of each type: field, type, meaning, rules. Money is always integer Rappen.

## Operations
For each operation:
- **name(inputs) -> output**
- What it does, in one sentence.
- Errors: when it fails and how (empty result, error value, exception).

## Rules (hold for every implementation)
Numbered list. Each rule becomes at least one contract test.

## Fake behaviour
What the offline fake returns, so everyone can build against it today.

## Contract tests
One line per test that every implementation must pass.

## Requirements to fill in
Questions the owner answers before the contract is frozen. Delete each one once it is answered above.

## Open questions
Things nobody knows yet (for example, questions for the PostFinance mentors).
