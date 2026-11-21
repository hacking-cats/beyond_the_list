import { describe, expect, it } from 'vitest';
import merchants from '../../../content/merchants.json';
import type { Transaction } from '../ingest/types';
import { categorize, type MerchantRule } from './categorize';

const tx = (counterparty: string, originalName = counterparty, kind: Transaction['kind'] = 'expense'): Transaction => ({
  id: 'x', accountId: 'Account1', date: '2025-01-01', amountRappen: -100, kind, counterparty, originalName, status: 'settled',
});
const rules = merchants as MerchantRule[];

describe('categorize', () => {
  it.each([
    ['Rent', 'rent'],
    ['Krankenkasse', 'insurance'],
    ['Kantine AG', 'eatingOut'],
    ['Digitec Galaxus', 'shop'],
    ['Abercrombie & Fitch', 'clothes'],
    ['Swiss Intl. Airlines', 'holiday'],
    ['Netflix', 'stream'],
    ['Coop Tankstelle Talgut Zentrum', 'transport'],
    ['Veloshop', 'hobbies'],
  ])('%s -> %s', (counterparty, category) => {
    expect(categorize(tx(counterparty), rules).category).toBe(category);
  });
  it('unknown merchants go to other', () => {
    expect(categorize(tx('www.post.ch'), rules).category).toBe('other');
  });
  it('user corrections win', () => {
    expect(categorize(tx('Kantine AG'), rules, [{ counterparty: 'Kantine AG', category: 'other' }]).category).toBe('other');
  });
  it('transfers and salary have their own categories', () => {
    expect(categorize(tx('KK-Konto', 'Kreditkarten-Zahlung', 'transfer'), rules).category).toBe('transfer');
    expect(categorize(tx('Employer AG', 'Salärzahlung', 'income'), rules).category).toBe('income');
  });
});
