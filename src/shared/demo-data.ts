/**
 * Settings for the Savings page that do not come from the statements: preset goals,
 * icons for own projects and suggested amounts. Transactions come from the CSVs
 * (src/shared/transactions.ts). Money in Rappen.
 */

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

/** Starting value of "Already saved" (the statements have no savings account). */
export const demoSavedRappen = 120000;

/** Icons the user can pick for a project of their own. */
export const projectIcons = [
  'pets', 'celebration', 'laptop', 'smartphone', 'pedal_bike', 'music_note', 'sports_soccer',
  'card_giftcard', 'construction', 'luggage', 'photo_camera', 'weekend', 'favorite',
];
