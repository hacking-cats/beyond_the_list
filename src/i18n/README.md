# i18n

vue-i18n messages for `en-US` and `de`, RTL-ready. No hard-coded user-facing text anywhere.

To avoid merge conflicts, each feature gets its own file per locale (`<locale>/<feature>.ts`), and `<locale>/index.ts` only imports them (append-only, one line per feature). Keys: `features.<feature>.<key>`, `common.<key>`.
