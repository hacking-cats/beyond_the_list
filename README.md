# Beyond the List

PostFinance challenge "Beyond the List" by team **hacking-cats**: turn the plain transaction list into insight and guidance for migrants, refugees and people on low incomes in Switzerland. Phone first; web demo on GitHub Pages, then Android (Capacitor).

> Status: **skeleton**. This commit contains only the folder structure and the contracts written in plain text. No app code yet.

## How we work in this phase

1. Each contract in [`src/contracts/`](src/contracts/) is a Markdown spec with a **Requirements to fill in** section.
2. The owner of that part fills in the requirements (inputs, outputs, rules, examples) in a pull request.
3. Once the team agrees, the contract is marked `status: frozen` and an agent turns it into a TypeScript interface, a fake adapter and a contract test suite.

Read [AGENTS.md](AGENTS.md) for the rules every person and AI agent follows.

## Structure

| Folder | What lives there |
|---|---|
| `docs/` | Product, design, domain knowledge, architecture decisions, templates |
| `data/dummy/` | Dummy transaction CSVs in the challenge format (seed data for the data loader) |
| `content/` | Data, not code: categories, merchant aliases, cheaper alternatives, PostFinance products |
| `src/contracts/` | Interfaces (specs now, TypeScript later). Integrator owns them |
| `src/engines/` | Pure functions that compute every number. Plain data in, plain data out |
| `src/adapters/` | Implementations of the contracts. Every contract has a `fake` one |
| `src/agent/` | Prompts, tools and the approval queue for the in-app AI |
| `src/features/` | One folder per page, each declares itself in the feature registry |
| `src/layouts/` | The single main layout (header, hamburger, drawer from the registry) |
| `src/boot/services.ts` | Composition root: picks one implementation per contract |
| `src/i18n/` | English and German strings |
| `proxy/` | One serverless function that holds the LLM key |
| `tests/` | Contract test suites and small fixtures with known answers |

## Run

Not runnable yet. The Quasar app (Vue 3 + Quasar v2, Vite, TypeScript strict) is created in the next issue.

## Contributing

Every change reaches `main` through a pull request; see the Git rules in [AGENTS.md](AGENTS.md). After cloning, enable the repo's git hooks once:

```
git config core.hooksPath .githooks
```
