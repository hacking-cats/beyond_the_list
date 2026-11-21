/**
 * The shape every transaction has inside the app. Follows the draft data contract in
 * src/contracts/transaction.md; lives here until that contract is frozen and gets its
 * TypeScript file. Extra field: `originalName` (the CSV `name`, shown in Explained).
 */
export type TransactionKind = 'expense' | 'income' | 'transfer' | 'refund';

export interface Transaction {
  id: string;
  accountId: string;
  date: string; // YYYY-MM-DD, from transaction_date
  amountRappen: number; // signed integer: money out is negative
  kind: TransactionKind;
  counterparty: string;
  originalName: string;
  category?: string;
  status: 'settled' | 'pending';
  dataIssues?: string[];
}

export type CsvRow = Record<string, string>;
