/**
 * interpreter — grid entry point. Kept as a thin, stable wrapper so existing
 * callers (the UI and the solvability gate) don't change: it walks a block
 * program against a grid World via the shared, world-agnostic runner.
 */
import type { World } from '../engine/core';
import { gridOps } from '../engine/worlds/grid-ops';
import { runProgram } from './run';
import type { Block, RunResult } from '../program-model/types';

export function run(program: Block[], combo: Block[], w: World): RunResult {
  return runProgram(program, combo, gridOps(w));
}
