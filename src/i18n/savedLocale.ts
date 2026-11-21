/**
 * Remembers the chosen language on this device and applies it to the page (lang and dir).
 * TEMPORARY: uses localStorage directly because the Storage contract (src/contracts/storage.md)
 * is still draft. Once it is frozen, move this behind useServices().storage.
 */
import { DEFAULT_LOCALE, findLanguage } from './languages';

const KEY = 'btl.locale';

export function loadLocale(): string {
  try {
    const saved = globalThis.localStorage?.getItem(KEY);
    if (saved && findLanguage(saved)?.ready) return saved;
  } catch {
    // Storage blocked (private mode, sandboxed frame): fall back to the default.
  }
  return DEFAULT_LOCALE;
}

export function saveLocale(code: string): void {
  try {
    globalThis.localStorage?.setItem(KEY, code);
  } catch {
    // Not saved; the app still works in the chosen language until it is closed.
  }
}

/** Sets <html lang> and <html dir> so right-to-left languages flip the layout. */
export function applyLocaleToDocument(code: string): void {
  if (typeof document === 'undefined') return;
  const rtl = findLanguage(code)?.rtl ?? false;
  document.documentElement.lang = code;
  document.documentElement.dir = rtl ? 'rtl' : 'ltr';
}
