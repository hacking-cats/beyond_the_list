# Features

One folder per page. Each page declares itself in the feature registry (`registry.ts`, append-only; spec in [`src/contracts/feature-registry.md`](../contracts/feature-registry.md)) and gets services only through `useServices()`.

| Folder | Page |
|---|---|
| `dashboard/` | Dashboard (tab "Overview") |
| `movements/` | Movements (tab "Explained") |
| `chat/` | AI chat (disabled) |
| `savings/` | Savings |
| `invest/` | Investment ideas (disabled) |
| `data-generator/` | Dummy data generator (disabled) |
| `coming-up/` | Coming up: bills and deadlines ahead |
| `my-future/` | My future: pension and taxes later in life |
