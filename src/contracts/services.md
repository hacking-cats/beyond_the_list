---
contract: Services
status: draft
owner: integrator
reviewer: integrator
used_by: [every page, component and store]
implementations: [src/boot/services.ts]
---

# Services (container)

## Purpose
The single object `useServices()` returns. It is how code reaches implementations without importing them.

## Data types
```
Services = {
  transactions: TransactionSource,
  storage: Storage,
  llm: LlmProvider,
  notifier: Notifier,
  assistant: Assistant
}
```

## Rules
1. Built only in `src/boot/services.ts` and provided with `app.provide()`.
2. A config value per contract picks the implementation (default: the fake).
3. Pages, components and stores never import from `src/adapters/`.
4. Tests can provide their own `Services` object with fakes.

## Requirements to fill in
- [ ] Config mechanism: environment variable at build time, or a setting in the app?
