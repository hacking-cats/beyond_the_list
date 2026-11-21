# Feature: Investment ideas

- **Route:** `/invest` (disabled in the registry: no tab, see decision 0003). The ideas are shown as a section at the end of the **Savings** page.
- **Status:** real (product facts from postfinance.ch, checked 21 November 2026)
- **Services used (via useServices()):** none yet; planned: assistant (daily AI suggestion)
- **Engines used:** invest (`matchProducts`)
- **Content:** `content/invest-products.json`, `content/postfinance-links.json`

## What the user can do
At the end of Savings ("Want your savings to grow?"): see four PostFinance saving-plan products as ideas, not advice. Each card has a plain sentence, the minimum amount, the fees, and a button to the official postfinance.ch page in the user's language (en, de, fr, it; other app languages get the English page). Pillar 3a is hidden when the statements show no salary. A link compares all saving plans on postfinance.ch. Crypto is left out on purpose (target group: low incomes).

## Public API
`InvestIdeas.vue` (used by `SavingsPage.vue` and `InvestPage.vue`).

## How to test
`npm test` (`src/engines/invest/matchProducts.test.ts`: order, pillar 3a rule, link language, every link on postfinance.ch in 4 languages). Visual: `npm run dev`, open `#/savings`, scroll to the end.

## Known gaps
- Product facts (minimums, fees) are copied from postfinance.ch and must be re-checked before a demo; the date is shown in the app.
- Links open with `target="_blank"`; on Android (Capacitor) check that they open in the system browser.
- No daily AI suggestion yet.

## Requirements to fill in
- [x] Product list (from postfinance.ch; domain expert to confirm).
- [ ] Disclaimer wording (domain expert).
