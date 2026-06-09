/**
 * ui/race — operation-count comparisons for complexity-race levels.
 *
 * Each figure comes from actually running the algorithm (as blocks) through the
 * shared interpreter and reading its move/op counter — the same number the
 * learner watches climb. No formulae are hard-coded; the gap is measured, so it
 * is always honest. This is Big-O intuition without any notation.
 */
import type { LevelDef } from '../content/types';
import { BUBBLE, SELECTION, INSERTION, LINEAR, BINARY } from '../content/array-levels';
import { parseArray } from '../engine/worlds/array';
import { runArray } from '../interpreter/array';
import { buildProgram, type DemoSpec } from '../interpreter/dsl';

function mkDef(bars: number[], goal: 'sort' | 'find' | 'search', target?: number): LevelDef {
  return { name: '', icon: '', title: '', text: '', par: null, palette: [], combo: false, world: 'array', bars, goal, target };
}

function opsFor(def: LevelDef, spec: DemoSpec[]): number {
  const r = runArray(buildProgram(spec), [], parseArray(def));
  return r.outcome.win ? r.outcome.moves : -1;
}

export interface GrowthRow { n: number; linear: number; binary: number; }

/** Linear vs binary search op-counts across input sizes (worst case: target last). */
export function searchGrowth(sizes: number[] = [8, 16, 32, 64]): GrowthRow[] {
  return sizes.map((n) => {
    const bars = Array.from({ length: n }, (_, k) => (k + 1) * 2); // sorted evens
    const target = n * 2; // last element — linear's worst case
    return {
      n,
      linear: opsFor(mkDef(bars, 'find', target), LINEAR as DemoSpec[]),
      binary: opsFor(mkDef(bars, 'search', target), BINARY as DemoSpec[]),
    };
  });
}

/** Linear vs binary op-count on one specific row/target (the level the learner solved). */
export function searchOnRow(bars: number[], target: number): { linear: number; binary: number } {
  return {
    linear: opsFor(mkDef(bars, 'find', target), LINEAR as DemoSpec[]),
    binary: opsFor(mkDef(bars, 'search', target), BINARY as DemoSpec[]),
  };
}

export interface SortCounts { bubble: number; selection: number; insertion: number; }

/** Bubble vs selection vs insertion op-counts on one row. */
export function sortCompare(bars: number[]): SortCounts {
  return {
    bubble: opsFor(mkDef(bars, 'sort'), BUBBLE as DemoSpec[]),
    selection: opsFor(mkDef(bars, 'sort'), SELECTION as DemoSpec[]),
    insertion: opsFor(mkDef(bars, 'sort'), INSERTION as DemoSpec[]),
  };
}
