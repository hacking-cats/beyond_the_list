/**
 * Remembers that the "meet your buddy" banner was dismissed, so it shows only on the first visit.
 * Uses the browser's localStorage directly until the Storage contract (src/contracts/storage.md,
 * draft) has an implementation; then this should move to useServices().storage.
 * Every access is guarded: private windows and blocked storage just show the banner again.
 */

export const INTRO_KEY = 'btl.buddyIntroSeen.v1';

type KeyValue = Pick<globalThis.Storage, 'getItem' | 'setItem'>;

function defaultStore(): KeyValue | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function introSeen(store: KeyValue | null = defaultStore()): boolean {
  try {
    return store?.getItem(INTRO_KEY) === '1';
  } catch {
    return false;
  }
}

export function markIntroSeen(store: KeyValue | null = defaultStore()): void {
  try {
    store?.setItem(INTRO_KEY, '1');
  } catch {
    // Storage blocked: the banner shows again next time, which is harmless.
  }
}
