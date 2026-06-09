/**
 * The solvability gate.
 *
 * Runs the REAL interpreter over every authored level and fails the build if:
 *   - any level is unsolvable (its reference solution does not reach the gate),
 *   - any "Show me" demo does not actually solve its level,
 *   - any shortest-path level's gate is unreachable or its derived target
 *     disagrees with an independent breadth-first search.
 *
 * This replaces the manual Node verification the prototype relied on: content
 * can no longer ship broken.
 */
import { describe, it, expect } from 'vitest';
import { allLevels, type LevelRef } from '../src/content';
import type { LevelDef } from '../src/content/types';
import { parseLevel } from '../src/engine/worlds/grid';
import { parseArray, isSorted } from '../src/engine/worlds/array';
import { parseStruct, seqEq } from '../src/engine/worlds/structures';
import { parseGraph } from '../src/engine/worlds/graph';
import { bfsDist, DELTA, DIRMAP, type World } from '../src/engine/core';
import { run } from '../src/interpreter/interpreter';
import { runArray } from '../src/interpreter/array';
import { runStructures } from '../src/interpreter/structures';
import { runGraph } from '../src/interpreter/graph';
import { buildProgram, buildHandlers, type DemoSpec } from '../src/interpreter/dsl';
import { replayEvents } from '../src/interpreter/events';
import type { EventKey } from '../src/program-model/types';

const levels = allLevels();
const label = (r: LevelRef) => `${r.lesson.id}/${r.section}#${r.index + 1} — ${r.def.title}`;

/** Independent BFS (not the engine's) so the engine's bfs can't mark its own homework. */
function independentOptimal(def: LevelDef): number {
  const rows = (def.grid || []).map((s) => s.split(''));
  const H = rows.length;
  const W = Math.max(...rows.map((r) => r.length));
  rows.forEach((r) => { while (r.length < W) r.push('#'); });
  const blocked = (x: number, y: number) =>
    x < 0 || y < 0 || x >= W || y >= H || rows[y][x] === '#';
  let sx = 0, sy = 0, gx = 0, gy = 0;
  rows.forEach((r, y) => r.forEach((c, x) => {
    if (c === 'S') { sx = x; sy = y; }
    if (c === 'G') { gx = x; gy = y; }
  }));
  const dist = Array.from({ length: H }, () => Array<number>(W).fill(-1));
  dist[sy][sx] = 0;
  const q: Array<[number, number]> = [[sx, sy]];
  while (q.length) {
    const [x, y] = q.shift()!;
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as const) {
      const nx = x + dx, ny = y + dy;
      if (!blocked(nx, ny) && dist[ny][nx] < 0) { dist[ny][nx] = dist[y][x] + 1; q.push([nx, ny]); }
    }
  }
  return dist[gy][gx];
}

function solveProgram(world: World, solution: DemoSpec[], combo?: DemoSpec[]): boolean {
  const program = buildProgram(solution);
  const comboBody = combo ? buildProgram(combo) : [];
  return run(program, comboBody, world).outcome.win;
}

function solveArray(def: LevelDef, solution: DemoSpec[]): { win: boolean; sorted: boolean; moves: number } {
  const world = parseArray(def);
  const result = runArray(buildProgram(solution), [], world);
  // Re-derive the final array independently to double-check a 'sort' win.
  const last = result.frames[result.frames.length - 1];
  const sorted = def.goal === 'sort' ? isSorted(last.arr) : true;
  const moves = result.outcome.win ? result.outcome.moves : -1;
  return { win: result.outcome.win, sorted, moves };
}

