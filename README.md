# Beyond the List

**Team hacking-cats · PostFinance challenge "Beyond the List"**

A bank statement is a list of cryptic lines: *Kreditkarten-Zahlung*, *Akonto*, *Salärzahlung*, a card bill that hides 28 purchases. For someone who has just arrived in Switzerland, reads little German and lives close to the limit, that list says almost nothing. **Beyond the List** turns it into answers: where the money goes, what each line means, where money could be found, what is coming up, and when something looks wrong.

**Try it:** https://hacking-cats.github.io/beyond_the_list/ (rebuilt from `main` on every merge)

---

## Who it is for

- **Migrants, refugees and people on low incomes** who bank with PostFinance.
- People with **limited German**: the app speaks English, German, French, Italian, Arabic (right to left) and Ukrainian.
- People on **older Android phones**: it is built phone first, works offline, and needs no account or server for its core features.

The demo follows **Jeanine**, a made-up single mother in Bern with two children and one salary near the minimum wage. Without her knowing, her children use her saved card for streaming services and in-game purchases. All her data is invented, in the challenge's CSV format.

## What you can do in the app

The app has five tabs at the bottom of the screen, plus a chat you pull down from the top.

| Tab | What it shows |
|---|---|
| **Overview** | Your balance, and one bubble per spending category (bigger bubble, more money). It opens on **Recommended savings**: only spending you could cut back. Tap a bubble for its share of your income and a tip. |
| **Explained** | Your payments from the last month of your statements. Tap any line to see what it means in plain words. |
| **Savings** | A limit for the children's game purchases (toggle and slider). Savings ideas found in your own payments, shown as round buttons that open when tapped. A free appointment with a PostFinance specialist, and your savings plan. |
| **Coming up** | Your savings goal (emergency fund, holiday, your own project), and what is due soon: the health insurance deadline, help with premiums, taxes, the yearly Serafe bill. |
| **My future** | State pension (AHV) and private retirement (pillar 3a), explained for someone with a salary. |
| **finAInce** (pull the header down) | A chat buddy: ask about your money in your own words. |

Not in this version: a live bank connection, and receipt upload.

---

## How the repository is built, and why

Each choice below gives the decision, where it lives in the repo, and the reason behind it. The formal decision records are in [`docs/architecture/decisions/`](docs/architecture/decisions/).

### 1. One codebase, a website and an Android app
- **Decision:** Vue 3 + Quasar v2 (Vite), TypeScript strict; Android through Capacitor. ([decision 0001](docs/architecture/decisions/0001-stack-and-composition-root.md))
- **Where:** [`quasar.config.ts`](quasar.config.ts), [`src/`](src/), the router in [`src/router/`](src/router/) (hash mode).
- **Why:** the same code is the GitHub Pages demo and the APK. Hash mode means Pages never needs a server-side fallback.

### 2. Pages plug into one layout through a registry
- **Decision:** every page is a folder in `src/features/<name>/` and adds one line to the feature registry. The single layout builds the bottom tab bar from it, with icons only and an accessible name for each. ([decisions 0002](docs/architecture/decisions/0002-klar-v2-first-app.md) and [0003](docs/architecture/decisions/0003-bottom-tab-bar.md))
- **Where:** [`src/features/registry.ts`](src/features/registry.ts), [`src/layouts/MainLayout.vue`](src/layouts/MainLayout.vue).
- **Why:**
  - A bottom bar keeps all five pages one tap away, and icons work even with little reading.
  - A new page never touches the others.
  - Pages that are not ready (AI chat page, Investment ideas, Data generator) stay registered but switched off.

### 3. Contracts first, implementations behind them
- **Decision:** the team agrees on each interface as a plain-text spec before anyone writes code. A spec goes from `draft` to `review` to `frozen`. Only a frozen spec becomes a TypeScript interface, with a fake adapter and a test suite that every implementation must pass.
- **Where:** [`src/contracts/`](src/contracts/) (specs `*.md`, interfaces `*.ts`), [`src/adapters/<contract>/`](src/adapters/), [`tests/contracts/`](tests/contracts/).
- **Why:**
  - Several people and AI agents work in parallel without breaking each other.
  - Any piece, such as the transaction source, the AI model or the storage, can be swapped later.

