import { describe, it, expect } from 'vitest';
import { nextQuarter } from './quarter';

// Build dates with the local-time constructor (year, monthIndex, day) rather
// than parsing 'YYYY-MM-DD' strings — the latter parse as UTC midnight, which
// shifts the local getMonth()/getFullYear() the helper reads and makes these
// assertions timezone-dependent.
describe('nextQuarter', () => {
  it('advances Q1 → Q2 within the same year', () => {
    expect(nextQuarter(new Date(2026, 1, 14))).toEqual({ quarter: 2, year: 2026 }); // Feb
  });

  it('advances Q3 → Q4 within the same year', () => {
    expect(nextQuarter(new Date(2026, 7, 2))).toEqual({ quarter: 4, year: 2026 }); // Aug
  });

  it('rolls Q4 → Q1 of the following year', () => {
    expect(nextQuarter(new Date(2026, 10, 15))).toEqual({ quarter: 1, year: 2027 }); // Nov
  });

  it('treats each quarter boundary correctly', () => {
    expect(nextQuarter(new Date(2026, 0, 1))).toEqual({ quarter: 2, year: 2026 }); // Jan 1 — Q1 start
    expect(nextQuarter(new Date(2026, 2, 31))).toEqual({ quarter: 2, year: 2026 }); // Mar 31 — Q1 end
    expect(nextQuarter(new Date(2026, 3, 1))).toEqual({ quarter: 3, year: 2026 }); // Apr 1 — Q2 start
    expect(nextQuarter(new Date(2026, 11, 31))).toEqual({ quarter: 1, year: 2027 }); // Dec 31 — Q4 end
  });
});
