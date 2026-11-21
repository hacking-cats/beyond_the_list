import { reactive } from 'vue';
import { demoGoals, type GoalKey } from '../../shared/demo-data';

/**
 * Savings goals shown on the Savings page: the presets plus projects the user adds.
 * UI state only, kept in memory for this session (nothing is stored on the device yet:
 * the Storage contract is still draft). A photo is a data URL that never leaves the phone.
 */
export interface SavingsProject {
  key: string;
  /** Preset goals have a name in i18n (features.savings.goals.<key>); user projects have `name`. */
  preset: boolean;
  name?: string;
  icon: string; // Material icon name
  image?: string; // data URL of a photo the user picked
  amountRappen: number;
}

const presets: SavingsProject[] = (Object.keys(demoGoals) as GoalKey[]).map((key) => ({
  key,
  preset: true,
  icon: demoGoals[key].icon,
  amountRappen: demoGoals[key].amountRappen,
}));

export const projectsState = reactive({
  projects: presets,
  selected: 'car',
});

let counter = 0;

export function addProject(p: { name: string; icon: string; image?: string; amountRappen: number }): SavingsProject {
  counter += 1;
  const project: SavingsProject = { key: `own-${counter}`, preset: false, ...p };
  projectsState.projects.push(project);
  projectsState.selected = project.key;
  return project;
}

export function removeProject(key: string): void {
  const i = projectsState.projects.findIndex((p) => p.key === key && !p.preset);
  if (i >= 0) projectsState.projects.splice(i, 1);
  if (projectsState.selected === key) projectsState.selected = 'car';
}

/** Images over this size are refused, to keep the app fast on older phones. */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
