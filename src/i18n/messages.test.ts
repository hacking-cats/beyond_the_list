import { describe, expect, it } from 'vitest';
import messages from './index';
import { DEFAULT_LOCALE, intlLocale, languages, searchLanguages } from './languages';

type Tree = { [key: string]: string | Tree };

function keys(tree: Tree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === 'string' ? [`${prefix}${k}`] : keys(v, `${prefix}${k}.`),
  );
}

const all = messages as unknown as Record<string, Tree>;
const reference = keys(all[DEFAULT_LOCALE]!).sort();

describe('i18n messages', () => {
  it.each(Object.keys(all))('%s has exactly the same keys as en-US', (code) => {
    const own = keys(all[code]!).sort();
    expect(own.filter((k) => !reference.includes(k))).toEqual([]); // extra keys
    expect(reference.filter((k) => !own.includes(k))).toEqual([]); // missing keys
  });

  it('has no empty texts', () => {
    for (const [code, tree] of Object.entries(all)) {
      const empty = keys(tree).filter((k) => {
        const v = k.split('.').reduce<string | Tree | undefined>((n, p) => (typeof n === 'object' ? n[p] : undefined), tree);
        return typeof v !== 'string' || v.trim() === '';
      });
      expect(empty, code).toEqual([]);
    }
  });
});

describe('language list', () => {
  it('every ready language has messages, and every message set is in the list', () => {
    const ready = languages.filter((l) => l.ready).map((l) => l.code).sort();
    expect(ready).toEqual(Object.keys(all).sort());
  });

  it('has unique codes and four main languages', () => {
    expect(new Set(languages.map((l) => l.code)).size).toBe(languages.length);
    expect(languages.filter((l) => l.group === 'main').map((l) => l.code)).toEqual(['en-US', 'de', 'fr', 'it']);
  });

  it('every Intl locale is valid', () => {
    for (const l of languages) expect(() => new Intl.DateTimeFormat(l.intl), l.code).not.toThrow();
    expect(intlLocale('unknown')).toBe('en-GB');
  });

  it('searches by native or English name, ignoring case and accents', () => {
    const other = languages.filter((l) => l.group === 'other');
    expect(searchLanguages(other, 'arab').map((l) => l.code)).toEqual(['ar']);
    expect(searchLanguages(other, 'TURKCE').map((l) => l.code)).toEqual(['tr']);
    expect(searchLanguages(other, 'Українська').map((l) => l.code)).toEqual(['uk']);
    expect(searchLanguages(other, '  ')).toHaveLength(other.length);
    expect(searchLanguages(other, 'klingon')).toEqual([]);
  });
});
