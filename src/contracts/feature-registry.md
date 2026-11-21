---
contract: FeatureRegistry
status: draft
owner: integrator
reviewer: integrator
used_by: [layouts/MainLayout (drawer), router]
implementations: []
---

# FeatureRegistry (data type)

## Purpose
Each page declares itself once; the drawer menu and the routes are generated from the registry, so adding a page never needs a redesign.

## Data types
```
FeatureEntry = {
  key: string,            // "dashboard"
  route: string,          // "/dashboard"
  titleKey: string,       // i18n key, e.g. "features.dashboard.title"
  icon: string,           // Material icon name
  order: number,          // position in the drawer
  enabled: boolean        // false hides unfinished work on main
}
```

## Rules
1. Append-only: one line per feature in `src/features/registry.ts`; never reorder existing lines.
2. `key` and `route` are unique.
3. Disabled features have no route and no menu entry.

## Planned entries
dashboard, movements, chat, savings, invest, data-generator.

## Contract tests
- Keys and routes unique; every `titleKey` exists in en-US and de.

## Requirements to fill in
- [ ] Drawer order and icons (design).
- [ ] Is the data generator visible in the menu or only in a debug mode?
