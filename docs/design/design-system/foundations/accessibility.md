# Accessibility

Target: WCAG 2.2 AA. Text needs 4.5:1, icons and borders 3:1.

## Measured contrast

| Colour | On white | On subtle | Use |
|---|---:|---:|---|
| text.primary #10201F on yellow | 11.1 | – | primary button label |
| petrol #004B5A on yellow | 6.4 | – | header (logo wordmark, language picker) |
| text.secondary #4A5A5C | 7.2 | 6.6 | secondary text |
| text.muted #616F70 | ≥4.6 | ≥4.6 | captions, original line names |
| petrol #004B5A | 9.7 | 8.9 | links, chips, marker |
| successText #1B7F4B | 5.0 | 4.6 | positive amounts |
| warningText #946219 | ≥4.6 | ≥4.6 | attention heading |
| infoText #266BC7 | ≥4.6 | ≥4.6 | "Worth knowing" heading |
| urgentText #BC4227 | ≥4.7 | ≥4.7 | action heading |
| grapefruit #FF5A36 | 3.1 | – | action border and icon only |
| red #D80A09 (white on it) | 5.3 | – | could-cut-back spending in charts |
| light teal #70BFC2 | 2.1 | – | non-recurring essentials in charts, with petrol outline; graphite on it 7.9 |
| yellow #FFCC00 | 1.5 | – | never text or icon |
| light blue #7FD1E8 | 1.7 | – | decorative only |

Darker text colours also pass on the three tints (attention, action, info).

## Rules

- State is never colour alone: every tone has its own icon and a text heading.
- The "worth a look" marker has an accessible label, not just an icon.
- Visible focus ring: 2px petrol outline, 2px offset.
- Semantic HTML: the statement is a list of buttons; the sheet is a dialog with a close button and Escape to close.
- Body text at least 16px; nothing below 12px.
