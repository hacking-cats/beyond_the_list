# Answer sheet

Bottom sheet that explains one line (decision P8). Opens on tap, up to 85% of the screen height, scrolls inside.

## Anatomy, top to bottom
1. Drag handle and close button (44px, top right).
2. Header: merchant (subtitle), amount (title, `.amount`), date and type label (caption).
3. Tone block, if the line has attention or action tone (see `tone-block.md`).
4. **What it is** (body): `answer.what`.
5. **Your picture** (body, one paragraph per item): `answer.picture[]`; hidden if empty.
6. **Worth knowing**: info tint block, info icon and heading in infoText, body text: `answer.worth_knowing`.
7. Wit line (wit style, italic): `answer.wit`; hidden if null.
8. Question chips (see `question-chips.md`) and the "Ask about this line" input.

## Rules
- White surface, radius lg on top corners, shadow sheet; the statement behind is dimmed.
- Opens and closes in 200ms; Escape, swipe down and the close button close it.
- Focus moves into the sheet on open and back to the line on close.
