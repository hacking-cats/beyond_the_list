import { describe, expect, it } from 'vitest';
import { packCircles } from './packCircles';

describe('packCircles', () => {
  const values = [185000, 92000, 41300, 30000, 26000, 24000, 18500, 18000, 16000, 13000, 9500, 6800, 5200];
  const packing = packCircles(values, 360);

  it('places every circle inside the width without overlaps', () => {
    expect(packing.circles).toHaveLength(values.length);
    for (const c of packing.circles) {
      expect(c.x - c.r).toBeGreaterThanOrEqual(-1e-6);
      expect(c.x + c.r).toBeLessThanOrEqual(360 + 1e-6);
    }
    for (const a of packing.circles)
      for (const b of packing.circles)
        if (a !== b) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(a.r + b.r - 1e-6);
  });

  it('keeps area proportional to value', () => {
    const byIndex = new Map(packing.circles.map((c) => [c.index, c]));
    const a = byIndex.get(0)!;
    const b = byIndex.get(1)!;
    expect((a.r * a.r) / (b.r * b.r)).toBeCloseTo(185000 / 92000, 5);
  });

  it('handles an empty list', () => {
    expect(packCircles([], 300).circles).toHaveLength(0);
  });
});
