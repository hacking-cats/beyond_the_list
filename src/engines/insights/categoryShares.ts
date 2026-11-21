import { assertRappen, type Rappen } from '../../shared/money';

/**
 * Spending per category and the share of each (klar V2 dashboard). Pure; money in Rappen.
 * `flexible` marks spending the user could cut back; essentials (rent, health insurance,
 * groceries) are never suggested as cuts.
 */

export type SpendingKind = 'essential' | 'flexible';

export interface CategorySpending {
  key: string;
  amountRappen: Rappen; // monthly average, positive
  kind: SpendingKind;
}

export interface CategoryShare extends CategorySpending {
  /** Whole percent of total spending. */
  percent: number;
}

export interface SpendingOverview {
  totalRappen: Rappen;
  flexibleRappen: Rappen;
  flexiblePercent: number;
  /** Largest first. */
  items: CategoryShare[];
}

const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

export function categoryShares(categories: CategorySpending[]): SpendingOverview {
  categories.forEach((c) => {
    assertRappen(c.amountRappen);
    if (c.amountRappen < 0) throw new Error(`Spending must be positive: ${c.key}`);
  });
  const totalRappen = categories.reduce((s, c) => s + c.amountRappen, 0);
  const flexibleRappen = categories
    .filter((c) => c.kind === 'flexible')
    .reduce((s, c) => s + c.amountRappen, 0);
  const items = [...categories]
    .sort((a, b) => b.amountRappen - a.amountRappen)
    .map((c) => ({ ...c, percent: pct(c.amountRappen, totalRappen) }));
  return { totalRappen, flexibleRappen, flexiblePercent: pct(flexibleRappen, totalRappen), items };
}