### 4. One place decides which implementation runs
- **Decision:** pages ask for services through `useServices()` and never import an adapter. One boot file picks the implementation for each contract.
- **Where:** [`src/boot/services.ts`](src/boot/services.ts) (the only composition root), [`src/composables/useServices.ts`](src/composables/useServices.ts).
- **Why:** switching from the offline fake to a real backend is one line in one file. Today that choice is the finAInce chat: it uses the team's chat backend when `FINAINCE_CHAT_URL` is set at build time, and the offline fake when it is not.

### 5. Every number comes from a pure engine
- **Decision:** all calculations are pure functions: plain data in, plain data out, no I/O, each with a spec and unit tests. The AI never calculates; it only puts engine facts into words.
- **Where:** [`src/engines/`](src/engines/), one folder per area:
  - `ingest`: reads the CSV, merges the accounts.
  - `categorize`: assigns each payment a category.
  - `insights`: monthly totals, category shares, balance.
  - `savings`: goal plan, cheaper alternatives, spending cap.
  - `invest`: matches PostFinance products.
  - `advice`: specialist appointment times, calendar file.
  - `alerts` and `report`: specs only, so far.
- **Why:** numbers about someone's money have to be right and checkable. A pure function can be tested with known answers, and the same facts reach every screen and the AI.

### 6. Money is an integer number of Rappen
- **Decision:** amounts are stored as whole Rappen (`amountRappen`), never as floating-point francs, and shown Swiss style (`1'234.50 CHF`).
- **Where:** [`src/shared/money.ts`](src/shared/money.ts), the only place that formats money.
- **Why:** with floats, 0.10 + 0.20 is not 0.30. Whole Rappen add up exactly.

### 7. Knowledge is data, not code
- **Decision:** categories, merchant rules, cheaper alternatives, PostFinance products and official links live in JSON files that people can edit without touching code.
- **Where:** [`content/`](content/) (`categories.json`, `merchants.json`, `alternatives.json`, `invest-products.json`, `postfinance-links.json`).
- **Why:** prices and products change, and someone who knows the domain should be able to correct a ZVV price or add a merchant in a pull request without reading TypeScript. Assumptions are marked `assumption:` in the files so they get checked.

### 8. Demo data in the real challenge format
- **Decision:** the app reads made-up CSV files in the exact format of the challenge's bank exports, bundled with the app. The balance is computed from the rows. ([decisions 0004](docs/architecture/decisions/0004-app-reads-dummy-csvs.md), [0005](docs/architecture/decisions/0005-balance-from-rows.md) and [0006](docs/architecture/decisions/0006-balance-without-since-note.md))
- **Where:**
  - [`data/dummy/`](data/dummy/): Jeanine as a single mother is the app's data. The original Jeanine is used by tests, and Andrés, a second persona, is kept for later.
  - [`src/shared/transactions.ts`](src/shared/transactions.ts): turns the files into transactions through the engines.
- **Why:**
  - Code built on the real format works with real exports later.
  - A fixed, invented year of data gives tests known answers and keeps real customer data out of the repo.

### 9. Six languages from day one, right to left included
- **Decision:** every text exists in English, German, French, Italian, Arabic and Ukrainian, split into one file per feature. A test fails if any language is missing a key.
- **Where:**
  - [`src/i18n/<language>/`](src/i18n/): the texts.
  - [`src/i18n/languages.ts`](src/i18n/languages.ts): which languages exist.
  - [`src/i18n/messages.test.ts`](src/i18n/messages.test.ts): the completeness check.
  - [`postcss.config.js`](postcss.config.js): right-to-left layout through `postcss-rtlcss`.
- **Why:** the people this app is for often do not read German well. One file per feature means two people never edit the same file at once.

### 10. One design system, icons that work offline
- **Decision:** colours, spacing and components come from the team design system. Icons are Material SVGs bundled into the app, with no icon font and no download.
- **Where:**
  - [`docs/design/design-system/`](docs/design/design-system/): the source.
  - [`src/css/`](src/css/) (`tokens.css`, `components.css`, `app.css`): the styles in the app.
  - [`src/shared/ui/icons.ts`](src/shared/ui/icons.ts): the icon list.
- **Why:**
  - The app looks the same everywhere and stays light on older phones.
  - Every icon still shows with a weak connection.

### 11. AI with guard rails
- **Decision:**
  - The AI only puts facts into words.
  - It gets summaries, never raw transactions, account ids or personal details.
  - It asks before acting, with Yes/No cards in an approval queue.
  - Investment ideas are ideas, not advice, and always link to PostFinance.
  - The app works fully offline with a fake AI.
