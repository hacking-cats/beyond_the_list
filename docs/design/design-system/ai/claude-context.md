# Claude context (building the app)

You are helping build the app as one HTML file with plain JavaScript (B1). No framework, no build step.

## Put into the one file
- Inside `<style>`: the contents of `tokens.css`, then `components.css`. Do not link them as separate files.
- First thing inside `<body>`: the contents of `icons.svg` (an SVG sprite). Use icons as `<svg class="icon" aria-hidden="true"><use href="#i-bulb"/></svg>`.
- Optionally the Inter font from Google Fonts; without a network the system font takes over.

## Markup
Copy the markup of each component from `preview.html`. Every class used there is defined in `components.css`. Classes for state: `.is-open` (sheet, backdrop), `.is-on` (time jump), `aria-pressed="true"` (chip).

## Data
- Load `facts_2025-09-23.json` at start; the time jump loads `facts_2025-12-23.json`.
- Render `lines[]` as statement lines grouped by `date`. Use `marker` and `tone` for the flag icon.
- On tap, render `answer`: `what`, `picture[]`, `worth_knowing`, `wit`, `questions[]`, and for action lines `opening` and `buttons`.
- Show all texts exactly as they are. Do not write or rephrase explanations.

## Behaviour
- Suggested questions: show `questions[].a` instantly. At most two steps deep.
- Typed questions: POST to the server function on Vercel (A6). The API key is never in the page. Loading and error texts are in `foundations/tone.md`.
- Sheet: opens with `.is-open`, closes on the close button, the backdrop, Escape and swipe down; focus moves in and back.
- Time jump: show `.jump.is-on` for 1.5 s or until tapped, then switch data and the header date.

## Don't
Add colours, fonts, spacing values, screens or charts. Navigation is the bottom tab bar only (decision 0003); no hamburger menu or drawer. Use any bank's name or logo.
