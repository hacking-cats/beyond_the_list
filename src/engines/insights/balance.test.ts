import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseCsv, toTransactions } from '../ingest/ingest';
import type { Transaction } from '../ingest/types';
import { balance, unknownOpening } from './balance';

const own = ['Account1', 'Account3'];
const file = (name: string) => readFileSync(new URL(`../../../data/dummy/${name}`, import.meta.url), 'utf8');
const a1 = toTransactions(parseCsv(file('jeanine_2025_Account1_2025.csv')).rows, 'Account1', own);
const a3 = toTransactions(parseCsv(file('jeanine_2025_Account3_2025.csv')).rows, 'Account3', own);
const all = [...a1, ...a3];
const opening = unknownOpening(all);

describe('balance (insights SPEC examples)', () => {
  it('starts at 0 on the first day of the data when the opening balance is unknown', () => {
    expect(opening).toEqual({ amountRappen: 0, date: '2025-01-01' });
  });
  it('private account and credit card at the end of 2025', () => {
    expect(balance(all, 'Account1', opening, '2025-12-31').balanceRappen).toBe(881636);
    expect(balance(all, 'Account3', opening, '2025-12-31').balanceRappen).toBe(-16363);
  });
  it('card payments cancel out in the total over both accounts', () => {
    const total =
      balance(all, 'Account1', opening, '2025-12-31').balanceRappen +
      balance(all, 'Account3', opening, '2025-12-31').balanceRappen;
    expect(total).toBe(865273);
    const transfersSum = all.filter((t) => t.kind === 'transfer').reduce((s, t) => s + t.amountRappen, 0);
    expect(transfersSum).toBe(0);
  });
  it('adds a known opening balance and stops at asOf', () => {
    expect(balance(all, 'Account1', { amountRappen: 100000, date: '2025-01-01' }, '2025-01-01').balanceRappen).toBe(
      100000 - 182000,
    );
  });
  it('leaves pending rows out of the balance', () => {
    const tx = (amountRappen: number, status: Transaction['status']): Transaction => ({
      id: String(amountRappen), accountId: 'A', date: '2025-01-02', amountRappen, kind: 'expense',
      counterparty: 'x', originalName: 'x', status,
    });
    const b = balance([tx(-1000, 'settled'), tx(-500, 'pending')], 'A', { amountRappen: 5000, date: '2025-01-01' }, '2025-12-31');
    expect(b).toEqual({ balanceRappen: 4000, sinceDate: '2025-01-01', pendingRappen: -500 });
  });
});
