/**
 * Sample appointment times for the advice-booking prototype. PostFinance has no public
 * booking interface, so these are made up, but they follow the real pattern: no Sundays,
 * evening slots on weekdays, Saturday mornings and early afternoons, some times taken,
 * and one fully booked day.
 * Pure: "today" is an input, no clock and no randomness (same input, same output).
 */
export interface AdviceSlot {
  /** "HH:MM", 24-hour clock. */
  time: string;
  free: boolean;
}

export interface AdviceDay {
  /** ISO date "YYYY-MM-DD". */
  date: string;
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number;
  slots: AdviceSlot[];
  hasFree: boolean;
}

export const WEEKDAY_TIMES = ['08:30', '10:00', '11:30', '14:00', '16:30', '18:30'];
export const SATURDAY_TIMES = ['08:30', '10:00', '11:30', '14:00'];

/** Position of the fully booked day in the list (shows how a full day looks). */
const FULL_DAY_INDEX = 3;

function addDays(iso: string, days: number): Date {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) throw new Error(`Expected YYYY-MM-DD, got ${iso}`);
  return new Date(Date.UTC(y, m - 1, d + days));
}

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/**
 * The next `count` days with advice (from tomorrow, Sundays skipped).
 * A slot is taken when (day of month + slot position) is divisible by 3, so every day
 * except the full one keeps several free times.
 */
export function sampleSlots(today: string, count = 6): AdviceDay[] {
  const days: AdviceDay[] = [];
  for (let offset = 1; days.length < count; offset++) {
    const date = addDays(today, offset);
    const weekday = date.getUTCDay();
    if (weekday === 0) continue;
    const full = days.length === FULL_DAY_INDEX;
    const times = weekday === 6 ? SATURDAY_TIMES : WEEKDAY_TIMES;
    const dayOfMonth = date.getUTCDate();
    const slots = times.map((time, i) => ({ time, free: !full && (dayOfMonth + i) % 3 !== 0 }));
    days.push({ date: isoDate(date), weekday, slots, hasFree: slots.some((s) => s.free) });
  }
  return days;
}

/** The first day with a free time, to preselect it. */
export function firstFreeDay(days: AdviceDay[]): AdviceDay | undefined {
  return days.find((d) => d.hasFree);
}
