/**
 * interpreter/array — Array-world entry point. Walks a block program against an
 * Array world via the same shared runner the grid uses.
 */
import { type ArrayWorld } from '../engine/worlds/array';
import { arrayOps } from '../engine/worlds/array-ops';
import { runProgram } from './run';
import type { ArrayFrame } from '../engine/worlds/array';
import type { Block, Outcome } from '../program-model/types';

export function runArray(
  program: Block[], combo: Block[], w: ArrayWorld,
): { frames: ArrayFrame[]; outcome: Outcome } {
  return runProgram(program, combo, arrayOps(w));
}
