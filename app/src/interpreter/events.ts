/**
 * interpreter/events — the event-driven "interpreter" for interactive levels
 * (Lesson 4 + the Black-belt pilot level). There is no precomputed timeline
 * here: handlers fire live in response to key presses. The same primitives back
 * both the live UI and the CI replay used to prove these levels solvable.
 */
import type { World } from '../engine/core';
import type { Dir, EventKey, Handlers } from '../program-model/types';

/** Absolute (screen-relative) movement vectors and the facing they imply. */
export const ABS: Record<'up' | 'down' | 'left' | 'right', [number, number]> = {
  up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0],
};
const ABSDIR: Record<'up' | 'down' | 'left' | 'right', Dir> = {
  up: 0, right: 1, down: 2, left: 3,
};

export interface LiveState {
  x: number;
  y: number;
  dir: Dir;
  energy: number;
  gems: Set<string>;
  won: boolean;
}

export function initLive(w: World): LiveState {
  return { x: w.sx, y: w.sy, dir: w.sdir, energy: w.startEnergy, gems: new Set(), won: false };
}

function liveMove(w: World, live: LiveState, d: [number, number], dir: Dir): void {
  live.dir = dir;
  const nx = live.x + d[0], ny = live.y + d[1];
  if (!w.walk(nx, ny)) return;
  if (w.hasEnergy && live.energy <= 0) return;
  if (w.hasEnergy) live.energy--;
  live.x = nx; live.y = ny;
  const k = live.x + ',' + live.y;
  if (w.gems.has(k)) live.gems.add(k);
  if (live.x === w.gx && live.y === w.gy && live.gems.size === w.gems.size) live.won = true;
}

function liveCharge(w: World, live: LiveState): void {
  if (w.hasEnergy && w.chargers.has(live.x + ',' + live.y)) live.energy += w.chargeVal;
}

/** Run every action wired to `key`, mutating live state. Stops early once won. */
export function applyEvent(w: World, handlers: Handlers, live: LiveState, key: EventKey): void {
  for (const b of handlers[key] || []) {
    if (live.won) break;
    switch (b.type) {
      case 'goU': liveMove(w, live, ABS.up, ABSDIR.up); break;
      case 'goD': liveMove(w, live, ABS.down, ABSDIR.down); break;
      case 'goL': liveMove(w, live, ABS.left, ABSDIR.left); break;
      case 'goR': liveMove(w, live, ABS.right, ABSDIR.right); break;
      case 'charge': liveCharge(w, live); break;
    }
  }
}

/** Replay a key sequence through wired handlers; report whether the fox wins. */
export function replayEvents(w: World, handlers: Handlers, seq: EventKey[]): boolean {
  const live = initLive(w);
  for (const key of seq) {
    if (live.won) break;
    applyEvent(w, handlers, live, key);
  }
  return live.won;
}
