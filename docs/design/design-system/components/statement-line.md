# Statement line

One transaction in the list. The whole line is a button that opens the answer sheet.

## Anatomy
- Left: merchant (body, text.primary, one line, truncated) and below it the original line name (caption, text.muted, truncated).
- Right: amount (body, `.amount`). Debits `−1'820.00`, credits `+7'464.00` in successText.
- Marker (if `marker` is true): lightbulb icon 20px in petrol before the amount, accessible label "Worth a look".
- Tone (if `tone` is attention or action): the tone icon replaces the lightbulb.

## Rules
- Minimum height 56px; 1px border.default divider between lines.
- Lines are grouped by day with an overline heading: "TUESDAY, 23 SEPTEMBER 2025".
- Pressed state: surface.subtle background.
- Data: `facts.json` → `lines[]` (`merchant`, `original_name`, `amount`, `marker`, `tone`).
