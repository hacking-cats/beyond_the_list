import { describe, expect, it } from 'vitest';
import { categoryShares } from './categoryShares';

describe('categoryShares', () => {
  it('totals, flexible share and order (known answer)', () => {
    const o = categoryShares([
      { key: 'coffee', amountRappen: 6800, kind: 'flexible' },
      { key: 'rent', amountRappen: 185000, kind: 'essential' },
      { key: 'takeaway', amountRappen: 24000, kind: 'flexible' },
    ]);
    expect(o.totalRappen).toBe(215800);
    expect(o.flexibleRappen).toBe(30800);
    expect(o.flexiblePercent).toBe(14);
    expect(o.items.map((i) => i.key)).toEqual(['rent', 'takeaway', 'coffee']);
    expect(o.items[0]?.percent).toBe(86);
  });
  it('empty list', () => {
    const o = categoryShares([]);
    expect(o.totalRappen).toBe(0);
    expect(o.flexiblePercent).toBe(0);
  });
  it('rejects negative spending', () => {
    expect(() => categoryShares([{ key: 'x', amountRappen: -1, kind: 'essential' }])).toThrow();
  });
});
