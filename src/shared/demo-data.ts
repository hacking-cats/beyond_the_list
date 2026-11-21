/**
 * Settings for the Savings page that do not come from the statements: preset goals,
 * icons for own projects and suggested amounts. Transactions come from the CSVs
 * (src/shared/transactions.ts). Money in Rappen.
 */

export type GoalKey = 'house' | 'car' | 'holiday' | 'emergency' | 'education' | 'bucket' | 'children';

/**
 * Preset goals: Material icon name and suggested amount when the user picks one.
 * Sized for the demo persona (single parent on a low wage): an emergency fund first,
 * then small family goals; the order is the order of the buttons.
 */
export const demoGoals: Record<GoalKey, { icon: string; amountRappen: number }> = {
  emergency: { icon: 'umbrella', amountRappen: 200000 },
  children: { icon: 'child_care', amountRappen: 100000 },
  holiday: { icon: 'flight', amountRappen: 120000 },
  education: { icon: 'school', amountRappen: 150000 },
  bucket: { icon: 'checklist', amountRappen: 50000 },
  car: { icon: 'directions_car', amountRappen: 600000 },
  house: { icon: 'home', amountRappen: 2000000 },
};

/** The goal selected when the Savings page opens. */
export const demoDefaultGoal: GoalKey = 'emergency';

/** Suggested amount for a project the user adds. */
export const demoNewProjectRappen = 100000;

/** Starting value of "Already saved": nothing (the statements have no savings account). */
export const demoSavedRappen = 0;

/** Icons the user can pick for a project of their own. */
export const projectIcons = [
  'pets', 'celebration', 'laptop', 'smartphone', 'pedal_bike', 'music_note', 'sports_soccer',
  'card_giftcard', 'construction', 'luggage', 'photo_camera', 'weekend', 'favorite',
];
