/**
 * Pure helpers for the pull-down buddy panel: how far it is open while the finger drags,
 * and whether it should snap open or shut when the finger lets go. No DOM, unit-tested.
 */

/** Share of the panel to drag before letting go opens it. */
export const OPEN_THRESHOLD = 0.25;
/** A quick flick opens or closes even when it is short (pixels per millisecond). */
export const FLICK_SPEED = 0.5;

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

/**
 * How far the panel is open, 0 (shut) to 1 (fully open).
 * `startOpen` is whether the panel was open when the drag began; `offsetY` is the drag
 * distance in pixels (down is positive); `height` is the panel height in pixels.
 */
export function pullProgress(startOpen: boolean, offsetY: number, height: number): number {
  if (height <= 0) return startOpen ? 1 : 0;
  return clamp01((startOpen ? 1 : 0) + offsetY / height);
}

/**
 * Where the panel settles when the finger lets go: true for open.
 * A flick wins over the position; otherwise it opens past OPEN_THRESHOLD when pulled down
 * from shut, and stays open unless pushed up past OPEN_THRESHOLD when it started open.
 */
export function settleOpen(startOpen: boolean, offsetY: number, height: number, durationMs: number): boolean {
  const speed = durationMs > 0 ? offsetY / durationMs : 0;
  if (speed >= FLICK_SPEED) return true;
  if (speed <= -FLICK_SPEED) return false;
  const progress = pullProgress(startOpen, offsetY, height);
  return startOpen ? progress > 1 - OPEN_THRESHOLD : progress >= OPEN_THRESHOLD;
}
