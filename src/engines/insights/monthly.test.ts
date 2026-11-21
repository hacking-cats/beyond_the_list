import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import categories from '../../../content/categories.json';
import merchants from '../../../content/merchants.json';
import { categorizeAll } from '../categorize/categorize';
import { mergeAccounts, parseCsv, toTransactions } from '../ingest/ingest';
import { suggestCuts } from '../savings/suggestCuts';
import type { SpendingKind } from './categoryShares';
import { averageMonthlySpending, categoryTotal, lastMonths, monthSummary, monthsWithData, paymentsPerMonth, totalMatching } from './monthly';

const own = ['Account1', 'Account3'];
const file = (name: string) => readFileSync(new URL(`../../../data/dummy/${name}`, import.meta.url), 'utf8');
const txs = categorizeAll(
  mergeAccounts([
    toTransactions(parseCsv(file('jeanine_2025_Account1_2025.csv')).rows, 'Account1', own),
    toTransactions(parseCsv(file('jeanine_2025_Account3_2025.csv')).rows, 'Account3', own),
  ]),
  merchants,
);
const kinds = new Map((categories as { key: string; kind: SpendingKind }[]).map((c) => [c.key, c.kind]));
const kindOf = (k: string) => kinds.get(k) ?? 'essential';
const year = monthsWithData(txs);

describe('insights on the dummy year (known answers, checked separately)', () => {
  it('has 12 months', () => {
    expect(year).toHaveLength(12);
    expect(lastMonths(txs, 1)).toEqual(['2025-12']);
  });
  it('December: salary and 13th salary in, spending with refunds netted, transfers ignored', () => {
    expect(monthSummary(txs, '2025-12')).toEqual({
      month: '2025-12', incomeRappen: 1492800, spentRappen: 334238, leftRappen: 1158562,
    });
  });
  it('average monthly spending per category over the year', () => {
    const avg = Object.fromEntries(averageMonthlySpending(txs, year, kindOf).map((c) => [c.key, c.amountRappen]));
    expect(avg).toMatchObject({
      rent: 182000, shop: 141446, hobbies: 114612, holiday: 106006, insurance: 90017,
      clothes: 32620, transport: 22786, eatingOut: 18167, stream: 3333, phone: 1990,
    });
    expect(avg.transfer).toBeUndefined();
    expect(avg.income).toBeUndefined();
  });
  it('payments per month and tax paid in the year', () => {
    expect(paymentsPerMonth(txs, year, 'eatingOut')).toBe(11);
    expect(categoryTotal(txs, 'tax', '2025')).toBe(63000);
  });
  it('suggests cuts only for flexible spending, biggest first', () => {
    const cuts = suggestCuts(averageMonthlySpending(txs, year, kindOf));
    expect(cuts.map((c) => c.key)).toEqual(['shop', 'hobbies', 'holiday', 'clothes', 'eatingOut']);
    expect(cuts[0]).toEqual({ key: 'shop', nowRappen: 141446, saveRappen: 70800 });
  });
});

describe('totalMatching', () => {
  const tx = (originalName: string, chf: number, date: string, kind: 'expense' | 'income' = 'expense') => ({
    id: originalName + date, accountId: 'Account1', date, amountRappen: Math.round(chf * 100) * (kind === 'expense' ? -1 : 1),
    kind, counterparty: 'X', originalName, status: 'settled' as const,
  });
  it('sums the matching payments of one year, case-insensitive', () => {
    const txs = [tx('Serafe Haushaltabgabe', 335, '2025-01-28'), tx('serafe', 10, '2024-12-01'), tx('Coop', 50, '2025-02-01'), tx('Serafe', 5, '2025-03-01', 'income')];
    expect(totalMatching(txs, ['Serafe'], '2025')).toBe(33500);
  });
});
