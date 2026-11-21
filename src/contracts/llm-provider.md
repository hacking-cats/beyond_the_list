---
contract: LlmProvider
status: draft
owner: TBD
reviewer: integrator
used_by: [assistant]
implementations: [fake, claude (through proxy/), local]
---

# LlmProvider

## Purpose
Turn instructions plus computed facts into text. Only the assistant uses it; pages never call it directly.

## Operations
- **complete(request) -> response**
  - request: `{ system: string, messages: { role: "user" | "assistant", text: string }[], facts: object, locale: "en" | "de", maxTokens?: number }`
  - response: `{ text: string }` or an error `{ error: "offline" | "rate-limited" | "unavailable" }`
- **isAvailable() -> boolean**

## Rules
1. `facts` contain summaries only (totals, labels, dates). Never raw transaction lists, account ids or personal details. A guard rejects requests that contain them.
2. The provider never computes numbers; it may only repeat numbers present in `facts`.
3. No API key in the app. The `claude` adapter calls `proxy/`, which holds the key.
4. On failure the app keeps working (fall back to the fake text or a message key).

## Fake behaviour
Returns canned, deterministic answers in the requested locale, built from templates filled with `facts` (e.g. "This month you spent {spentChf} on {topCategory}."). Works offline.

## Contract tests
- Same request returns a string in the requested locale.
- A request containing an account id or a raw transaction list is rejected.
- Error values are returned, not thrown.

## Requirements to fill in
- [ ] Streaming answers in the chat, or full answers only?
- [ ] Which model and token limit for the claude adapter?
- [ ] Which local model, if any, for the demo?

## Open questions
- Where `proxy/` is hosted (Cloudflare Workers or Vercel).
