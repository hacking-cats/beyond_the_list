import { describe, expect, it } from 'vitest';
import { pullProgress, settleOpen } from './pull';

describe('pullProgress', () => {
  it('follows the finger from shut', () => {
    expect(pullProgress(false, 0, 800)).toBe(0);
    expect(pullProgress(false, 200, 800)).toBe(0.25);
  });

  it('follows the finger from open, pushing up', () => {
    expect(pullProgress(true, -400, 800)).toBe(0.5);
  });

  it('stays between 0 and 1', () => {
    expect(pullProgress(false, -50, 800)).toBe(0);
    expect(pullProgress(false, 2000, 800)).toBe(1);
    expect(pullProgress(true, 300, 800)).toBe(1);
  });

  it('copes with an unmeasured panel', () => {
    expect(pullProgress(false, 100, 0)).toBe(0);
    expect(pullProgress(true, 100, 0)).toBe(1);
  });
});

describe('settleOpen', () => {
  it('opens past the threshold and snaps back before it', () => {
    expect(settleOpen(false, 240, 800, 2000)).toBe(true);
    expect(settleOpen(false, 120, 800, 2000)).toBe(false);
  });

  it('opens on a quick short flick down', () => {
    expect(settleOpen(false, 80, 800, 100)).toBe(true);
  });

  it('closes when pushed far enough up, or flicked up', () => {
    expect(settleOpen(true, -240, 800, 2000)).toBe(false);
    expect(settleOpen(true, -100, 800, 2000)).toBe(true);
    expect(settleOpen(true, -60, 800, 80)).toBe(false);
  });
});
