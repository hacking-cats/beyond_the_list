import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import rulesJson from '../../../content/alternatives.json';
import type { Transaction } from '../ingest/types';
import { parseCsv, toTransactions } from '../ingest/ingest';
import { alternatives, type AlternativeRule } from './alternatives';

let n = 0;
const tx = (originalName: string, chf: number, date = '2025-01-10', kind: Transaction['kind'] = 'expense'): Transaction => ({
  id: `t${n++}`, accountId: 'Account1', date, amountRappen: -Math.round(chf * 100), kind,
  counterparty: originalName, originalName, status: 'settled',
});
const rule = (r: Partial<AlternativeRule>): AlternativeRule => ({
  key: 'k', category: 'c', match: ['Shop'], type: 'percent', percent: 50, source: 'test', ...r,
});
const twoMonths = ['2025-01', '2025-02'];

describe('alternatives', () => {
  it('percent: saves a share of what was spent, per month', () => {
    const [a] = alternatives([tx('Shop A', 100), tx('Shop B', 100, '2025-02-03')], twoMonths, [rule({})]);
    expect(a).toMatchObject({ count: 2, countPerMonth: 1, nowRappen: 10000, saveRappen: 5000, totalRappen: 20000 });
  });
  it('perPurchase: each purchase at the cheaper price', () => {
    const txs = [tx('Shop', 7), tx('Shop', 7), tx('Shop', 7)];
    const [a] = alternatives(txs, ['2025-01'], [rule({ type: 'perPurchase', altRappen: 50 })]);
    expect(a!.saveRappen).toBe(1900); // 21.00 - 1.50 = 19.50, rounded down to whole francs
  });
  it('flatPerMonth: one fixed price a month instead', () => {
    const txs = Array.from({ length: 20 }, () => tx('Shop', 9.2));
    const [a] = alternatives(txs, ['2025-01'], [rule({ type: 'flatPerMonth', altRappen: 8900 })]);
    expect(a!.saveRappen).toBe(9500); // 184 - 89
  });
  it('halfFareCard: half of every ticket minus the card', () => {
    const txs = [tx('Shop', 112), tx('Shop', 112)];
    const [a] = alternatives(txs, ['2025-01'], [rule({ type: 'halfFareCard', altRappen: 1200 })]);
    expect(a!.saveRappen).toBe(11100); // 112 - 1 (one month of a 12 CHF card)
  });
  it('leaves out ideas that do not pay off, income and other months', () => {
    const txs = [tx('Shop', 112), tx('Shop', 50, '2025-03-01'), tx('Shop', 500, '2025-01-05', 'income')];
    expect(alternatives(txs, twoMonths, [rule({ type: 'halfFareCard', altRappen: 190000 })])).toEqual([]);
  });
  it('sorts the biggest saving first', () => {
    const txs = [tx('Shop', 10), tx('Kiosk', 40)];
    const keys = alternatives(txs, ['2025-01'], [rule({ key: 'a' }), rule({ key: 'b', match: ['Kiosk'] })]).map((a) => a.key);
    expect(keys).toEqual(['b', 'a']);
  });
});

describe('alternatives for the Andrés persona', () => {
  const csv = readFileSync(new URL('../../../data/dummy/andres_2025_Account1_2025.csv', import.meta.url), 'utf8');
  const txs = toTransactions(parseCsv(csv).rows, 'Account1', ['Account1']);
  const months = [...new Set(txs.map((t) => t.date.slice(0, 7)))].sort();
  const ideas = alternatives(txs, months, rulesJson as AlternativeRule[]);
  const byKey = Object.fromEntries(ideas.map((i) => [i.key, i]));

  it('finds every idea the persona was built for', () => {
    expect(ideas.map((i) => i.key).sort()).toEqual(
      ['budgetPhone', 'cheaperTransfer', 'coffeeAtHome', 'cookInstead', 'discounter', 'halbtax', 'kioskSnacks', 'lateFees', 'lottery', 'postomat', 'streamingRotate', 'zvvPass'].sort(),
    );
  });
  it('the monthly pass beats single tickets, the Halbtax pays off', () => {
    expect(byKey.zvvPass!.nowRappen).toBeGreaterThan(8900);
    expect(byKey.halbtax).toMatchObject({ count: 8, saveRappen: 2100 }); // (896 / 2 - 190) / 12 = 21.50
  });
  it('late fees and the phone plan', () => {
    expect(byKey.lateFees).toMatchObject({ count: 4, totalRappen: 11000 });
    expect(byKey.budgetPhone!.saveRappen).toBe(4400); // 69.90 - 25
  });
});

describe('alternatives for the Jeanine single-mother persona', () => {
  const own = ['Account1', 'Account3'];
  const read = (n: string) => readFileSync(new URL(`../../../data/dummy/${n}`, import.meta.url), 'utf8');
  const txs = [
    ...toTransactions(parseCsv(read('jeanine_singlemom_2025_Account1_2025.csv')).rows, 'Account1', own),
    ...toTransactions(parseCsv(read('jeanine_singlemom_2025_Account3_2025.csv')).rows, 'Account3', own),
  ];
  const months = [...new Set(txs.map((t) => t.date.slice(0, 7)))].sort();
  const ideas = alternatives(txs, months, rulesJson as AlternativeRule[]);

  it('finds the family ideas, the biggest first', () => {
    expect(ideas.map((i) => i.key)).toEqual([
      'discounter', 'inAppLimit', 'streamingRotate', 'kidsSecondHand', 'budgetPhone', 'onlineWait', 'cookInstead', 'lateFees', 'postomat',
    ]);
  });
  it('in-app purchases: the children pay with the saved card, a CHF 30 gift-card budget instead', () => {
    const g = ideas.find((i) => i.key === 'inAppLimit')!;
    expect(g).toMatchObject({ count: 150, totalRappen: 201020, saveRappen: 13700 }); // (2010.20 - 12 x 30) / 12 = 137.51
  });
  it('streaming: five services and a second Spotify plan, added over the year', () => {
    const s = ideas.find((i) => i.key === 'streamingRotate')!;
    expect(s).toMatchObject({ count: 55, nowRappen: 7599, saveRappen: 3700 });
  });
});
