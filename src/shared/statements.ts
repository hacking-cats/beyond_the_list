/**
 * Numbers the pages show, computed once from the CSV transactions with the engines.
 * Pages read these instead of demo numbers.
 */
import { balance, unknownOpening } from '../engines/insights/balance';
import { averageMonthlyIncome, averageMonthlySpending, categoryTotal, lastMonths, monthSummary, monthsWithData, percentOf, totalMatching } from '../engines/insights/monthly';
import { alternatives, type Alternative, type AlternativeRule } from '../engines/savings/alternatives';
import { suggestCuts } from '../engines/savings/suggestCuts';
import alternativesJson from '../../content/alternatives.json';
import { accountTransactions, kindOf, transactions } from './transactions';

export { transactions, kindOf, demoPersonName, hasCreditCard } from './transactions';

/** The last 12 months that have data (the averaging window). */
export const yearMonths = lastMonths(transactions, 12);
/** The newest month with data. */
export const latestMonth = monthsWithData(transactions).at(-1) ?? '';
export const latestSummary = monthSummary(transactions, latestMonth);

/** Average monthly spending per category over the last 12 months. */
export const monthlySpending = averageMonthlySpending(transactions, yearMonths, kindOf);

/** Cheaper alternatives found in the user's own payments (content/alternatives.json), biggest saving first. */
export const savingsAlternatives: Alternative[] = alternatives(transactions, yearMonths, alternativesJson as AlternativeRule[]);
/** The alternatives for one category, biggest saving first (dashboard tip). */
export const alternativesFor = (category: string): Alternative[] =>
  savingsAlternatives.filter((a) => a.category === category);

/** Generic cuts (halve a flexible category), only for categories without a specific alternative. */
const covered = new Set(savingsAlternatives.map((a) => a.category));
export const savingsCuts = suggestCuts(monthlySpending.filter((c) => !covered.has(c.key)));

/** Average monthly income over the last 12 months, and a monthly amount as a share of it (dashboard). */
export const monthlyIncome = averageMonthlyIncome(transactions, yearMonths);
export const shareOfIncome = (amountRappen: number): number => percentOf(amountRappen, monthlyIncome);

/** Transactions of the newest month, newest first (Explained tab). */
export const latestTransactions = transactions.filter((t) => t.date.startsWith(latestMonth));

/** Tax paid in the newest year of data (default for the expected final tax bill). */
export const taxPaidLastYear = categoryTotal(transactions, 'tax', latestMonth.slice(0, 4));

/** Health insurance (premiums and deductible) and all income in the newest year of data. */
export const insuranceLastYear = categoryTotal(transactions, 'insurance', latestMonth.slice(0, 4));
export const incomeLastYear = monthsWithData(transactions)
  .filter((m) => m.startsWith(latestMonth.slice(0, 4)))
  .reduce((sum, m) => sum + monthSummary(transactions, m).incomeRappen, 0);

/** Yearly Serafe fee (radio and TV) paid in the newest year of data; 0 when none. */
export const serafeLastYear = totalMatching(transactions, ['Serafe'], latestMonth.slice(0, 4));

/**
 * Balances (Transaction contract, rule 6): opening balance + settled rows per account.
 * The CSVs have no opening balance, so it is 0 on the first day of the data ("since <date>").
 */
const opening = unknownOpening(accountTransactions);
const lastDate = accountTransactions.reduce((max, t) => (t.date > max ? t.date : max), opening.date);
export const balances = {
  privateAccount: balance(accountTransactions, 'Account1', opening, lastDate),
  creditCard: balance(accountTransactions, 'Account3', opening, lastDate),
};
export const totalBalanceRappen = balances.privateAccount.balanceRappen + balances.creditCard.balanceRappen;
export const balanceSince = opening.date;

/** True when the statements show a salary. */
export const hasSalary = transactions.some((t) => t.kind === 'income');

export function dayLabel(date: string, locale: string): string {
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return date;
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-CH' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}

export function monthLabel(month: string, locale: string): string {
  const [y, m] = month.split('-').map(Number);
  if (!y || !m) return month;
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-CH' : 'en-GB', { month: 'long', year: 'numeric' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}
