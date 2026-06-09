/**
 * engine/core — world simulation primitives, world-agnostic.
 *
 * The interpreter owns control flow (walking the program, building the frame
 * timeline). This module owns the *world rules*: what a step, a turn, a charge
 * actually do to world state, plus reachability (BFS). Keeping these split is
 * what lets a second world (e.g. the Array/sorting world in P1) reuse the
 * interpreter unchanged.
 */
import type { Dir } from '../program-model/types';
import type { LevelDef } from '../content/types';

/** Movement vectors indexed by Dir: N, E, S, W. */
export const DELTA: ReadonlyArray<readonly [number, number]> = [
  [0, -1], [1, 0], [0, 1], [-1, 0],
];
export const DIRMAP: Record<string, Dir> = { N: 0, E: 1, S: 2, W: 3 };

/** A parsed, ready-to-simulate world. Produced by a world module (e.g. grid). */
export interface World {
  def: LevelDef;
  W: number;
  H: number;
  sx: number;
  sy: number;
  gx: number;
  gy: number;
  sdir: Dir;
  walls: boolean[][];
  gems: Set<string>;
  batteries: Map<string, number>;
  chargers: Set<string>;
  chargeVal: number;
  lowAt: number;
  usesMode: boolean;
  hasEnergy: boolean;
  startEnergy: number;
  /** BFS distance grid (shortest-path levels only); filled lazily. */
  dist?: number[][];
  /** Shortest distance from start to gate (shortest-path levels only). */
  optimal?: number;
  walk(x: number, y: number): boolean;
}

/** Mutable simulation state for a single run. */
export interface SimState {
  x: number;
  y: number;
  dir: Dir;
  gems: Set<string>;
  energy: number;
  batt: Set<string>;
  mode: 0 | 1;
  moves: number;
}

export function initState(w: World): SimState {
  return {
    x: w.sx, y: w.sy, dir: w.sdir,
    gems: new Set(),
    energy: w.startEnergy,
    batt: new Set(w.batteries.keys()),
    mode: 0,
    moves: 0,
  };
}

/** Is the tile directly ahead walkable? */
export function frontClear(w: World, s: SimState): boolean {
  const [dx, dy] = DELTA[s.dir];
  return w.walk(s.x + dx, s.y + dy);
}

/** Win = standing on the gate with every gem collected. */
export function won(w: World, s: SimState): boolean {
  return s.x === w.gx && s.y === w.gy && s.gems.size === w.gems.size;
}

export type StepResult =
  | { event: 'move'; won: boolean }
  | { event: 'bonk' }
  | { event: 'noenergy' };

/**
 * Attempt one step forward. Mutates `s` on success. Returns the world event so
 * the interpreter can decide whether the run continues, ends, or wins —
 * matching the prototype's move() semantics exactly.
 */
export function tryStep(w: World, s: SimState): StepResult {
  if (w.hasEnergy && s.energy <= 0) return { event: 'noenergy' };
  const [dx, dy] = DELTA[s.dir];
  const nx = s.x + dx, ny = s.y + dy;
  if (!w.walk(nx, ny)) return { event: 'bonk' };
  if (w.hasEnergy) s.energy--;
  s.x = nx; s.y = ny; s.moves++;
  const k = s.x + ',' + s.y;
  if (w.gems.has(k)) s.gems.add(k);
  if (w.batteries.has(k) && s.batt.has(k)) {
    s.energy += w.batteries.get(k)!;
    s.batt.delete(k);
  }
  return { event: 'move', won: won(w, s) };
}

export function turn(s: SimState, d: -1 | 1): void {
  s.dir = (((s.dir + d + 4) % 4) as Dir);
}

export function charge(w: World, s: SimState): void {
  if (w.chargers.has(s.x + ',' + s.y)) s.energy += w.chargeVal;
}

export function setMode(s: SimState, m: 0 | 1): void {
  s.mode = m;
}

/** Breadth-first shortest distance from start to every reachable tile. */
export function bfsDist(w: World): number[][] {
  const dist = Array.from({ length: w.H }, () => Array<number>(w.W).fill(-1));
  dist[w.sy][w.sx] = 0;
  const q: Array<[number, number]> = [[w.sx, w.sy]];
  while (q.length) {
    const [x, y] = q.shift()!;
    for (const [dx, dy] of DELTA) {
      const nx = x + dx, ny = y + dy;
      if (w.walk(nx, ny) && dist[ny][nx] < 0) {
        dist[ny][nx] = dist[y][x] + 1;
        q.push([nx, ny]);
      }
    }
  }
  return dist;
}
