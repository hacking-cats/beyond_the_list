# 0007. Explained becomes the tap-a-line module from the "Beyond the List" prototype

- **Date:** 2026-11-21
- **Status:** proposed

## Context
A separate prototype, "Beyond the List" ("Tap any line, see what it means"), was built outside this repo: one HTML file with plain JavaScript, a Python facts layer (`build_facts.py`) that computes every number in advance, all texts in one `content.json`, English only, no bank branding, and a 7-tap demo on the original Jeanine data. Its features: 8 line types with explanations, markers (lightbulb, triangle, octagon), three tones, a Highlights strip, Yes/No actions on suspicious lines ("What happened?", freeze card, message to the bank), suggested follow-up questions and a time jump between two demo dates.

The Explained tab (`src/features/movements`) already has the same idea in a simpler form: explanations per category for the newest month. This decision brings the prototype in as that module, following the repo's rules where the two differ.

## Decision
1. **Where:** the module is the Explained tab, `src/features/movements`. Its per-category explanations are replaced by the prototype's 8 line-type explanations.
2. **Data:** Jeanine as a single mother (`data/dummy/jeanine_singlemom_2025_*`), the app's source of truth. The prototype's rules are not tied to a persona. Demo dates stay 23 September and 23 December 2025 (her salary comes on the 23rd; the 13th salary on 23 December). The prototype's unified CSV is not added: the ingest engine produces the same rows.
3. **Architecture:** the facts layer is ported from Python to pure TypeScript engines in `src/engines/explain/` with a `SPEC.md` and tests (line types, markers and tones, identical charges, salary cycles, card bills, relatives of a line). No precomputed facts files. Pages read the engines directly, as in decision 0004.
4. **Look:** minimal visual change. Same design system and class names; the missing styles (Highlights strip, answer sheet, time jump) are appended to `src/css/components.css`; the three marker icons are added next to the Material icons. The module sits under the app header and above the tab bar. The time jump changes the app's demo date, so the header matches the tab.
5. **Languages:** the repo's rule, not the prototype's English-only rule: every ready locale (en-US, de, ar, fr, it, uk) gets every text, as `src/i18n/messages.test.ts` requires. Templates use vue-i18n interpolation and plurals. Translated wit needs a native speaker's check before the demo.
6. **Branding:** the repo's (PostFinance, `public/brand/`). The prototype's "no bank logo or name" rule does not apply.
7. **AI (to confirm):** the `llm-provider` and `assistant` contracts are draft, so no contract is implemented (as in decision 0004). Suggested questions and their answers work fully offline. A typed question gets the prototype's offline answer ("Couldn't reach the assistant…" followed by what the statement shows) until the contracts are frozen and `proxy/` exists.
8. **Rules kept:** line types, markers, tones, Highlights, actions and statuses work as in the prototype, with its thresholds as shares of income. Single small charges still get no marker (prototype rule L5); the interface stays frozen (prototype rule D10).
9. **One addition, a growth pattern (prototype rule P8):** the salary line ("how the last cycle ended") and the card bill line ("what it is made of") also show what grew compared with the user's own earlier salary cycles, grouped by category (for example games, streaming), with a threshold as a share of income set in the engine spec. One extra follow-up question ("How has this grown?") and the gain sentence of prototype rule P10 (review small subscriptions once a year). No new marker, tone or screen. This is a pattern on a natural line, not a conversation about a category, so prototype rule P4 still holds.
10. **Demo path (new):**
    - 23 September: the salary (how the cycle ended, what grew) → the card bill (what it is made of) → a Roblox line (total so far this year).
    - Jump: "Three months later".
    - 23 December: a streaming line (the newest service) → the triangle on the identical Fortnite charges of 13 December → No → "I didn't make this" → Freeze card → the 13th salary as the closing line.
    - The card is frozen only after the jump, so no purchases appear after it.
11. **Serious tone:** with this persona no case reaches "Action needed", so the serious tone and the octagon row do not appear in the demo. Accepted: her case is spending that creeps up, not fraud.

## Consequences
- Follow-up pull requests, one each: design system sync (including `highlights-strip.md`); `engines/explain` with its spec and tests; texts in all locales; the Explained UI with the module README updated.
- The prototype's own decisions page is out of date on: English only (D1), no bank branding (A7), one HTML file (B1), the demo path (D3) and the module boundary (O2).
- Exact numbers for the demo (cycle totals, growth, counts) come from `engines/explain` once it exists, not from this page.
- Open: point 7 needs the integrator's confirmation; whether the prototype's single file is also kept as a stage fallback (like `public/v1/`).