describe('every level is solvable', () => {
  it.each(levels.map((r) => [label(r), r] as const))('%s', (_label, r) => {
    const def = r.def;

    if (def.world === 'structures') {
      const solution = def.solution ?? def.demo;
      expect(solution, 'structures level needs a reference solution or demo').toBeTruthy();
      const world = parseStruct(def);
      const result = runStructures(buildProgram(solution!), [], world);
      const last = result.frames[result.frames.length - 1];
      expect(result.outcome.win, 'reference solution must produce the target output').toBe(true);
      expect(seqEq(last.output, world.want), 'output tray must match the target').toBe(true);
      return;
    }

    if (def.world === 'graph') {
      const solution = def.solution ?? def.demo;
      expect(solution, 'graph level needs a reference solution or demo').toBeTruthy();
      const world = parseGraph(def);
      const result = runGraph(buildProgram(solution!), [], world);
      const last = result.frames[result.frames.length - 1];
      expect(result.outcome.win, 'traversal must visit every node').toBe(true);
      expect(last.order.length, 'every node visited exactly once').toBe(world.n);
      return;
    }

    if (def.world === 'array') {
      // Live parallel-race levels are watch-only (no learner solution); the
      // parallel-race test verifies their lanes all finish.
      if (def.race === 'parallelSort' || def.race === 'parallelSearch') return;
      const solution = def.solution ?? def.demo;
      expect(solution, 'array level needs a reference solution or demo').toBeTruthy();
      const { win, sorted, moves } = solveArray(def, solution!);
      expect(win, 'reference solution must complete the array goal').toBe(true);
      expect(sorted, 'a sort level must end fully sorted').toBe(true);
      if (def.maxOps != null) {
        expect(moves, 'reference solution must come in under the move budget').toBeLessThanOrEqual(def.maxOps);
      }
      return;
    }

    const world = parseLevel(def);

    if (def.shortest) {
      // Solvable == gate reachable; target must match an independent BFS.
      const engineOpt = bfsDist(world)[world.gy][world.gx];
      const indyOpt = independentOptimal(def);
      expect(engineOpt, 'gate must be reachable').toBeGreaterThanOrEqual(0);
      expect(engineOpt, 'shortest target must match independent BFS').toBe(indyOpt);
      return;
    }

    if (def.interactive) {
      const hSpec = def.solutionHandlers ?? def.demoHandlers;
      const seq = (def.solutionSeq ?? def.demoSeq) as EventKey[] | undefined;
      expect(hSpec, 'interactive level needs a reference handler set').toBeTruthy();
      expect(seq, 'interactive level needs a reference key sequence').toBeTruthy();
      const handlers = buildHandlers(hSpec!);
      expect(replayEvents(world, handlers, seq!), 'reference controls must reach the gate').toBe(true);
      return;
    }

    const solution = def.solution ?? def.demo;
    const combo = def.solutionCombo ?? def.demoCombo;
    expect(solution, 'level needs a reference solution or demo').toBeTruthy();
    expect(solveProgram(world, solution!, combo), 'reference solution must reach the gate').toBe(true);
  });
});

describe('every "Show me" demo actually solves its level', () => {
  const withDemos = levels.filter(
    (r) => r.def.demo || r.def.demoHandlers || r.def.demoChain,
  );

  it.each(withDemos.map((r) => [label(r), r] as const))('%s', (_label, r) => {
    const def = r.def;

    if (def.world === 'structures') {
      const world = parseStruct(def);
      expect(runStructures(buildProgram(def.demo!), [], world).outcome.win).toBe(true);
      return;
    }

    if (def.world === 'graph') {
      const world = parseGraph(def);
      expect(runGraph(buildProgram(def.demo!), [], world).outcome.win).toBe(true);
      return;
    }

    if (def.world === 'array') {
      expect(solveArray(def, def.demo!).win).toBe(true);
      return;
    }

    const world = parseLevel(def);

    if (def.interactive && def.demoHandlers) {
      const handlers = buildHandlers(def.demoHandlers);
      expect(replayEvents(world, handlers, (def.demoSeq || []) as EventKey[])).toBe(true);
      return;
    }
    if (def.demoChain) {
      // Each chained demo step must itself solve.
      for (const step of def.demoChain) {
        expect(solveProgram(world, step.spec, step.combo)).toBe(true);
      }
      return;
    }
    expect(solveProgram(world, def.demo!, def.demoCombo)).toBe(true);
  });
});

describe('sanity: facing tokens and grids are well-formed', () => {
  it('every grid level has a valid start, gate and direction', () => {
    for (const r of levels) {
      const def = r.def;
      if (def.world === 'array') {
        expect((def.bars || []).length, `${label(r)} has bars`).toBeGreaterThan(1);
        continue;
      }
      if (def.world === 'structures') {
        expect((def.seq || []).length, `${label(r)} has input tokens`).toBeGreaterThan(0);
        expect((def.want || []).length, `${label(r)} has a target`).toBeGreaterThan(0);
        continue;
      }
      if (def.world === 'graph') {
        expect((def.nodes || []).length, `${label(r)} has nodes`).toBeGreaterThan(1);
        expect((def.edges || []).length, `${label(r)} has edges`).toBeGreaterThan(0);
        continue;
      }
      expect(DIRMAP[def.dir || 'E'], `${label(r)} has a valid dir`).toBeTypeOf('number');
      const joined = (def.grid || []).join('');
      expect(joined.includes('S'), `${label(r)} has a start`).toBe(true);
      expect(joined.includes('G'), `${label(r)} has a gate`).toBe(true);
      // DELTA is the shared movement table the engine and tests both rely on.
      expect(DELTA.length).toBe(4);
    }
  });
});
