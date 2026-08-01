export type WeightedItem = { weight: number };
export type Rect = { top: number; left: number; width: number; height: number };

/**
 * Recursive "slice-and-dice" treemap (Shneiderman 1991): bisects the item
 * list by weight sum at each level, alternating split axis, so every leaf's
 * final area is exactly totalArea * (itemWeight / sumOfAllWeights) — this
 * holds by construction (each split's area ratio telescopes down to the
 * leaf, regardless of tree shape). No gaps, no overlaps, any N >= 1.
 * Returns one rect per input item, in the SAME order as `items` — sorting
 * happens on an internal copy only.
 */
export function treemap(items: WeightedItem[]): Rect[] {
  const order = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => b.item.weight - a.item.weight); // stable: ties keep original order

  const rects: Rect[] = new Array(items.length);
  split(order, { top: 0, left: 0, width: 100, height: 100 }, 'x', rects);
  return rects;
}

function split(
  entries: { item: WeightedItem; index: number }[],
  rect: Rect,
  axis: 'x' | 'y',
  out: Rect[],
): void {
  if (entries.length === 1) {
    out[entries[0].index] = rect;
    return;
  }

  const weights = entries.map((e) => e.item.weight);
  const total = weights.reduce((sum, w) => sum + w, 0);

  let cut = 1;
  let bestDiff = Infinity;
  let prefix = 0;
  for (let i = 1; i < weights.length; i++) {
    prefix += weights[i - 1];
    const diff = Math.abs(prefix - (total - prefix));
    if (diff < bestDiff) {
      bestDiff = diff;
      cut = i;
    }
  }

  const firstGroup = entries.slice(0, cut);
  const firstWeight = weights.slice(0, cut).reduce((sum, w) => sum + w, 0);
  // ponytail: guards against literal all-zero-weight data (avoids NaN from
  // dividing by 0) — falls back to an even count-based split. Not a
  // trust-boundary guard; this data is a static local TS array, not user input.
  const firstShare = total === 0 ? cut / entries.length : firstWeight / total;
  const nextAxis = axis === 'x' ? 'y' : 'x';

  if (axis === 'x') {
    const firstWidth = rect.width * firstShare;
    split(firstGroup, { ...rect, width: firstWidth }, nextAxis, out);
    split(entries.slice(cut), { ...rect, left: rect.left + firstWidth, width: rect.width - firstWidth }, nextAxis, out);
  } else {
    const firstHeight = rect.height * firstShare;
    split(firstGroup, { ...rect, height: firstHeight }, nextAxis, out);
    split(entries.slice(cut), { ...rect, top: rect.top + firstHeight, height: rect.height - firstHeight }, nextAxis, out);
  }
}
