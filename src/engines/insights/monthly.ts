import type { Transaction } from '../ingest/types';
import type { CategorySpending, SpendingKind } from './categoryShares';

/**
 * Monthly numbers from transactions. Pure; money in Rappen.
 * Transfers and pending rows never count as spending; refunds are netted against
 * spending (insights SPEC rules 1 and 2). Account balances follow the Transaction contract,
 * rule 6 (opening balance + settled rows per account); they are not computed here.
 */

const counts = (t: Transaction) => t.status === 'settled' && t.kind !== 'transfer';

/** The months that have data, oldest first ("YYYY-MM"). */
export function monthsWithData(txs: Transaction[]): string[] {
  return [...new Set(txs.map((t) => t.date.slice(0, 7)))].sort();
}

/** The last `n` months that have data. */
export function lastMonths(txs: Transaction[], n: number): string[] {
  return monthsWithData(txs).slice(-n);
}

export interface MonthSummary {
  month: string;
  incomeRappen: number;
  spentRappen: number; // positive; refunds already subtracted
  leftRappen: number; // income minus spending (not an account balance)
}

export function monthSummary(txs: Transaction[], month: string): MonthSummary {
  let income = 0;
  let spent = 0;
  for (const t of txs) {
    if (!counts(t) || !t.date.startsWith(month)) continue;
    if (t.kind === 'income') income += t.amountRappen;
    else spent -= t.amountRappen; // expenses are negative, refunds positive
  }
  return { month, incomeRappen: income, spentRappen: spent, leftRappen: income - spent };
}

/** Average spending per category and month over `months`; categories at or below zero are left out. */
export function averageMonthlySpending(
  txs: Transaction[],
  months: string[],
  kindOf: (category: string) => SpendingKind,
): CategorySpending[] {
  const sums = new Map<string, number>();
  for (const t of txs) {
    if (!counts(t) || t.kind === 'income' || !months.includes(t.date.slice(0, 7))) continue;
    const key = t.category ?? 'other';
    sums.set(key, (sums.get(key) ?? 0) - t.amountRappen);
  }
  return [...sums.entries()]
    .map(([key, sum]) => ({ key, amountRappen: Math.round(sum / Math.max(1, months.length)), kind: kindOf(key) }))
    .filter((c) => c.amountRappen > 0);
}

/** Average number of payments per month in a category (expenses only). */
export function paymentsPerMonth(txs: Transaction[], months: string[], category: string): number {
  const n = txs.filter(
    (t) => counts(t) && t.kind === 'expense' && t.category === category && months.includes(t.date.slice(0, 7)),
  ).length;
  return Math.round(n / Math.max(1, months.length));
}

/** Total spent in a category in a year (positive, refunds netted). */
export function categoryTotal(txs: Transaction[], category: string, year: string): number {
  return txs
    .filter((t) => counts(t) && t.kind !== 'income' && t.category === category && t.date.startsWith(year))
    .reduce((s, t) => s - t.amountRappen, 0);
}

/** Total spent in a year on payments whose name or counterparty contains one of `parts` (positive). */
export function totalMatching(txs: Transaction[], parts: string[], year: string): number {
  const hit = (t: Transaction) => {
    const hay = `${t.originalName} ${t.counterparty}`.toLowerCase();
    return parts.some((p) => hay.includes(p.toLowerCase()));
  };
  return txs
    .filter((t) => counts(t) && t.kind !== 'income' && t.date.startsWith(year) && hit(t))
    .reduce((s, t) => s - t.amountRappen, 0);
}
