/**
 * Bubble layout for the spending overview: circle AREA is proportional to the value,
 * circles touch but never overlap, and the result is scaled to fit `width`.
 * Pure geometry (no money logic); greedy front placement, fine for a few dozen circles.
 */

export interface PackedCircle {
  index: number; // position in the input array
  x: number;
  y: number;
  r: number;
}

export interface Packing {
  circles: PackedCircle[];
  width: number;
  height: number;
}

interface C { index: number; x: number; y: number; r: number }

function tangentTo(a: C, b: C, r: number, pad: number): Array<{ x: number; y: number }> {
  const da = a.r + r + pad;
  const db = b.r + r + pad;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy);
  if (d === 0 || d > da + db || d < Math.abs(da - db)) return [];
  const l = (da * da - db * db + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(da * da - l * l, 0));
  const mx = a.x + (l * dx) / d;
  const my = a.y + (l * dy) / d;
  return [
    { x: mx + (h * dy) / d, y: my - (h * dx) / d },
    { x: mx - (h * dy) / d, y: my + (h * dx) / d },
  ];
}

const overlaps = (p: { x: number; y: number }, r: number, placed: C[], pad: number) =>
  placed.some((c) => Math.hypot(p.x - c.x, p.y - c.y) < c.r + r + pad - 1e-6);

export function packCircles(values: number[], width: number, pad = 3): Packing {
  const order = values
    .map((v, index) => ({ index, r: Math.sqrt(Math.max(v, 0)) }))
    .filter((c) => c.r > 0)
    .sort((a, b) => b.r - a.r);
  const placed: C[] = [];
  for (const c of order) {
    if (placed.length === 0) {
      placed.push({ index: c.index, x: 0, y: 0, r: c.r });
      continue;
    }
    if (placed.length === 1) {
      const first = placed[0]!;
      placed.push({ index: c.index, x: first.r + c.r + pad, y: 0, r: c.r });
      continue;
    }
    let best: { x: number; y: number } | null = null;
    let bestDist = Infinity;
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        for (const p of tangentTo(placed[i]!, placed[j]!, c.r, pad)) {
          if (overlaps(p, c.r, placed, pad)) continue;
          const dist = Math.hypot(p.x, p.y);
          if (dist < bestDist) {
            bestDist = dist;
            best = p;
          }
        }
      }
    }
    // Fallback (should not happen): put it to the right of everything.
    const p = best ?? { x: Math.max(...placed.map((q) => q.x + q.r)) + c.r + pad, y: 0 };
    placed.push({ index: c.index, x: p.x, y: p.y, r: c.r });
  }
  if (placed.length === 0) return { circles: [], width, height: 0 };

  const minX = Math.min(...placed.map((c) => c.x - c.r));
  const maxX = Math.max(...placed.map((c) => c.x + c.r));
  const minY = Math.min(...placed.map((c) => c.y - c.r));
  const maxY = Math.max(...placed.map((c) => c.y + c.r));
  const scale = width / (maxX - minX);
  return {
    width,
    height: (maxY - minY) * scale,
    circles: placed.map((c) => ({
      index: c.index,
      x: (c.x - minX) * scale,
      y: (c.y - minY) * scale,
      r: c.r * scale,
    })),
  };
}
