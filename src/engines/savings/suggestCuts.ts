import type { CategorySpending } from '../insights/categoryShares';
import { ceilToFranc } from './goalPlan';

/**
 * Savings ideas from spending habits. Pure; money in Rappen.
 * Only flexible categories are suggested, never essentials (rent, health insurance, tax...).
 * The suggestion is to halve the monthly amount, rounded up to whole francs.
 */
export interface Cut {
  key: string;
  nowRappen: number;
  saveRappen: number;
}

export function suggestCuts(spending: CategorySpending[], max = 5, share = 0.5): Cut[] {
  return spending
    .filter((c) => c.kind === 'flexible' && c.amountRappen >= 1000)
    .sort((a, b) => b.amountRappen - a.amountRappen)
    .slice(0, max)
    .map((c) => ({ key: c.key, nowRappen: c.amountRappen, saveRappen: ceilToFranc(c.amountRappen * share) }));
}
