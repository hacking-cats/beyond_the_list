# Adapters

Implementations of the contracts in `src/contracts/`. Only `src/boot/services.ts` imports from here. Every contract has a fake that works offline; each implementation must pass its suite in `tests/contracts/`.

| Folder | Contract | Planned files | Status |
|---|---|---|---|
| `transactions/` | TransactionSource | `fake.ts`, `csv.ts`, `bank-api.ts` (later) | placeholder |
| `storage/` | Storage | `memory.ts`, `local.ts` | placeholder |
| `llm/` | LlmProvider | `fake.ts`, `claude.ts`, `local.ts` | placeholder |
| `notifier/` | Notifier | `console.ts`, `in-app.ts`, `push.ts` | placeholder |
| `assistant/` | Assistant | `fake.ts`, `http.ts` (finAInce chat backend, `FINAINCE_CHAT_URL`), `llm-backed.ts` (later) | fake + http |
