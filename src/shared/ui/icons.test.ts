import { describe, expect, it } from 'vitest';
import categories from '../../../content/categories.json';
import { hasIcon, iconPaths } from './icons';

describe('category icons', () => {
  it('registers the icon of every category in content/categories.json', () => {
    const missing = categories.filter((c) => !hasIcon(c.icon)).map((c) => `${c.key}: ${c.icon}`);
    expect(missing).toEqual([]);
  });

  it('splits an icon into visible and hidden paths', () => {
    const paths = iconPaths('home');
    expect(paths.some((p) => p.hidden)).toBe(true);
    expect(paths.filter((p) => !p.hidden).every((p) => p.d.startsWith('M'))).toBe(true);
  });
});
