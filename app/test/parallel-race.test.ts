/**
 * Live parallel-race levels: every lane must actually finish (the last frame is
 * sorted / on the target), and the expected algorithm wins the race. These are
 * watch-only levels, so this is their correctness gate.
 */
import { describe, it, expect } from 'vitest';
import { ARRAY_LESSONS } from '../src/content/array-levels';
import type { LevelDef } from '../src/content/types';
import { buildLanes, raceWinner } from '../src/ui/parallel-race';
import { isSorted } from '../src/engine/worlds/array';

function raceLevels(): LevelDef[] {
  const out: LevelDef[] = [];
  for (const lesson of ARRAY_LESSONS) {
    for (const def of [...(lesson.learn || []), ...lesson.test]) {
      if (def.race === 'parallelSort' || def.race === 'parallelSearch') out.push(def);
    }
  }
  return out;
}

describe('parallel-race lanes all finish', () => {
  it.each(raceLevels().map((d) => [d.title, d] as const))('%s', (_t, def) => {
    const lanes = buildLanes(def);
    expect(lanes.length).toBeGreaterThanOrEqual(2);
    for (const lane of lanes) {
      const last = lane.frames[lane.frames.length - 1];
      if (def.race === 'parallelSort') {
        expect(isSorted(last.arr), `${lane.name} ends sorted`).toBe(true);
      } else {
        expect(last.arr[last.i], `${lane.name} ends on target`).toBe(def.target);
      }
    }
  });

  it('binary wins the search race', () => {
    const def = raceLevels().find((d) => d.race === 'parallelSearch')!;
    expect(raceWinner(buildLanes(def))).toBe('Binary');
  });
});
