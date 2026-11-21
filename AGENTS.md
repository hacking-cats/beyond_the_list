# AGENTS.md

Rules for every AI agent and every person working in this repo. Short on purpose; anything that must always hold belongs in CI.

## The project in one paragraph

Transaction insight app for migrants, refugees and low-income users of PostFinance in Switzerland (limited German, older Android phones). One main layout (header with hamburger, drawer generated from a feature registry) and pages: Dashboard, Movements, AI chat, Savings, Investment ideas, plus a dummy data generator. Suspicious-payment alerts show on the dashboard and as notifications. Out of MVP: live bank connection, receipt upload.

## Stack

Vue 3 + Quasar v2 (Quasar CLI with Vite), `<script setup lang="ts">`, TypeScript strict, Pinia (UI state only), Vue Router in hash mode, vue-i18n (en, de; RTL-ready), Vitest + @vue/test-utils, Android via Capacitor. No other UI library or CSS framework. Ask before adding a chart library.

## Commands

Not available yet (the Quasar app is created in the next issue). Will be: install, dev, test, build.

## Architecture rules

- Depend on `src/contracts/`, never on a concrete adapter. Pages, components and stores get services through `useServices()`; they never import from `src/adapters/`.
- `src/boot/services.ts` is the only composition root; it picks one implementation per contract and provides it with `app.provide()`.
- Every contract has a fake adapter that works offline, and a contract test suite in `tests/contracts/` that every implementation must pass.
- Every number comes from a pure engine in `src/engines/`. The LLM only puts facts into words.
- Money is an integer number of Rappen (`amountRappen`), never a float. Shown Swiss style: `CHF 1'234.50`.
- Do not edit `src/contracts/` inside a feature. A contract change is its own pull request with the label `contract-change`.
- Stay inside the folder the issue names.
- Shared files are append-only (feature registry, composition root, content JSON, shared i18n): add your line, do not reorder or reformat.

## In-app AI rules

1. Numbers come from engines; the AI only puts facts into words.
2. Send the model summaries, never raw transactions, account ids or personal details.
3. The AI always asks before acting: proposals appear as Yes/No cards in an approval queue.
4. Investment suggestions are ideas, not advice, with the official PostFinance link; never invent products.
5. The app works fully offline with the fake LLM and the fake assistant.

## Definition of done

- Lint, type-check, unit and contract tests pass; CI green.
- New strings exist in `en-US` and `de`.
- The module README is updated (see `docs/templates/module-readme.md`).
- Screenshot in the PR for UI changes; label `ai-assisted` if mostly generated.
- No secrets, no API keys in the app, no real user data. Real challenge CSVs never go into the repo.

## Git rules

One issue, one branch (`feat/<issue>-<slug>`), one pull request to `main`. Never push to `main`. Conventional Commits in English.

## Stop and ask a human when

A contract seems wrong or incomplete, the scope grows, or a test would have to be deleted.
