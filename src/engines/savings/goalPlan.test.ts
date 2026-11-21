import { describe, expect, it } from 'vitest';
import { goalPlan, setAsidePerMonth } from './goalPlan';

describe('goalPlan', () => {
  it('house goal with two ideas picked (known answer)', () => {
    const plan = goalPlan({
      goalRappen: 4000000,
      savedRappen: 120000,
      months: 24,
      selectedSavingsRappen: [12000, 8000, 6000],
    });
    expect(plan.leftRappen).toBe(3880000);
    expect(plan.neededPerMonthRappen).toBe(161700); // 1'616.67 rounded up
    expect(plan.foundPerMonthRappen).toBe(26000);
    expect(plan.monthsAtFoundPace).toBe(150); // 149.2 rounded up
    expect(plan.onTrack).toBe(false);
    expect(plan.missingPerMonthRappen).toBe(135700);
  });

  it('is on track when the ideas cover the monthly need', () => {
    const plan = goalPlan({
      goalRappen: 300000,
      savedRappen: 0,
      months: 24,
      selectedSavingsRappen: [12000, 8000],
    });
    expect(plan.neededPerMonthRappen).toBe(12500);
    expect(plan.onTrack).toBe(true);
    expect(plan.missingPerMonthRappen).toBe(0);
    expect(plan.monthsAtFoundPace).toBe(15);
  });

  it('nothing picked yet: no pace', () => {
    const plan = goalPlan({ goalRappen: 500000, savedRappen: 0, months: 10, selectedSavingsRappen: [] });
    expect(plan.monthsAtFoundPace).toBeNull();
    expect(plan.missingPerMonthRappen).toBe(50000);
  });

  it('already saved more than the goal', () => {
    const plan = goalPlan({ goalRappen: 100000, savedRappen: 200000, months: 6, selectedSavingsRappen: [] });
    expect(plan.leftRappen).toBe(0);
    expect(plan.neededPerMonthRappen).toBe(0);
    expect(plan.onTrack).toBe(true);
  });
});

describe('setAsidePerMonth', () => {
  it('tax bill of CHF 2400 in 4 months', () => {
    expect(setAsidePerMonth(240000, 4)).toBe(60000);
  });
  it('rounds up to whole francs', () => {
    expect(setAsidePerMonth(100000, 3)).toBe(33400);
  });
});
