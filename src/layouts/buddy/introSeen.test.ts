import { describe, expect, it } from 'vitest';
import { INTRO_KEY, introSeen, markIntroSeen } from './introSeen';

const memory = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  };
};

describe('buddy intro flag', () => {
  it('is unseen on the first visit and seen after dismissing', () => {
    const store = memory();
    expect(introSeen(store)).toBe(false);
    markIntroSeen(store);
    expect(introSeen(store)).toBe(true);
    expect(store.getItem(INTRO_KEY)).toBe('1');
  });

  it('never throws when storage is missing or blocked', () => {
    const blocked = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    expect(introSeen(null)).toBe(false);
    expect(introSeen(blocked)).toBe(false);
    expect(() => markIntroSeen(blocked)).not.toThrow();
  });
});
