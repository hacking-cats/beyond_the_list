/**
 * Numbers the pages show, computed once from the CSV transactions with the engines.
 * Pages read these instead of demo numbers.
 */
import { averageMonthlySpending, categoryTotal, lastMonths, monthSummary, monthsWithData } from '../engines/insights/monthly';
import { suggestCuts } from '../engines/savings/suggestCuts';
import { kindOf, transactions } from './transactions';
import { intlLocale } from '../i18n/languages';

export { transactions, kindOf, demoPersonName } from './transactions';

/** The last 12 months that have data (the averaging window). */
export const yearMonths = lastMonths(transactions, 12);
/** The newest month with data. */
export const latestMonth = monthsWithData(transactions).at(-1) ?? '';
export const latestSummary = monthSummary(transactions, latestMonth);

/** Average monthly spending per category over the last 12 months. */
export const monthlySpending = averageMonthlySpending(transactions, yearMonths, kindOf);
export const savingsCuts = suggestCuts(monthlySpending);

/** Transactions of the newest month, newest first (Explained tab). */
export const latestTransactions = transactions.filter((t) => t.date.startsWith(latestMonth));

/** Tax paid in the newest year of data (default for the expected final tax bill). */
export const taxPaidLastYear = categoryTotal(transactions, 'tax', latestMonth.slice(0, 4));

/** True when the statements show a salary. */
export const hasSalary = transactions.some((t) => t.kind === 'income');

export function monthLabel(month: string, locale: string): string {
  const [y, m] = month.split('-').map(Number);
  if (!y || !m) return month;
  return new Intl.DateTimeFormat(intlLocale(locale), { month: 'long', year: 'numeric' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}
