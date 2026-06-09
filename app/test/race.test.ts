/**
 * The complexity-race figures are measured by actually running each algorithm
 * through the interpreter, so they must hold up: binary beats linear and the gap
 * widens with size; the sort that wins depends on the data.
 */
import { describe, it, expect } from 'vitest';
import { searchGrowth, sortCompare } from '../src/ui/race';

describe('complexity race counts', () => {
  it('binary beats linear, and the gap grows with input size', () => {
    const rows = searchGrowth([8, 16, 32, 64]);
    for (const r of rows) {
      expect(r.linear, `linear@${r.n} ran`).toBeGreaterThan(0);
      expect(r.binary, `binary@${r.n} ran`).toBeGreaterThan(0);
      expect(r.binary, `binary < linear @${r.n}`).toBeLessThan(r.linear);
    }
    const first = rows[0], last = rows[rows.length - 1];
    expect(last.linear / last.binary).toBeGreaterThan(first.linear / first.binary);
  });

  it('all three sorts complete and report positive op-counts', () => {
    const c = sortCompare([5, 2, 8, 1, 4]);
    expect(c.bubble).toBeGreaterThan(0);
    expect(c.selection).toBeGreaterThan(0);
    expect(c.insertion).toBeGreaterThan(0);
  });

  it('selection does the most work on a nearly-sorted row (it never adapts)', () => {
    const c = sortCompare([1, 2, 4, 3, 5, 6]);
    // Bubble and insertion both finish fast once the row is in order;
    // selection still scans the whole remaining row every pass.
    expect(c.selection).toBeGreaterThanOrEqual(c.bubble);
    expect(c.selection).toBeGreaterThanOrEqual(c.insertion);
  });
});
