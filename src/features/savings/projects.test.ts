import { describe, expect, it } from 'vitest';
import { addProject, projectsState, removeProject } from './projects';

describe('savings projects', () => {
  it('has the seven preset goals', () => {
    expect(projectsState.projects.map((p) => p.key)).toEqual([
      'house', 'car', 'holiday', 'emergency', 'education', 'bucket', 'children',
    ]);
  });
  it('adds a project of your own and selects it', () => {
    const p = addProject({ name: 'Wedding', icon: 'celebration', amountRappen: 500000 });
    expect(p.preset).toBe(false);
    expect(projectsState.selected).toBe(p.key);
    expect(projectsState.projects).toHaveLength(8);
  });
  it('removes only own projects', () => {
    removeProject('car');
    expect(projectsState.projects.some((p) => p.key === 'car')).toBe(true);
    const own = projectsState.projects.find((p) => !p.preset)!;
    removeProject(own.key);
    expect(projectsState.projects).toHaveLength(7);
    expect(projectsState.selected).toBe('car');
  });
});
