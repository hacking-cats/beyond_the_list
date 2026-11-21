import { assertRappen, type Rappen } from '../../shared/money';

/**
 * Savings goal plan (klar V2). Pure: plain data in, plain data out, money in Rappen.
 * Monthly amounts are rounded UP to whole francs, so following the plan always reaches the goal.
 */

export interface GoalPlanInput {
  goalRappen: Rappen;
  savedRappen: Rappen;
  /** Months until the user wants to reach the goal (at least 1). */
  months: number;
  /** Monthly savings the user picked from the spending ideas. */
  selectedSavingsRappen: Rappen[];
}

export interface GoalPlan {
  leftRappen: Rappen;
  neededPerMonthRappen: Rappen;
  foundPerMonthRappen: Rappen;
  /** Months to the goal at the found pace; null when nothing is found yet. */
  monthsAtFoundPace: number | null;
  onTrack: boolean;
  missingPerMonthRappen: Rappen;
}

export function ceilToFranc(rappen: number): Rappen {
  return Math.ceil(rappen / 100) * 100;
}

export function goalPlan(input: GoalPlanInput): GoalPlan {
  [input.goalRappen, input.savedRappen, ...input.selectedSavingsRappen].forEach(assertRappen);
  const months = Math.max(1, Math.floor(input.months));
  const leftRappen = Math.max(input.goalRappen - input.savedRappen, 0);
  const neededPerMonthRappen = ceilToFranc(leftRappen / months);
  const foundPerMonthRappen = input.selectedSavingsRappen.reduce((sum, v) => sum + v, 0);
  const monthsAtFoundPace =
    foundPerMonthRappen > 0 ? Math.ceil(leftRappen / foundPerMonthRappen) : null;
  const onTrack = foundPerMonthRappen >= neededPerMonthRappen;
  return {
    leftRappen,
    neededPerMonthRappen,
    foundPerMonthRappen,
    monthsAtFoundPace,
    onTrack,
    missingPerMonthRappen: onTrack ? 0 : neededPerMonthRappen - foundPerMonthRappen,
  };
}

/** How much to put aside each month for a bill that arrives in `months` months. */
export function setAsidePerMonth(billRappen: Rappen, months: number): Rappen {
  assertRappen(billRappen);
  return ceilToFranc(billRappen / Math.max(1, Math.floor(months)));
}
