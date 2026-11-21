import type { Transaction } from '../ingest/types';

/**
 * Cheaper alternatives found in the user's own payments (savings SPEC: alternatives).
 * Pure; money in Rappen. The rules and their prices live in content/alternatives.json;
 * this engine only does the arithmetic, so every number on screen comes from here.
 *
 * Rule types (`saving` over the whole window, then per month):
 * - `percent`: the cheaper way costs `percent` % less (100 = the whole amount is avoidable).
 * - `perPurchase`: each purchase could cost `altRappen` instead (coffee from home).
 * - `flatPerMonth`: one fixed price of `altRappen` a month instead (monthly pass, budget plan).
 * - `halfFareCard`: a card for `altRappen` a year halves every ticket (Halbtax).
 */
export type AlternativeType = 'percent' | 'perPurchase' | 'flatPerMonth' | 'halfFareCard';

export interface AlternativeRule {
  key: string;
  category: string;
  /** Case-insensitive parts of the original name or the counterparty. */
  match: string[];
  type: AlternativeType;
  percent?: number;
  altRappen?: number;
  /** Where the price or percentage comes from (link or "assumption: ..."). */
  source: string;
}

export interface Alternative {
  key: string;
  category: string;
  /** Number of matching payments in the window. */
  count: number;
  /** Matching payments per month, rounded. */
  countPerMonth: number;
  /** Spent per month now (average over the window). */
  nowRappen: number;
  /** Possible saving per month, rounded down to whole francs. */
  saveRappen: number;
  /** Spent in the whole window. */
  totalRappen: number;
  /** The rule's price (altRappen), for the explanation text. */
  altRappen: number;
}

const matches = (t: Transaction, parts: string[]) => {
  const hay = `${t.originalName} ${t.counterparty}`.toLowerCase();
  return parts.some((p) => hay.includes(p.toLowerCase()));
};

function savingOver(rule: AlternativeRule, totalRappen: number, count: number, months: number): number {
  const alt = rule.altRappen ?? 0;
  switch (rule.type) {
    case 'percent':
      return (totalRappen * (rule.percent ?? 0)) / 100;
    case 'perPurchase':
      return totalRappen - count * alt;
    case 'flatPerMonth':
      return totalRappen - months * alt;
    case 'halfFareCard':
      return totalRappen / 2 - (alt * months) / 12;
  }
}

/**
 * Alternatives for the settled expenses in `months` ("YYYY-MM"), biggest saving first.
 * Ideas that save less than `minSaveRappen` a month are left out.
 */
export function alternatives(
  txs: Transaction[],
  months: string[],
  rules: AlternativeRule[],
  minSaveRappen = 100,
): Alternative[] {
  const n = Math.max(1, months.length);
  const inWindow = txs.filter(
    (t) => t.status === 'settled' && t.kind === 'expense' && months.includes(t.date.slice(0, 7)),
  );
  return rules
    .map((rule) => {
      const hits = inWindow.filter((t) => matches(t, rule.match));
      const totalRappen = -hits.reduce((s, t) => s + t.amountRappen, 0);
      const saving = savingOver(rule, totalRappen, hits.length, n);
      return {
        key: rule.key,
        category: rule.category,
        count: hits.length,
        countPerMonth: Math.round(hits.length / n),
        nowRappen: Math.round(totalRappen / n),
        saveRappen: Math.max(0, Math.floor(saving / n / 100) * 100),
        totalRappen,
        altRappen: rule.altRappen ?? 0,
      };
    })
    .filter((a) => a.count > 0 && a.saveRappen >= minSaveRappen)
    .sort((a, b) => b.saveRappen - a.saveRappen);
}
