/**
 * Transactions for the app, read from the dummy challenge CSVs in data/dummy/.
 * TEMPORARY stand-in for the CSV TransactionSource adapter: the TransactionSource and
 * Transaction contracts are still draft. Once frozen, pages get transactions through
 * useServices() instead of importing this file.
 */
// Source of truth for the app: Jeanine as a single mother of two on a low wage, whose children
// use her saved credit card (jeanine_singlemom_2025_*, see data/dummy/README.md). Every screen
// reads these two files. Other files in data/dummy/ (the original jeanine_2025 sample,
// andres_2025) are only used by tests.
import accountCsv from '../../data/dummy/jeanine_singlemom_2025_Account1_2025.csv?raw';
import cardCsv from '../../data/dummy/jeanine_singlemom_2025_Account3_2025.csv?raw';
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

const perAccount: Transaction[][] = [load(accountCsv, 'Account1'), load(cardCsv, 'Account3')];

/** Each account's own rows, before merging (needed for balances: transfers count on both sides). */
export const accountTransactions: Transaction[] = perAccount.flat();

/** True when the statements include a credit card account (Account3). */
export const hasCreditCard = accountTransactions.some((t) => t.accountId === 'Account3');

export const transactions: Transaction[] = categorizeAll(mergeAccounts(perAccount), merchantsJson);

const kinds = new Map((categoriesJson as { key: string; kind: SpendingKind }[]).map((c) => [c.key, c.kind]));
export const kindOf = (category: string): SpendingKind => kinds.get(category) ?? 'essential';

const categoryIcons = new Map((categoriesJson as { key: string; icon: string }[]).map((c) => [c.key, c.icon]));
export type SpendingGroup = 'recurring' | 'occasional' | 'cutBack';
const groups = new Map((categoriesJson as { key: string; group: SpendingGroup }[]).map((c) => [c.key, c.group]));
/** recurring essentials, occasional essentials, or spending that could be cut back. */
export const groupOf = (category: string): SpendingGroup => groups.get(category) ?? 'occasional';
export const SPENDING_GROUPS: SpendingGroup[] = ['recurring', 'occasional', 'cutBack'];

/** Material icon name of a category (see src/shared/ui/icons.ts). */
export const iconOf = (category: string): string => categoryIcons.get(category) ?? 'help_outline';

/** Name of the person in the demo data (from the file names). */
export const demoPersonName = 'Jeanine';
