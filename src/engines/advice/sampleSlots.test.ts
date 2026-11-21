import { describe, expect, it } from 'vitest';
import { firstFreeDay, SATURDAY_TIMES, sampleSlots, WEEKDAY_TIMES } from './sampleSlots';

describe('sampleSlots', () => {
  // Saturday 21 November 2026
  const days = sampleSlots('2026-11-21');

  it('starts tomorrow, skips Sunday and returns six days', () => {
    expect(days.map((d) => d.date)).toEqual(['2026-11-23', '2026-11-24', '2026-11-25', '2026-11-26', '2026-11-27', '2026-11-28']);
    expect(days.every((d) => d.weekday !== 0)).toBe(true);
  });

  it('has evening slots on weekdays and shorter Saturdays', () => {
    expect(days[0]!.slots.map((s) => s.time)).toEqual(WEEKDAY_TIMES);
    expect(days[5]!.weekday).toBe(6);
    expect(days[5]!.slots.map((s) => s.time)).toEqual(SATURDAY_TIMES);
  });

  it('has exactly one fully booked day, the fourth', () => {
    expect(days.filter((d) => !d.hasFree).map((d) => d.date)).toEqual(['2026-11-26']);
  });

  it('keeps several free and some taken times on the other days', () => {
    for (const d of days.filter((x) => x.hasFree)) {
      const free = d.slots.filter((s) => s.free).length;
      expect(free, d.date).toBeGreaterThanOrEqual(2);
      expect(free, d.date).toBeLessThan(d.slots.length);
    }
  });

  it('is the same for the same day (no clock, no randomness)', () => {
    expect(sampleSlots('2026-11-21')).toEqual(days);
  });

  it('crosses months and years', () => {
    expect(sampleSlots('2026-12-30', 3).map((d) => d.date)).toEqual(['2026-12-31', '2027-01-01', '2027-01-02']);
  });

  it('preselects the first day with a free time', () => {
    expect(firstFreeDay(days)?.date).toBe('2026-11-23');
    expect(firstFreeDay([])).toBeUndefined();
  });

  it('rejects a malformed date', () => {
    expect(() => sampleSlots('21.11.2026')).toThrow();
  });
});
