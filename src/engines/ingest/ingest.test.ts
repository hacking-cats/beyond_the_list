import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { mergeAccounts, parseCsv, toRappen, toTransactions } from './ingest';

const own = ['Account1', 'Account3'];
const file = (name: string) => readFileSync(new URL(`../../../data/dummy/${name}`, import.meta.url), 'utf8');
const load = (name: string, acc: string) => toTransactions(parseCsv(file(name)).rows, acc, own);
const header =
  'name,type,source_id,source_label,target_id,target_label,transaction_date,value_date,amount,currency,status,exchange_rate,base_amount,base_currency,description';

describe('parseCsv', () => {
  it('handles quoted fields with commas', () => {
    const { rows, errors } = parseCsv(
      `${header}\n"PIZZERIA & GRIL, Samedan",expense,Account3,KK-Konto,X,"Pizzeria & Grill, Samedan",2025-01-28,2025-01-28,242.4,CHF,settled,1.0,242.4,CHF,\n`,
    );
    expect(errors).toEqual([]);
    expect(rows[0]?.name).toBe('PIZZERIA & GRIL, Samedan');
    expect(rows[0]?.target_label).toBe('Pizzeria & Grill, Samedan');
  });
  it('reports missing columns', () => {
    expect(parseCsv('a,b\n1,2').errors[0]).toMatch(/missing columns/);
  });
  it('reads the dummy files without errors', () => {
    expect(parseCsv(file('jeanine_2025_Account1_2025.csv'))).toMatchObject({ errors: [] });
    expect(parseCsv(file('jeanine_2025_Account1_2025.csv')).rows).toHaveLength(264);
    expect(parseCsv(file('jeanine_2025_Account3_2025.csv')).rows).toHaveLength(261);
  });
});

describe('toTransactions', () => {
  const a1 = load('jeanine_2025_Account1_2025.csv', 'Account1');
  const a3 = load('jeanine_2025_Account3_2025.csv', 'Account3');

  it('rounds to integer Rappen once', () => {
    expect(toRappen('46.96976052505031')).toBe(4697);
    expect([...a1, ...a3].every((t) => Number.isInteger(t.amountRappen))).toBe(true);
  });
  it('money out is negative, salary is income', () => {
    const rent = a1.find((t) => t.originalName === 'Rent')!;
    expect(rent).toMatchObject({ amountRappen: -182000, kind: 'expense', counterparty: 'Rent' });
    const salary = a1.find((t) => t.originalName === 'Salärzahlung Employer AG')!;
    expect(salary).toMatchObject({ amountRappen: 746400, kind: 'income', counterparty: 'Employer AG' });
  });
  it('flags EUR rows shown with rate 1.0', () => {
    const eur = a3.filter((t) => t.dataIssues?.includes('eur-rate-1'));
    expect(eur).toHaveLength(13);
  });
  it('gives every row its own id, also identical rows', () => {
    const all = [...a1, ...a3];
    expect(new Set(all.map((t) => t.id)).size).toBe(all.length);
  });
});

describe('mergeAccounts', () => {
  const merged = mergeAccounts([
    load('jeanine_2025_Account1_2025.csv', 'Account1'),
    load('jeanine_2025_Account3_2025.csv', 'Account3'),
  ]);
  it('counts the credit card payment once, as a transfer from the private account', () => {
    expect(merged).toHaveLength(264 + 261 - 12);
    const transfers = merged.filter((t) => t.kind === 'transfer');
    expect(transfers).toHaveLength(12);
    expect(transfers.every((t) => t.accountId === 'Account1' && t.amountRappen < 0)).toBe(true);
  });
  it('income from a shop is a refund, salary stays income', () => {
    expect(merged.filter((t) => t.kind === 'refund')).toHaveLength(35);
    expect(merged.filter((t) => t.kind === 'income')).toHaveLength(13);
  });
  it('keeps salary and 13th salary on the same day', () => {
    expect(merged.filter((t) => t.date === '2025-12-23' && t.kind === 'income')).toHaveLength(2);
  });
  it('is sorted newest first', () => {
    expect(merged[0]!.date >= merged[merged.length - 1]!.date).toBe(true);
  });
});

describe('andres_2025 (low-income persona, private account only)', () => {
  const name = 'andres_2025_Account1_2025.csv';
  const a1 = load(name, 'Account1');

  it('reads without errors', () => {
    const { rows, errors } = parseCsv(file(name));
    expect(errors).toEqual([]);
    expect(rows).toHaveLength(835);
  });
  it('has integer Rappen, unique ids and only wage plus cousin top-ups as income', () => {
    expect(a1.every((t) => Number.isInteger(t.amountRappen))).toBe(true);
    expect(new Set(a1.map((t) => t.id)).size).toBe(a1.length);
    const income = mergeAccounts([a1]).filter((t) => t.kind === 'income');
    expect(income).toHaveLength(15);
  });
  it('never goes below zero and ends the year with almost nothing', () => {
    let balance = 0;
    let lowest = Infinity;
    for (const t of [...a1].sort((x, y) => x.date.localeCompare(y.date) || y.amountRappen - x.amountRappen)) {
      balance += t.amountRappen;
      lowest = Math.min(lowest, balance);
    }
    expect(lowest).toBeGreaterThanOrEqual(0);
    expect(balance).toBe(10982);
  });
});

describe('jeanine_singlemom_2025 (single mother, private account and credit card)', () => {
  const a1 = load('jeanine_singlemom_2025_Account1_2025.csv', 'Account1');
  const a3 = load('jeanine_singlemom_2025_Account3_2025.csv', 'Account3');

  it('reads both files without errors', () => {
    expect(parseCsv(file('jeanine_singlemom_2025_Account1_2025.csv'))).toMatchObject({ errors: [] });
    expect(parseCsv(file('jeanine_singlemom_2025_Account3_2025.csv'))).toMatchObject({ errors: [] });
    expect(a1).toHaveLength(430);
    expect(a3).toHaveLength(143);
  });
  it('counts each monthly card payment once, and the salary plus 13th salary as income', () => {
    const merged = mergeAccounts([a1, a3]);
    expect(merged.filter((t) => t.kind === 'transfer')).toHaveLength(12);
    expect(merged.filter((t) => t.kind === 'income')).toHaveLength(13);
    expect(merged.filter((t) => t.kind === 'refund')).toHaveLength(1);
  });
  it('the card payments cover the card purchases up to the last billing day', () => {
    const card = a3.reduce((s, t) => s + t.amountRappen, 0);
    expect(card).toBe(-12185); // purchases after 23 December, billed in January
  });
});
