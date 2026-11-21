import type { Transaction } from '../ingest/types';

/**
 * Account balance (Transaction contract, rule 6; insights SPEC rule 4). Pure; money in Rappen.
 * Balance = opening balance + the account's own settled rows from the opening date to `asOf`.
 * Use the rows of ONE account before transfers are merged away, so a transfer between our
 * accounts counts on both sides and cancels out in a total.
 */
export interface Opening {
  amountRappen: number;
  date: string; // YYYY-MM-DD; rows before this date are ignored
}

export interface Balance {
  balanceRappen: number;
  sinceDate: string;
  pendingRappen: number; // pending rows in the same period, not part of the balance
}

export function balance(txs: Transaction[], accountId: string, opening: Opening, asOf: string): Balance {
  if (!Number.isInteger(opening.amountRappen)) throw new Error('opening balance must be integer Rappen');
  let settled = opening.amountRappen;
  let pending = 0;
  for (const t of txs) {
    if (t.accountId !== accountId || t.date < opening.date || t.date > asOf) continue;
    if (t.status === 'pending') pending += t.amountRappen;
    else settled += t.amountRappen;
  }
  return { balanceRappen: settled, sinceDate: opening.date, pendingRappen: pending };
}

/** Opening balance when the source has none: 0 on the first day of the data. */
export function unknownOpening(txs: Transaction[]): Opening {
  const first = txs.reduce((min, t) => (t.date < min ? t.date : min), txs[0]?.date ?? '');
  return { amountRappen: 0, date: first };
}
