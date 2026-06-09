/**
 * The BFS/DFS distinction must be REAL: breadth-first and depth-first produce
 * different visit orders on a branching graph, and using the wrong Take block
 * (Take Top when breadth-first is wanted, or vice versa) must FAIL. This is what
 * makes the structure choice meaningful to the learner.
 */
import { describe, it, expect } from 'vitest';
import { GRAPH_LESSONS } from '../src/content/graph-levels';
import { parseGraph, canonicalOrder } from '../src/engine/worlds/graph';
import { runGraph } from '../src/interpreter/graph';
import { buildProgram, type DemoSpec } from '../src/interpreter/dsl';

const TAKE_FRONT = [['repU', [['iffr', ['tf', 'exp'], []]]]] as unknown as DemoSpec[];
const TAKE_TOP = [['repU', [['iffr', ['tt', 'exp'], []]]]] as unknown as DemoSpec[];

const bfsDiamond = GRAPH_LESSONS[0].learn![1]; // queue, branching graph
const dfsDiamond = GRAPH_LESSONS[1].learn![1]; // stack, same graph

describe('breadth-first and depth-first are genuinely different', () => {
  it('the two traversals produce different visit orders', () => {
    const w = parseGraph(bfsDiamond);
    const front = canonicalOrder(w.adj, w.start, 'front');
    const top = canonicalOrder(w.adj, w.start, 'top');
    expect(front).not.toEqual(top);
  });

  it('Take Front solves the breadth-first level; Take Top does not', () => {
    const w = parseGraph(bfsDiamond);
    expect(runGraph(buildProgram(TAKE_FRONT), [], w).outcome.win).toBe(true);
    expect(runGraph(buildProgram(TAKE_TOP), [], w).outcome.win).toBe(false);
  });

  it('Take Top solves the depth-first level; Take Front does not', () => {
    const w = parseGraph(dfsDiamond);
    expect(runGraph(buildProgram(TAKE_TOP), [], w).outcome.win).toBe(true);
    expect(runGraph(buildProgram(TAKE_FRONT), [], w).outcome.win).toBe(false);
  });
});
