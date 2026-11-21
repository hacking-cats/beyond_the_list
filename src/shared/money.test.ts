import { describe, expect, it } from 'vitest';
import { chfToRappen, displayChf, formatChf } from './money';

describe('formatChf', () => {
  it('formats Swiss style with an apostrophe and two decimals', () => {
    expect(formatChf(123450)).toBe("1'234.50 CHF");
    expect(formatChf(841235)).toBe("8'412.35 CHF");
    expect(formatChf(5)).toBe('0.05 CHF');
  });
  it('uses the minus sign U+2212', () => {
    expect(formatChf(-182000)).toBe("\u22121'820.00 CHF");
  });
  it('adds a plus only when asked', () => {
    expect(formatChf(720000, { sign: true })).toBe("+7'200.00 CHF");
    expect(formatChf(0, { sign: true })).toBe('0.00 CHF');
  });
  it('rounds to whole francs with decimals 0', () => {
    expect(formatChf(1500000, { decimals: 0 })).toBe("15'000 CHF");
    expect(formatChf(4000000, { decimals: 0 })).toBe("40'000 CHF");
  });
  it('rejects floats', () => {
    expect(() => formatChf(12.5)).toThrow();
  });
  it('converts francs to Rappen', () => {
    expect(chfToRappen(2400)).toBe(240000);
  });
});

describe('displayChf', () => {
  it('is formatChf wrapped in invisible left-to-right isolate marks', () => {
    expect(displayChf(123450)).toBe('⁦' + "1'234.50 CHF" + '⁩');
    expect(displayChf(-500, { decimals: 0 })).toBe(`⁦${formatChf(-500, { decimals: 0 })}⁩`);
  });
});
