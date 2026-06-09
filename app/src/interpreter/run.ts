/**
 * interpreter/run — the world-agnostic program walker.
 *
 * It owns CONTROL FLOW only: sequencing, the loop (`repeat` / `repeat until`),
 * the conditional family (`if` variants), and the named `combo`. Everything
 * world-specific — what a leaf action does, how a condition is evaluated, what
 * a frame looks like, and what "won" means — is delegated to a `WorldOps`
 * object. This is what lets a second world (the Array/sorting world) reuse the
 * exact same interpreter that drives the grid.
 *
 * Blocks are classified structurally, not by hard-coded type names:
 *   - `combo`                         → run the named procedure
 *   - has `count`                     → a loop
 *   - has `elseBody`                  → a conditional (predicate via ops)
 *   - otherwise                       → a leaf action (delegated to ops)
 */
import type { Block, FrameBase, Outcome } from '../program-model/types';

const BUDGET = 3000;

export type Emit = (id: string | null, ev: string) => void;

export interface WorldOps<S, F extends FrameBase> {
  /** Fresh simulation state for one run. */
  init(): S;
  /** Snapshot current state into a frame. */
  snapshot(s: S, id: string | null, ev: string): F;
  /** Evaluate an `if`-family condition (by block type) against state. */
  predicate(s: S, type: string): boolean;
  /**
   * Execute a leaf action. Mutate `s`, push frame(s) via `emit`, and return an
   * Outcome to stop the run (win/fail) or null to continue.
   */
  action(s: S, type: string, id: string, emit: Emit): Outcome | null;
  /** True if the goal is satisfied when the program ends without an explicit stop. */
  wonAtEnd(s: S): boolean;
  /** Move count (or analogous effort metric) for the final win outcome. */
  effort(s: S): number;
}

export function runProgram<S, F extends FrameBase>(
  program: Block[], combo: Block[], ops: WorldOps<S, F>,
): { frames: F[]; outcome: Outcome } {
  const s = ops.init();
  const frames: F[] = [];
  const emit: Emit = (id, ev) => { frames.push(ops.snapshot(s, id, ev)); };
  emit(null, 'start');

  let outcome: Outcome = { win: false, reason: 'end' };
  let budget = 0;
  const STOP = {};
  const tick = (): void => { if (++budget > BUDGET) { outcome = { win: false, reason: 'toolong' }; throw STOP; } };
  const runList = (list: Block[]): void => { for (const b of list) runBlock(b); };

  function runBlock(b: Block): void {
    tick();
    if (b.type === 'combo') { runList(combo); return; }
    if (b.type === 'repeat') {
      if (b.until) { if (b.body.length) { let g = 0; while (g++ < BUDGET) runList(b.body); } }
      else { for (let i = 0; i < b.count; i++) runList(b.body); }
      return;
    }
    if ('elseBody' in b) {
      ops.predicate(s, b.type) ? runList(b.body) : runList(b.elseBody);
      return;
    }
    const stop = ops.action(s, b.type, b.id, emit);
    if (stop) { outcome = stop; throw STOP; }
  }

  try { runList(program); } catch (e) { if (e !== STOP) throw e; }
  if (!outcome.win && (outcome as { reason?: string }).reason === 'end' && ops.wonAtEnd(s)) {
    outcome = { win: true, moves: ops.effort(s) };
  }
  return { frames, outcome };
}
