/**
 * The budget challenges must genuinely discriminate: on each Challenge level the
 * intended sort fits the move budget, and the WRONG instinct (the sort that won
 * the previous level) blows it. Otherwise there's no struggle and no lesson.
 */
import { describe, it, expect } from 'vitest';
import { L16_LEARN } from '../src/content/array-levels';
import { sortCompare } from '../src/ui/race';

describe('budget challenges force the right choice', () => {
  it('Best Case: an adaptive sort fits ≤10; selection does not', () => {
    const lvl = L16_LEARN[0];
    const c = sortCompare(lvl.bars!);
    expect(Math.min(c.insertion, c.bubble)).toBeLessThanOrEqual(lvl.maxOps!);
    expect(c.selection).toBeGreaterThan(lvl.maxOps!);
  });

  it('Worst Case: selection fits ≤30; the adaptive sorts do not', () => {
    const lvl = L16_LEARN[1];
    const c = sortCompare(lvl.bars!);
    expect(c.selection).toBeLessThanOrEqual(lvl.maxOps!);
    expect(c.bubble).toBeGreaterThan(lvl.maxOps!);
    expect(c.insertion).toBeGreaterThan(lvl.maxOps!);
  });
});
