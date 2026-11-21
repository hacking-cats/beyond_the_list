# i18n

vue-i18n messages for `en-US`, `de`, `fr`, `it`, `ar` and `uk`, right-to-left ready. No hard-coded user-facing text anywhere.

To avoid merge conflicts, each feature gets its own file per locale (`<locale>/<feature>.ts`), and `<locale>/index.ts` only imports them (append-only, one line per feature). Keys: `features.<feature>.<key>`, `common.<key>`.

## Languages

- `languages.ts` lists every language the picker shows: `main` (English, Deutsch, Français, Italiano) and `other` (behind "Other language…", translated automatically). A language can be picked only when `ready: true`.
- The picker is `src/layouts/LanguagePicker.vue` (header button + bottom sheet).
- `savedLocale.ts` remembers the choice on the device (TEMPORARY: localStorage until the Storage contract is frozen) and sets `<html lang dir>`. `src/boot/i18n.ts` also switches Quasar's own language pack, so Quasar components know about right to left.
- Right to left: `postcss-rtlcss` (see `postcss.config.js`) flips all CSS when `<html dir="rtl">`. Show money with `displayChf()` (not `formatChf()`) in templates, so amounts keep their order inside Arabic text.

## Add a language

1. Copy `en-US/` to `<code>/` and translate every file (keep the keys).
2. Import it in `index.ts` (append one line).
3. In `languages.ts`, set `ready: true` (or append a new line). For a right-to-left language set `rtl: true`, and add Quasar's pack (`quasar/lang/<code>`) in `src/boot/i18n.ts` if one exists.
4. `npm test`: `messages.test.ts` fails if a key is missing or extra, or if a ready language has no messages.

Automatic translations (everything except en-US and de) should be checked by a native speaker before a real release.
