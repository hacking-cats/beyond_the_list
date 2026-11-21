/**
 * Transactions for the app, read from the dummy challenge CSVs in data/dummy/.
 * TEMPORARY stand-in for the CSV TransactionSource adapter: the TransactionSource and
 * Transaction contracts are still draft. Once frozen, pages get transactions through
 * useServices() instead of importing this file.
 */
import accountCsv from '../../data/dummy/jeanine_2025_Account1_2025.csv?raw';
import cardCsv from '../../data/dummy/jeanine_2025_Account3_2025.csv?raw';
import categoriesJson from '../../content/categories.json';
import merchantsJson from '../../content/merchants.json';
import { categorizeAll } from '../engines/categorize/categorize';
import { mergeAccounts, parseCsv, toTransactions } from '../engines/ingest/ingest';
import type { Transaction } from '../engines/ingest/types';
import type { SpendingKind } from '../engines/insights/categoryShares';

export const OWN_ACCOUNTS = ['Account1', 'Account3'];

function load(text: string, accountId: string): Transaction[] {
  const { rows, errors } = parseCsv(text);
  if (errors.length) console.warn(`CSV ${accountId}:`, errors);
  return toTransactions(rows, accountId, OWN_ACCOUNTS);
}

export const transactions: Transaction[] = categorizeAll(
  mergeAccounts([load(accountCsv, 'Account1'), load(cardCsv, 'Account3')]),
  merchantsJson,
);

const kinds = new Map((categoriesJson as { key: string; kind: SpendingKind }[]).map((c) => [c.key, c.kind]));
export const kindOf = (category: string): SpendingKind => kinds.get(category) ?? 'essential';

/** Name of the person in the demo data (from the file names). */
export const demoPersonName = 'Jeanine';
