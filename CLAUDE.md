@AGENTS.md

## Claude-only notes

- **Always a pull request.** Never commit on `main` and never push to `main`. Check the branch before committing; if it is `main`, create `feat/<issue>-<slug>` first. Open a PR for every change and leave the merge to a human. The hook in `.claude/settings.json` blocks violations; if it blocks you, stop and ask, never work around it.
- Before writing code for a contract, read its spec in `src/contracts/<name>.md`. If `status` is not `frozen`, ask before implementing.
- If unsure about a Quasar API, say so and point to quasar.dev instead of guessing.
- CSVs: only dummy data in challenge format, only in `data/dummy/`. Never commit a real bank export; if unsure whether a CSV is dummy, ask.
