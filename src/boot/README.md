# boot

`services.ts` (to be created) is the composition root: it builds the `Services` object (spec: [`src/contracts/services.md`](../contracts/services.md)) choosing one implementation per contract from config, and provides it with `app.provide()`. Shared, append-only: one line per contract.
