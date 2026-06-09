/**
 * interpreter/structures — Structures-world entry point. Walks a block program
 * against a Structures world via the same shared runner the other worlds use.
 */
import { type StructWorld, type StructFrame } from '../engine/worlds/structures';
import { structOps } from '../engine/worlds/structures-ops';
import { runProgram } from './run';
import type { Block, Outcome } from '../program-model/types';

export function runStructures(
  program: Block[], combo: Block[], w: StructWorld,
): { frames: StructFrame[]; outcome: Outcome } {
  return runProgram(program, combo, structOps(w));
}
