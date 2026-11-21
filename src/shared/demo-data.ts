/**
 * Made-up demo data for klar V2. TEMPORARY: lives here until the TransactionSource
 * contract is frozen and its fake adapter exists (see src/contracts/transaction-source.md).
 * Texts are not here: every user-facing string is in src/i18n. Money in Rappen.
 */
import type { CategorySpending } from '../engines/insights/categoryShares';

export const demoAccount = {
  balanceRappen: 841235,
};

/** Statement lines shown on Movements. `key` points to features.movements.lines.<key>. */
export interface DemoLine {
  key: 'salary' | 'child' | 'tax' | 'insurance' | 'serafe' | 'dentist' | 'groceries';
  originalName: string; // as the bank prints it; never translated
  amountRappen: number;
  newToYou: boolean;
}

export const demoLines: DemoLine[] = [
  { key: 'salary', originalName: 'LOHN ALPENTECH AG', amountRappen: 720000, newToYou: false },
  { key: 'child', originalName: 'FAMILIENZULAGE', amountRappen: 23000, newToYou: false },
  { key: 'tax', originalName: 'STEUERVERWALTUNG KT. BERN PROV.', amountRappen: -35000, newToYou: true },
  { key: 'insurance', originalName: 'ALPINA KRANKENKASSE', amountRappen: -41260, newToYou: false },
  { key: 'serafe', originalName: 'SERAFE AG', amountRappen: -33500, newToYou: true },
  { key: 'dentist', originalName: 'ZAHNARZTPRAXIS LÄNGGASSE', amountRappen: -18000, newToYou: false },
  { key: 'groceries', originalName: 'MIGROS BERN WESTSIDE', amountRappen: -12640, newToYou: false },
];

/** Monthly average spending per category, last 3 months (Dashboard). */
export const demoSpending: CategorySpending[] = [
  { key: 'rent', amountRappen: 185000, kind: 'essential' },
  { key: 'groceries', amountRappen: 92000, kind: 'essential' },
  { key: 'insurance', amountRappen: 41300, kind: 'essential' },
  { key: 'holiday', amountRappen: 30000, kind: 'flexible' },
  { key: 'kids', amountRappen: 26000, kind: 'essential' },
  { key: 'takeaway', amountRappen: 24000, kind: 'flexible' },
  { key: 'shop', amountRappen: 18500, kind: 'flexible' },
  { key: 'transport', amountRappen: 18000, kind: 'essential' },
  { key: 'fun', amountRappen: 16000, kind: 'flexible' },
  { key: 'phone', amountRappen: 13000, kind: 'flexible' },
  { key: 'health', amountRappen: 9500, kind: 'essential' },
  { key: 'coffee', amountRappen: 6800, kind: 'flexible' },
  { key: 'stream', amountRappen: 5200, kind: 'flexible' },
];

/** Savings ideas from spending habits (Savings). Texts in features.savings.ideas.<key>. */
export interface DemoIdea {
  key: 'takeaway' | 'shop' | 'phone' | 'coffee' | 'stream';
  nowRappen: number;
  saveRappen: number;
  hasWit: boolean;
}

export const demoIdeas: DemoIdea[] = [
  { key: 'takeaway', nowRappen: 24000, saveRappen: 12000, hasWit: true },
  { key: 'shop', nowRappen: 18500, saveRappen: 8000, hasWit: false },
  { key: 'phone', nowRappen: 13000, saveRappen: 6000, hasWit: false },
  { key: 'coffee', nowRappen: 6800, saveRappen: 4500, hasWit: false },
  { key: 'stream', nowRappen: 5200, saveRappen: 3300, hasWit: false },
];

export type GoalKey = 'house' | 'car' | 'holiday' | 'emergency' | 'education' | 'bucket' | 'children';

/** Preset goals: Material icon name and suggested amount when the user picks one. */
export const demoGoals: Record<GoalKey, { icon: string; amountRappen: number }> = {
  house: { icon: 'home', amountRappen: 4000000 },
  car: { icon: 'directions_car', amountRappen: 1500000 },
  holiday: { icon: 'flight', amountRappen: 300000 },
  emergency: { icon: 'umbrella', amountRappen: 1000000 },
  education: { icon: 'school', amountRappen: 2000000 },
  bucket: { icon: 'checklist', amountRappen: 800000 },
  children: { icon: 'child_care', amountRappen: 3000000 },
};

/** Suggested amount for a project the user adds. */
export const demoNewProjectRappen = 500000;

/** Icons the user can pick for a project of their own. */
export const projectIcons = [
  'pets', 'celebration', 'laptop', 'smartphone', 'pedal_bike', 'music_note', 'sports_soccer',
  'card_giftcard', 'construction', 'luggage', 'photo_camera', 'weekend', 'favorite',
];

export const demoSavedRappen = 120000;

/** Expected final tax bill (Dashboard > Coming up). */
export const demoTaxBillRappen = 240000;