- **Where:**
  - [`src/layouts/buddy/`](src/layouts/buddy/): the finAInce chat.
  - [`src/adapters/assistant/`](src/adapters/assistant/): the `http` adapter sends only the question text; the `fake` adapter works offline.
  - [`src/agent/`](src/agent/): prompts and the approval queue (planned).
  - [`proxy/`](proxy/): the one place that will hold the AI key (planned).
- **Why:**
  - Money advice must not be invented.
  - No API key may ever ship inside the app.

### 12. Every change goes through a pull request
- **Decision:**
  - Nobody pushes to `main`.
  - One issue, one branch, one pull request.
  - Checks must pass, and a human merges.
  - A contract change is its own pull request.
- **Where:**
  - [`AGENTS.md`](AGENTS.md) and [`CLAUDE.md`](CLAUDE.md): rules for people and AI agents.
  - [`.githooks/pre-push`](.githooks/pre-push) and [`.claude/settings.json`](.claude/settings.json): block pushes to `main`.
  - [`.github/workflows/ci.yml`](.github/workflows/ci.yml): lint, type check, tests, build.
  - [`.github/workflows/pages.yml`](.github/workflows/pages.yml): deploys `main` to GitHub Pages.
- **Why:** many people and agents work on the code at the same time during a hackathon. Reviews and automatic checks keep `main` working for the demo.

---

## Folder map

```
beyond_the_list/
├── src/
│   ├── features/      one folder per page + registry.ts (2)
│   ├── layouts/       the single layout, bottom tab bar, language picker, finAInce buddy (2, 11)
│   ├── contracts/     agreed interfaces: specs (.md) and, once frozen, TypeScript (.ts) (3)
│   ├── adapters/      implementations of the contracts, always a fake one (3, 4)
│   ├── boot/          services.ts = the only composition root; i18n setup (4, 9)
│   ├── composables/   useServices() (4)
│   ├── engines/       pure, tested functions for every number (5)
│   ├── shared/        money formatting, loading the demo data, icons (6, 8, 10)
│   ├── i18n/          texts in six languages, one file per feature (9)
│   ├── css/           design tokens and components (10)
│   ├── agent/         prompts and approval queue for the AI (planned) (11)
│   └── router/        hash-mode routes from the registry (1, 2)
├── content/           editable knowledge: categories, merchants, alternatives, products, links (7)
├── data/dummy/        invented bank statements in the challenge CSV format (8)
├── tests/             contract test suites and small fixtures (3)
├── proxy/             serverless function that will hold the AI key (planned) (11)
├── public/            icons, brand files, the V1 prototype served at /v1/
├── docs/
│   ├── architecture/  overview and numbered decision records
│   ├── design/        the design system (tokens, components, accessibility, tone)
│   ├── product/ domain/  product notes and Swiss money knowledge
│   └── templates/     templates for contracts, engine specs, decisions, module READMEs
├── .github/workflows/ CI and GitHub Pages deploy (12)
├── .githooks/ .claude/  push protection for people and AI agents (12)
├── AGENTS.md CLAUDE.md  working rules (12)
└── quasar.config.ts   build settings: web, Android, base path, chat backend URL (1, 4)
```

The numbers in brackets point to the sections above. Most folders have their own README with the details for that part.

## Run it locally

You need Node 22 or newer.

```
npm install
npm run dev        # dev server, usually http://localhost:9000
npm test           # unit, engine and contract tests
npm run typecheck
npm run lint
npm run build      # web build in dist/spa
```

The finAInce chat calls the team's chat backend set in `quasar.config.ts`. Start with `FINAINCE_CHAT_URL= npm run dev` (empty value) to use the offline fake instead. GitHub Pages builds with `PUBLIC_PATH=/beyond_the_list/`; the workflow sets it for you.

## Contributing

1. Read [AGENTS.md](AGENTS.md). It is short on purpose.
2. After cloning, turn on the repo's git hooks once: `git config core.hooksPath .githooks`.
3. Branch from `main` (`feat/<issue>-<slug>`), open a pull request, and let a teammate review and merge.
4. A change is done when lint, type check and tests pass, new texts exist in every language, the module README is updated, and UI changes have a screenshot.

## Status

- The app runs entirely on invented data. Most contracts are still `draft`.
- Implemented so far: the assistant (offline fake and the chat backend) and the services container.
- Next steps:
  - Freeze the transaction contracts so the CSV loading moves behind `useServices()`.
  - Build the alerts engine for suspicious payments.
  - Decide on the new Explained tab design (decision 0007, proposed on a team branch).
