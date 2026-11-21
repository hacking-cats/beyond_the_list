# Question chips

Up to three suggested follow-up questions under each answer (P5, P6), then a free text input.

## Chip
- Pill radius, 1px petrol border, petrol text (bodySmall, weight 500), white background, min height 44px.
- Chips wrap onto several lines; never scroll sideways.
- Tap: the chip turns petrol with white text; the answer appears right below it.

## Answers
- Suggested questions already have their answer in `answer.questions[].a`: show it instantly, no loading state.
- Typed questions go to the live model (A5, A6): show "Looking at your lines…" in text.muted, then the answer.
- On error: "Couldn't reach the assistant. Here is what your statement shows." followed by `answer.picture`.
- Two steps deep at most: after the second answer, show no new chips.

## Input
- Label "Ask about this line", 1px border.strong, radius md, 44px high, send button in petrol.
