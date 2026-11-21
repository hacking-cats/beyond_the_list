# Architecture overview

```
pages / components (src/features, src/layouts)
        │  useServices()
        ▼
contracts (src/contracts)  ◄── implemented by ── adapters (src/adapters: fake, csv, claude, ...)
        │                                              ▲
        │                                              │ chosen once in
        ▼                                              │ src/boot/services.ts
engines (src/engines): pure functions computing every number
        │
        ▼
agent (src/agent): turns engine facts into words, proposes actions into the approval queue
```

- Contracts: see [`src/contracts/README.md`](../../src/contracts/README.md).
- Engines: see [`src/engines/README.md`](../../src/engines/README.md).
- Decisions: [`decisions/`](decisions/).
