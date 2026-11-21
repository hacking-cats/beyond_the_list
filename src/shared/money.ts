/**
 * Money helpers. Money is always an integer number of Rappen (1 CHF = 100 Rappen),
 * shown Swiss style: `CHF 1'234.50`, negative `-CHF 1'234.50` (see AGENTS.md).
 */

export type Rappen = number;

export interface FormatOptions {
  /** Show "+" before positive amounts, e.g. credits in a statement list. */
  sign?: boolean;
  /** 2 (default) shows Rappen; 0 rounds to whole francs, e.g. goal amounts. */
  decimals?: 0 | 2;
}

export function assertRappen(value: number): void {
  if (!Number.isInteger(value)) {
    throw new Error(`Money must be an integer number of Rappen, got ${value}`);
  }
}

function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

export function formatChf(amountRappen: Rappen, options: FormatOptions = {}): string {
  assertRappen(amountRappen);
  const decimals = options.decimals ?? 2;
  const abs = Math.abs(amountRappen);
  let body: string;
  if (decimals === 0) {
    body = groupThousands(String(Math.round(abs / 100)));
  } else {
    const francs = Math.floor(abs / 100);
    const rappen = String(abs % 100).padStart(2, '0');
    body = `${groupThousands(String(francs))}.${rappen}`;
  }
  const prefix = amountRappen < 0 ? '-' : options.sign && amountRappen > 0 ? '+' : '';
  return `${prefix}CHF ${body}`;
}

/** Whole francs to Rappen, for amounts the user picks with a slider. */
export function chfToRappen(francs: number): Rappen {
  return Math.round(francs * 100);
}
