import { describe, expect, it } from 'vitest';
import products from '../../../content/invest-products.json';
import links from '../../../content/postfinance-links.json';
import { matchProducts, productLanguage, type InvestProduct } from './matchProducts';

const all = products as InvestProduct[];

describe('matchProducts', () => {
  it('shows all four products with earned income, easiest start first, then smallest minimum', () => {
    const ideas = matchProducts({ hasEarnedIncome: true }, all, 'en-US');
    expect(ideas.map((i) => i.key)).toEqual(['fundSavingPlan', 'retirement3a', 'etfSavingPlan', 'eAssetManagement']);
  });

  it('leaves out pillar 3a without earned income', () => {
    const ideas = matchProducts({ hasEarnedIncome: false }, all, 'en-US');
    expect(ideas.map((i) => i.key)).not.toContain('retirement3a');
    expect(ideas).toHaveLength(3);
  });

  it('links to the page in the user language, English for languages postfinance.ch does not have', () => {
    expect(matchProducts({ hasEarnedIncome: true }, all, 'fr')[0]!.url).toContain('/fr/');
    expect(matchProducts({ hasEarnedIncome: true }, all, 'de')[0]!.url).toContain('/de/');
    expect(matchProducts({ hasEarnedIncome: true }, all, 'ar')[0]!.url).toContain('/en/');
    expect(productLanguage('uk')).toBe('en');
    expect(productLanguage('it')).toBe('it');
  });

  it('returns nothing for an empty product list (never invents products)', () => {
    expect(matchProducts({ hasEarnedIncome: true }, [], 'en-US')).toEqual([]);
  });
});

describe('content/invest-products.json', () => {
  it('every product has a whole-Rappen minimum and an official postfinance.ch link in en, de, fr and it', () => {
    for (const p of all) {
      expect(Number.isInteger(p.minRappen), p.key).toBe(true);
      for (const lang of ['en', 'de', 'fr', 'it'] as const) {
        expect(p.urls[lang], `${p.key} ${lang}`).toMatch(new RegExp(`^https://www\\.postfinance\\.ch/${lang}/`));
      }
    }
    expect(new Set(all.map((p) => p.key)).size).toBe(all.length);
  });

  it('the comparison link exists in all four languages on postfinance.ch', () => {
    for (const lang of ['en', 'de', 'fr', 'it'] as const) {
      expect(links.savingPlanComparison[lang]).toMatch(new RegExp(`^https://www\\.postfinance\\.ch/${lang}/`));
    }
  });
});
