import type { Transaction } from '../ingest/types';

/**
 * Categorize engine: merchant -> category, using content/merchants.json. Pure.
 * Spec: ./SPEC.md (draft). Rules: user corrections win; unknown merchants go to `other`.
 * Transfers between own accounts get their own category; income stays `income` (salary)
 * unless a rule matches it (e.g. help from family).
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
  const own = userRules.find((r) => r.counterparty === tx.counterparty);
  if (own) return { category: own.category };
  const rule = bestRule(`${tx.counterparty} ${tx.originalName}`, merchants);
  if (tx.kind === 'income') return { category: rule?.category ?? 'income' };
  return { category: rule?.category ?? 'other' };
}

/**
 * The rule with the longest matching part wins (the most specific one), so
 * "Krankenkasse Mahngebühr" goes to fees, not to health insurance. On a tie the earlier rule wins.
 */
function bestRule(text: string, merchants: MerchantRule[]): MerchantRule | undefined {
  const hay = text.toLowerCase();
  let best: MerchantRule | undefined;
  let bestLength = 0;
  for (const m of merchants) {
    for (const part of m.match) {
      if (part.length > bestLength && hay.includes(part.toLowerCase())) {
        best = m;
        bestLength = part.length;
      }
    }
  }
  return best;
}

export function categorizeAll(txs: Transaction[], merchants: MerchantRule[], userRules: UserRule[] = []): Transaction[] {
  return txs.map((t) => ({ ...t, ...categorize(t, merchants, userRules) }));
}
