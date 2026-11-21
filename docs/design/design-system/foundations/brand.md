# Brand direction

The product should feel trustworthy, calm, clear and human. It explains money without lecturing.

## Visual principles

- Generous white space; clarity over decoration.
- One primary action per screen.
- Colour supports hierarchy and state, never decorates.
- Financial information stays scannable: amounts right-aligned, tabular numbers.

## Palette roles

- **Yellow:** the primary button. Nothing else.
- **Petrol:** links, secondary buttons, question chips, the "worth a look" marker, the time-jump screen.
- **Grapefruit:** the action-needed tone (border and icon). Its text colour is `urgentText`.
- **Light blue:** decorative accents only.
- **Graphite:** all body text.

## Spending groups in charts (PostFinance palette)

Only spending that could be cut back is alarming, so only it gets the alert colour; essentials stay calm.

| Group | Colour | Text or icon on it |
|---|---|---|
| Essentials - recurring | Petrol `#005C66` | white |
| Essentials - non-recurring | Light petrol `#CCDBDE` (token `--petrol-light`), 1px petrol outline (1.4:1 on white) | graphite |
| Could cut back | Grapefruit `#FF5A36` | graphite |

Only PostFinance colours (light petrol is a tint of petrol). Checked for colour blindness: all three stay apart. When a "could cut back" category is selected, its detail uses the action tone (grapefruit), matching the bubble.

Every bubble also has a label or icon, and the list below groups the same categories under the group names, so colour is never the only cue.

No logos, product names or brand assets of any bank. The header shows a "Prototype · demo data" chip.

Exception (Alvaro, 2026-11-21): for the PostFinance challenge demo, the favicon and app icons use the PostFinance mark supplied by the team, and the logo files live in `public/brand/`. Inside the app screens the rule above still holds.
