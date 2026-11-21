import type { CsvRow, Transaction } from './types';

/**
 * Ingest engine: challenge CSV text -> Transaction[]. Pure functions, money in Rappen.
 * Spec: ./SPEC.md and the data contract in src/contracts/transaction.md (both draft).
 */

const REQUIRED = [
  'name', 'type', 'source_id', 'source_label', 'target_id', 'target_label',
  'transaction_date', 'amount', 'currency', 'status', 'exchange_rate', 'base_amount',
];

/** RFC 4180 CSV: comma separated, fields may be quoted ("a, b"), "" is a quote. */
function splitCsv(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const src = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < src.length; i++) {
    const c = src[i]!;
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((f) => f !== '')) out.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f !== '')) out.push(row);
  return out;
}

export function parseCsv(text: string): { rows: CsvRow[]; errors: string[] } {
  const [header, ...lines] = splitCsv(text);
  if (!header) return { rows: [], errors: ['empty file'] };
  const missing = REQUIRED.filter((c) => !header.includes(c));
  if (missing.length) return { rows: [], errors: [`missing columns: ${missing.join(', ')}`] };
  const errors: string[] = [];
  const rows: CsvRow[] = [];
  lines.forEach((cells, i) => {
    if (cells.length !== header.length) {
      errors.push(`line ${i + 2}: ${cells.length} fields, expected ${header.length}`);
      return;
    }
    rows.push(Object.fromEntries(header.map((h, j) => [h, cells[j]!.trim()])));
  });
  return { rows, errors };
}

/** Small stable hash (FNV-1a), enough to give rows a stable id. */
function hash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/** Round to Rappen exactly once, here (SPEC rule 2). */
export function toRappen(value: string): number {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(`not a number: ${value}`);
  return Math.round(n * 100);
}

/**
 * Rows of ONE account file -> transactions seen from that account.
 * The side that is our account sets the sign; money between our own accounts is a transfer.
 */
export function toTransactions(rows: CsvRow[], accountId: string, ownAccountIds: string[]): Transaction[] {
  const own = new Set(ownAccountIds);
  const seen = new Map<string, number>();
  return rows.map((r) => {
    const fromOwn = own.has(r.source_id!);
    const toOwn = own.has(r.target_id!);
    const amount = toRappen(r.base_amount!);
    const out = r.source_id === accountId;
    const kind: Transaction['kind'] =
      r.type === 'transfer' || (fromOwn && toOwn) ? 'transfer' : toOwn && !fromOwn ? 'income' : 'expense';
    const counterparty = out ? r.target_label! : r.source_label!;
    const date = r.transaction_date!;
    const amountRappen = out ? -amount : amount;
    const key = `${accountId}|${date}|${amountRappen}|${r.name}`;
    const n = (seen.get(key) ?? 0) + 1; // identical rows are kept, each with its own id (rule 4)
    seen.set(key, n);
    const dataIssues =
      r.currency !== (r.base_currency || 'CHF') && Number(r.exchange_rate) === 1 ? ['eur-rate-1'] : undefined;
    return {
      id: hash(`${key}|${n}`),
      accountId,
      date,
      amountRappen,
      kind,
      counterparty,
      originalName: r.name!,
      status: r.status === 'pending' ? 'pending' : 'settled',
      ...(dataIssues ? { dataIssues } : {}),
    };
  });
}

/**
 * Merge the accounts: a transfer between our own accounts (the credit card bill paid from
 * the private account) is in both files and is kept once, on the paying side (rule 2).
 * Income from someone we also buy from is a refund (data contract: income from a shop).
 * Result is sorted newest first.
 */
export function mergeAccounts(lists: Transaction[][]): Transaction[] {
  const all = lists.flat();
  const paid = new Set(
    all.filter((t) => t.kind === 'transfer' && t.amountRappen < 0).map((t) => `${t.date}|${-t.amountRappen}`),
  );
  const kept = all.filter(
    (t) => !(t.kind === 'transfer' && t.amountRappen > 0 && paid.has(`${t.date}|${t.amountRappen}`)),
  );
  const merchants = new Set(kept.filter((t) => t.kind === 'expense').map((t) => t.counterparty));
  return kept
    .map((t) => (t.kind === 'income' && merchants.has(t.counterparty) ? { ...t, kind: 'refund' as const } : t))
    .sort((a, b) => (a.date === b.date ? a.amountRappen - b.amountRappen : a.date < b.date ? 1 : -1));
}
