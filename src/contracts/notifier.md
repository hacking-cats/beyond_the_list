---
contract: Notifier
status: draft
owner: TBD
reviewer: integrator
used_by: [alerts on dashboard, assistant]
implementations: [console (fake), in-app (Quasar Notify), push (Capacitor local notifications)]
---

# Notifier

## Purpose
Tell the user something happened, for example a suspicious payment, without the caller knowing whether it shows as an in-app banner or a phone notification.

## Operations
- **notify(message) -> void**
  - message: `{ kind: "alert" | "info" | "reminder", titleKey: string, bodyKey: string, params?: object, link?: route }`
- **requestPermission() -> "granted" | "denied"**

## Rules
1. Texts are i18n keys, never hard-coded text.
2. Lock-screen notifications never show amounts or balances.
3. Calling `notify` without permission does not throw.

## Fake behaviour
`console`: records messages in a list (readable in tests) and logs the keys.

## Contract tests
- notify records/shows the message; no amounts in title or body params for `push`; denied permission is handled.

## Requirements to fill in
- [ ] Which events notify: suspicious payment only, or also payday and bills?
- [ ] Does tapping a notification open the alert on the dashboard?

## Open questions
- None yet.
