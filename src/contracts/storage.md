---
contract: Storage
status: draft
owner: TBD
reviewer: integrator
used_by: [settings, dashboard (layout), assistant (approval queue), data-generator]
implementations: [memory, local (device storage)]
---

# Storage

## Purpose
Keep data on the device between sessions: settings, the dashboard layout, the approval queue, generated transactions, category corrections. Nothing leaves the device.

## Operations
- **get(key) -> value | null**
- **set(key, value) -> void**
- **remove(key) -> void**
- **keys(prefix?) -> string[]**
- Values are JSON-serialisable. Keys are namespaced: `<feature>/<name>`, e.g. `dashboard/layout`.

## Rules
1. `get` after `set` returns an equal value (deep equality).
2. `get` of a missing key returns `null`, never throws.
3. Keys from different namespaces never collide.
4. No network access, no logging of values.

## Fake behaviour
`memory`: an in-memory map, empty at start, lost on reload. Used in tests and as the default offline fake.

## Contract tests
- Round trip set/get, remove, missing key, prefix listing, values are copies (mutating the returned object does not change storage).

## Requirements to fill in
- [ ] Which keys exist (list them here with owner feature).
- [ ] Do we need "delete all my data" in the MVP?
- [ ] Encryption on Android: rely on device encryption, or a plugin?

## Open questions
- Which Capacitor storage plugin for the `local` adapter (decide with a decision record).
