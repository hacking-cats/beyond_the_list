/**
 * Languages the user can pick. `main` languages are shown directly in the language sheet;
 * `other` languages sit behind "Other language…" and are translated automatically.
 * A language is selectable only when `ready` (its messages exist in ./index.ts).
 *
 * Append-only: add a language as one line; set `ready: true` in the PR that adds its messages.
 */
export type LanguageGroup = 'main' | 'other';

export interface Language {
  /** vue-i18n locale code (key in ./index.ts). */
  code: string;
  /** Name in the language itself. */
  native: string;
  /** Name in English, shown under the native name and used for search. */
  english: string;
  /** Locale for Intl date formatting. */
  intl: string;
  group: LanguageGroup;
  rtl: boolean;
  ready: boolean;
}

export const languages: Language[] = [
  { code: 'en-US', native: 'English', english: 'English', intl: 'en-GB', group: 'main', rtl: false, ready: true },
  { code: 'de', native: 'Deutsch', english: 'German', intl: 'de-CH', group: 'main', rtl: false, ready: true },
  { code: 'fr', native: 'Français', english: 'French', intl: 'fr-CH', group: 'main', rtl: false, ready: true },
  { code: 'it', native: 'Italiano', english: 'Italian', intl: 'it-CH', group: 'main', rtl: false, ready: true },
  { code: 'ar', native: 'العربية', english: 'Arabic', intl: 'ar-u-nu-latn', group: 'other', rtl: true, ready: true },
  { code: 'uk', native: 'Українська', english: 'Ukrainian', intl: 'uk', group: 'other', rtl: false, ready: true },
  { code: 'ti', native: 'ትግርኛ', english: 'Tigrinya', intl: 'ti', group: 'other', rtl: false, ready: false },
  { code: 'tr', native: 'Türkçe', english: 'Turkish', intl: 'tr', group: 'other', rtl: false, ready: false },
  { code: 'fa', native: 'فارسی', english: 'Persian (Farsi)', intl: 'fa-u-nu-latn', group: 'other', rtl: true, ready: false },
  { code: 'prs', native: 'دری', english: 'Dari', intl: 'fa-AF-u-nu-latn', group: 'other', rtl: true, ready: false },
  { code: 'so', native: 'Soomaali', english: 'Somali', intl: 'so', group: 'other', rtl: false, ready: false },
  { code: 'ku', native: 'Kurdî', english: 'Kurdish', intl: 'ku', group: 'other', rtl: false, ready: false },
  { code: 'sq', native: 'Shqip', english: 'Albanian', intl: 'sq', group: 'other', rtl: false, ready: false },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil', intl: 'ta', group: 'other', rtl: false, ready: false },
  { code: 'es', native: 'Español', english: 'Spanish', intl: 'es', group: 'other', rtl: false, ready: false },
  { code: 'pt', native: 'Português', english: 'Portuguese', intl: 'pt', group: 'other', rtl: false, ready: false },
];

export const DEFAULT_LOCALE = 'en-US';

export function findLanguage(code: string): Language | undefined {
  return languages.find((l) => l.code === code);
}

/** Locale for Intl formatting of dates and month names. */
export function intlLocale(code: string): string {
  return findLanguage(code)?.intl ?? 'en-GB';
}

/** Case- and accent-insensitive search on the native and English name. */
export function searchLanguages(list: Language[], query: string): Language[] {
  const norm = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const q = norm(query.trim());
  if (!q) return list;
  return list.filter((l) => norm(l.native).includes(q) || norm(l.english).includes(q));
}
