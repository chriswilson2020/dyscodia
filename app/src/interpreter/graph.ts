/**
 * interpreter/graph — Graph-world entry point. Walks a block program against a
 * Graph world via the same shared runner the other worlds use.
 */
import { type GraphWorld, type GraphFrame } from '../engine/worlds/graph';
import { graphOps } from '../engine/worlds/graph-ops';
import { runProgram } from './run';
import type { Block, Outcome } from '../program-model/types';

export function runGraph(
  program: Block[], combo: Block[], w: GraphWorld,
): { frames: GraphFrame[]; outcome: Outcome } {
  return runProgram(program, combo, graphOps(w));
}
