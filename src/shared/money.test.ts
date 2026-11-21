import { describe, expect, it } from 'vitest';
import { chfToRappen, formatChf } from './money';

describe('formatChf', () => {
  it('formats Swiss style with an apostrophe and two decimals', () => {
    expect(formatChf(123450)).toBe("CHF 1'234.50");
    expect(formatChf(841235)).toBe("CHF 8'412.35");
    expect(formatChf(5)).toBe('CHF 0.05');
  });
  it('puts the minus before CHF', () => {
    expect(formatChf(-182000)).toBe("-CHF 1'820.00");
  });
  it('adds a plus only when asked', () => {
    expect(formatChf(720000, { sign: true })).toBe("+CHF 7'200.00");
    expect(formatChf(0, { sign: true })).toBe('CHF 0.00');
  });
  it('rounds to whole francs with decimals 0', () => {
    expect(formatChf(1500000, { decimals: 0 })).toBe("CHF 15'000");
    expect(formatChf(4000000, { decimals: 0 })).toBe("CHF 40'000");
  });
  it('rejects floats', () => {
    expect(() => formatChf(12.5)).toThrow();
  });
  it('converts francs to Rappen', () => {
    expect(chfToRappen(2400)).toBe(240000);
  });
});
