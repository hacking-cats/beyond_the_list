/**
 * Picks which PostFinance products to show as investment ideas (ideas, not advice).
 * Pure: plain data in, plain data out. Only products from content/invest-products.json.
 */
export type ProductLanguage = 'en' | 'de' | 'fr' | 'it';

export interface InvestProduct {
  key: string;
  icon: string;
  /** Smallest amount to start, in Rappen. */
  minRappen: number;
  /** Pillar 3a: only people with their own earned income can pay in. */
  needsEarnedIncome: boolean;
  easiestStart: boolean;
  /** Official postfinance.ch page per language. */
  urls: Record<ProductLanguage, string>;
}

export interface InvestFacts {
  /** The statements show a salary (own earned income). */
  hasEarnedIncome: boolean;
}

export interface ProductIdea {
  key: string;
  icon: string;
  minRappen: number;
  easiestStart: boolean;
  url: string;
}

/** postfinance.ch exists in en, de, fr and it; other app languages get the English page. */
export function productLanguage(locale: string): ProductLanguage {
  const lang = locale.split('-')[0];
  return lang === 'de' || lang === 'fr' || lang === 'it' ? lang : 'en';
}

/**
 * Products the user can actually use, easiest start first, then smallest minimum.
 * Products that need earned income are left out when the statements show none.
 */
export function matchProducts(facts: InvestFacts, products: InvestProduct[], locale: string): ProductIdea[] {
  const lang = productLanguage(locale);
  return products
    .filter((p) => !p.needsEarnedIncome || facts.hasEarnedIncome)
    .map((p, index) => ({ p, index }))
    .sort((a, b) => Number(b.p.easiestStart) - Number(a.p.easiestStart) || a.p.minRappen - b.p.minRappen || a.index - b.index)
    .map(({ p }) => ({ key: p.key, icon: p.icon, minRappen: p.minRappen, easiestStart: p.easiestStart, url: p.urls[lang] }));
}
