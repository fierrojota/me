import { describe, it, expect } from 'vitest';
import { treemap } from './treemap';

const area = (r: { width: number; height: number }) => r.width * r.height;
const totalArea = (rects: { width: number; height: number }[]) => rects.reduce((sum, r) => sum + area(r), 0);

describe('treemap', () => {
  it('N=1 returns the entire container', () => {
    expect(treemap([{ weight: 42 }])).toEqual([{ top: 0, left: 0, width: 100, height: 100 }]);
  });

  it.each([2, 3, 5])('gives equal weights equal area, for N=%i', (n) => {
    const rects = treemap(Array.from({ length: n }, () => ({ weight: 1 })));
    const expected = 10000 / n;
    rects.forEach((r) => expect(area(r)).toBeCloseTo(expected, 5));
  });

  it('gives a dominant weight a proportionally larger area', () => {
    const [big, small1, small2] = treemap([{ weight: 800 }, { weight: 100 }, { weight: 100 }]);
    expect(area(big)).toBeCloseTo(8000, 5);
    expect(area(small1)).toBeCloseTo(1000, 5);
    expect(area(small2)).toBeCloseTo(1000, 5);
  });

  it.each([2, 3, 5])('always tiles the full container exactly, no gaps, for N=%i', (n) => {
    const rects = treemap(Array.from({ length: n }, (_, i) => ({ weight: i + 1 })));
    expect(totalArea(rects)).toBeCloseTo(10000, 5);
  });

  it('never produces negative or out-of-bounds coordinates', () => {
    const rects = treemap([{ weight: 800 }, { weight: 450 }, { weight: 200 }, { weight: 200 }]);
    rects.forEach((r) => {
      expect(r.top).toBeGreaterThanOrEqual(0);
      expect(r.left).toBeGreaterThanOrEqual(0);
      expect(r.top + r.height).toBeLessThanOrEqual(100.0001);
      expect(r.left + r.width).toBeLessThanOrEqual(100.0001);
    });
  });

  it('returns rects in input order, not internal sorted order', () => {
    const [lowWeightRect, highWeightRect] = treemap([{ weight: 10 }, { weight: 800 }]);
    expect(area(highWeightRect)).toBeGreaterThan(area(lowWeightRect));
  });
});
