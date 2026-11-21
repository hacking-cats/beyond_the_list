import { describe, expect, it } from 'vitest';
import { features } from './registry';
import enUS from '../i18n/en-US';
import de from '../i18n/de';

type Tree = { [k: string]: unknown };
const has = (tree: Tree, path: string) =>
  path.split('.').reduce<unknown>((node, part) => (node as Tree | undefined)?.[part], tree) !== undefined;

describe('feature registry', () => {
  it('keys and routes are unique', () => {
    expect(new Set(features.map((f) => f.key)).size).toBe(features.length);
    expect(new Set(features.map((f) => f.route)).size).toBe(features.length);
  });
  it('every titleKey exists in en-US and de', () => {
    for (const f of features) {
      expect(has(enUS as Tree, f.titleKey), `en-US ${f.titleKey}`).toBe(true);
      expect(has(de as Tree, f.titleKey), `de ${f.titleKey}`).toBe(true);
    }
  });
});
