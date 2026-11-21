# AGENTS.md

Rules for every AI agent and every person working in this repo. Short on purpose; anything that must always hold belongs in CI.

## The project in one paragraph

Transaction insight app for migrants, refugees and low-income users of PostFinance in Switzerland (limited German, older Android phones). One main layout (header, the page, and a bottom tab bar with icons generated from a feature registry; see decision 0003) and pages: Dashboard, Movements, AI chat, Savings, Investment ideas, plus a dummy data generator. Suspicious-payment alerts show on the dashboard and as notifications. Out of MVP: live bank connection, receipt upload.

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
- No secrets, no API keys in the app, no real user data. Dummy CSVs in the challenge format live only in `data/dummy/` (see its README); every other CSV stays git-ignored, and real bank exports never go into the repo.

## Git rules (MUST, no exceptions)

1. **Every change reaches `main` through a pull request.** No direct commits or pushes to `main`, by people or agents, not even for a one-line fix, a README or a merge.
2. Before the first commit, check the current branch. If it is `main`, create a branch first: `git switch -c feat/<issue>-<slug>`.
3. One issue, one branch, one pull request to `main`. Conventional Commits in English.
4. Agents never merge their own pull request; a human reviews and merges.
5. If a rule above blocks you, stop and ask a human. Never bypass it (no `--no-verify`, no force-push to `main`, no disabling hooks).

How it is enforced:
- **GitHub branch protection on `main`** (the real enforcement): require a pull request with one approval and passing checks, block force-pushes and deletion. Set in repo Settings → Branches by a repo admin.
- **Git hook** `.githooks/pre-push` refuses pushes to `main`. Enable once per clone: `git config core.hooksPath .githooks`.
- **Claude Code hook** in `.claude/settings.json` blocks `git commit` on `main` and `git push` to `main` for Claude sessions.

## Stop and ask a human when

A contract seems wrong or incomplete, the scope grows, or a test would have to be deleted.
