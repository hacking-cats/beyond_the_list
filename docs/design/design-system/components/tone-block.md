# Tone block

Shown at the top of the answer sheet for attention and action lines (decisions T1–T3). Normal lines have no tone block.

## Attention
- Tint attention background, radius md, 12px padding.
- Triangle icon and heading "Worth a check" in warningText.
- Body: the attention sentence from `answer.picture[0]`.
- No wit, no buttons.

## Action needed
- Tint action background, 2px grapefruit border, radius md.
- Octagon icon in grapefruit; heading in urgentText: `answer.opening` ("Okay, no jokes this time.").
- Body: `answer.what`.
- Two buttons side by side, full width on narrow screens: primary "Yes, these are mine", secondary "Check with my bank" (`answer.buttons`).
- After a tap, the buttons are replaced by one confirmation line. "Check with my bank" is a placeholder in the demo (T6).
