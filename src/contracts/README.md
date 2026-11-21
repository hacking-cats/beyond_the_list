# Contracts

The shared agreements of the app. Pages, stores and engines depend on these, never on an implementation. The integrator owns this folder.

Right now every contract is a **plain-text spec**. The workflow:

1. **draft**: the owner fills in *Requirements to fill in* in a pull request (no code needed).
2. **review**: the team reads it together; the integrator checks it against the rules in `AGENTS.md`.
3. **frozen**: an agent writes `<name>.ts` (the TypeScript interface) next to the spec, the fake adapter in `src/adapters/`, and the contract test suite in `tests/contracts/`. After this, changes only through a `contract-change` pull request.

Template: [`docs/templates/contract-spec.md`](../../docs/templates/contract-spec.md).

## Data types

| Spec | What it defines | Status |
|---|---|---|
| [transaction.md](transaction.md) | `Transaction`, `Money`, the CSV data contract | draft |
| [dashboard-layout.md](dashboard-layout.md) | JSON layout of dashboard widgets the AI may edit | draft |
| [feature-registry.md](feature-registry.md) | How a page declares its route and menu entry | draft |

## Service interfaces (each gets a fake adapter)

| Spec | Purpose | Adapters planned | Status |
|---|---|---|---|
| [transaction-source.md](transaction-source.md) | Where transactions come from | fake (sample), csv, bank-api (later) | draft |
| [storage.md](storage.md) | Keep user data and settings on the device | memory, local | draft |
| [llm-provider.md](llm-provider.md) | Turn a prompt with facts into text | fake, claude (via proxy/), local | draft |
| [notifier.md](notifier.md) | Show a notification to the user | console, push (Capacitor) | draft |
| [assistant.md](assistant.md) | The in-app AI: chat, report, proposals, approval queue | fake, llm-backed | draft |
| [services.md](services.md) | The container `useServices()` returns | composition root | draft |
