import type { Transaction } from '../ingest/types';

/**
 * Categorize engine: merchant -> category, using content/merchants.json. Pure.
 * Spec: ./SPEC.md (draft). Rules: user corrections win; unknown merchants go to `other`.
 * Transfers between own accounts and salary income get their own category.
 */
export interface MerchantRule {
  match: string[]; // case-insensitive parts of the counterparty or the original name
  name: string;
  category: string;
}

export interface UserRule {
  counterparty: string;
  category: string;
}

export function categorize(
  tx: Transaction,
  merchants: MerchantRule[],
  userRules: UserRule[] = [],
): { category: string } {
  if (tx.kind === 'transfer') return { category: 'transfer' };
  if (tx.kind === 'income') return { category: 'income' };
  const own = userRules.find((r) => r.counterparty === tx.counterparty);
  if (own) return { category: own.category };
  const hay = `${tx.counterparty} ${tx.originalName}`.toLowerCase();
  const rule = merchants.find((m) => m.match.some((part) => hay.includes(part.toLowerCase())));
  return { category: rule?.category ?? 'other' };
}

export function categorizeAll(txs: Transaction[], merchants: MerchantRule[], userRules: UserRule[] = []): Transaction[] {
  return txs.map((t) => ({ ...t, ...categorize(t, merchants, userRules) }));
}
