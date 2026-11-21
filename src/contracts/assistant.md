---
contract: Assistant
status: draft
owner: TBD
reviewer: integrator
used_by: [chat, dashboard (reshape by asking), savings, invest, report]
implementations: [fake, llm-backed (uses LlmProvider)]
---

# Assistant

## Purpose
The in-app AI: answers questions, writes summaries (e.g. the monthly report) and proposes actions. It explains facts computed by engines and always asks before acting.

## Data types
- **ChatMessage**: `{ id, role: "user" | "assistant", text, createdAt, proposalIds?: string[] }`
- **Proposal**: `{ id, kind: "edit-dashboard" | "set-savings-goal" | "flag-payment" | ..., summaryKey, params, payload, status: "pending" | "approved" | "rejected" }`
  - For `edit-dashboard`, `payload` is a new `DashboardLayout` (see `dashboard-layout.md`).

## Operations
- **ask(text, context) -> { reply: ChatMessage, proposals: Proposal[] }**: context names the page and the facts from engines.
- **monthlyReport(facts, locale) -> string**
- **dailyInvestIdea(facts, products) -> { text, productKey }**: `productKey` must exist in `content/invest-products.json`.
- **listProposals(status?) -> Proposal[]** (the approval queue)
- **decide(proposalId, "approved" | "rejected") -> void**: only an approved proposal is applied.

## Rules
1. Numbers come from engines; the assistant only puts facts into words.
2. Sends the model summaries only (see `llm-provider.md` rule 1).
3. Never acts without approval: every change is a Proposal shown as a Yes/No card.
4. Investment ideas are ideas, not advice, always with the official PostFinance link; never a product outside `content/invest-products.json`.
5. Works fully offline with the fake.

## Fake behaviour
Keyword-based canned replies (e.g. "save" → savings tip, "dashboard" → an `edit-dashboard` proposal that adds a widget). Monthly report from a template. Deterministic.

## Contract tests
- `ask` never changes state by itself; only `decide(approved)` does.
- `dailyInvestIdea` returns a known `productKey` with a link.
- Proposals survive a reload (stored via Storage).

## Requirements to fill in
- [ ] Full list of proposal kinds for the MVP.
- [ ] What happens when the user rejects a flagged payment (link to a bank adviser?).
- [ ] Languages of the chat beyond en and de.

## Open questions
- None yet.
