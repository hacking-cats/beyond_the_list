---
contract: DashboardLayout
status: draft
owner: TBD (design + dashboard developer)
reviewer: integrator
used_by: [dashboard, assistant (edit-dashboard proposals), storage]
implementations: []
---

# DashboardLayout (data type)

## Purpose
The dashboard is data: a JSON list of widgets. The user reshapes it by asking the AI, which edits this JSON (as a proposal), never code.

## Data types
```
DashboardLayout = { version: 1, widgets: Widget[] }
Widget = { id: string, type: WidgetType, size: "small" | "full", params: object }
```
`WidgetType` comes from a fixed list; each type declares which params it accepts.

## Rules
1. Unknown widget types or params are rejected by a validator, never rendered.
2. The layout contains no money figures; widgets ask engines for them.
3. Stored under `dashboard/layout`; a default layout exists.

## Fake behaviour
Default layout: safe to spend until payday, spending by category this month, next big dates (payday, rent), suspicious-payment alerts.

## Contract tests
- Default layout passes the validator; a layout with an unknown type fails.

## Requirements to fill in
- [ ] The widget list for the MVP, with params per widget.
- [ ] Which "important dates" exist (payday, rent, insurance, ...).
- [ ] Ordering only, or also sizes and periods?

## Open questions
- Chart library for widgets (ask the team before adding one).
