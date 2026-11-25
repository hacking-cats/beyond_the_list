# Brand direction

The product should feel trustworthy, calm, clear and human. It explains money without lecturing.

## Visual principles

- Generous white space; clarity over decoration.
- One primary action per screen.
- Colour supports hierarchy and state, never decorates.
- Financial information stays scannable: amounts right-aligned, tabular numbers.

## Palette roles

- **Yellow:** the primary button and the app header behind the PostFinance logo. Nothing else.
- **Petrol:** links, secondary buttons, question chips, the "worth a look" marker, the time-jump screen.
- **Grapefruit:** the action-needed tone (border and icon). Its text colour is `urgentText`.
- **Light blue:** decorative accents only.
- **Graphite:** all body text.

## Spending groups in charts (PostFinance palette)

Only spending that could be cut back is alarming, so only it gets the alert colour; essentials stay calm.

| Group | Colour | Text or icon on it |
|---|---|---|
| Essentials - recurring | Petrol `#004B5A` | white |
| Essentials - non-recurring | Light teal `#70BFC2` (token `--petrol-light`), 1px petrol outline (2.1:1 on white) | graphite |
| Could cut back | PostFinance red `#D80A09` (token `--red`) | white |

Only PostFinance colours, taken from the PostFinance app and its spending analysis (petrol, light teal, alert red). Checked for colour blindness: all three stay apart. When a "could cut back" category is selected, its detail uses the action tone.

Every bubble also has a label or icon, and the list below groups the same categories under the group names, so colour is never the only cue.

## Logo

For the PostFinance challenge, the app uses the PostFinance brand assets supplied by the team (files in `public/brand/`):

- The favicon and app icons use the PostFinance mark.
- The app header shows the PostFinance logo (`postfinance-logo-600.png`, 40px high) on a PostFinance yellow bar, as on postfinance.ch. The app name "Beyond the List" stays in the heading for screen readers.
- Use only the supplied files, unchanged (no recolouring, stretching or cropping). No logos of any other bank.

History: until 2026-11-25 logos were not allowed inside app screens (exception for icons by Alvaro, 2026-11-21). The team changed this for the demo.
