/** Next calendar quarter relative to `now`, rolling the year over from Q4→Q1. */
export function nextQuarter(now: Date = new Date()): { quarter: number; year: number } {
  const currentQuarter = Math.floor(now.getMonth() / 3) + 1; // 1..4
  return currentQuarter === 4
    ? { quarter: 1, year: now.getFullYear() + 1 }
    : { quarter: currentQuarter + 1, year: now.getFullYear() };
}
