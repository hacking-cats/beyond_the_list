# 0001. Stack and composition root

- **Date:** 2026-11-21
- **Status:** accepted

## Context
The planning document compared Expo/React Native with a web app + Capacitor. Its folder tree also names `src/composition.ts` and `content/i18n/`.

## Decision
- Vue 3 + Quasar v2 (Quasar CLI with Vite), TypeScript strict; Android through Quasar's Capacitor mode. No iOS, Cordova or Electron.
- The composition root is the Quasar boot file `src/boot/services.ts` (replaces `src/composition.ts` from the planning doc).
- Translations live in `src/i18n/<locale>/` as Quasar generates them (replaces `content/i18n/`), split per feature to avoid merge conflicts.
- Pages live in `src/features/<feature>/` and register themselves in the feature registry.

## Consequences
The GitHub Pages demo and the Android APK are two build targets of the same code. Router uses hash mode for Pages.
