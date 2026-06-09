/**
 * The Lesson Three challenges must force a real decision: the intended tool wins
 * and the WRONG one fails. (The solvability gate already proves each intended
 * solution wins; here we prove the alternative does not — no free passes.)
 */
import { describe, it, expect } from 'vitest';
import { L17_LEARN } from '../src/content/lesson3-challenge';
import { parseStruct } from '../src/engine/worlds/structures';
import { parseGraph } from '../src/engine/worlds/graph';
import { runStructures } from '../src/interpreter/structures';
import { runGraph } from '../src/interpreter/graph';
import { buildProgram, type DemoSpec } from '../src/interpreter/dsl';

const STACK = [['repU', [['ifmo', ['pu'], ['po']]]]] as unknown as DemoSpec[];
const QUEUE = [['repU', [['ifmo', ['eq'], ['dq']]]]] as unknown as DemoSpec[];
const BFS = [['repU', [['iffr', ['tf', 'exp'], []]]]] as unknown as DemoSpec[];
const DFS = [['repU', [['iffr', ['tt', 'exp'], []]]]] as unknown as DemoSpec[];

const winStruct = (def: any, spec: DemoSpec[]) =>
  runStructures(buildProgram(spec), [], parseStruct(def)).outcome.win;
const winGraph = (def: any, spec: DemoSpec[]) =>
  runGraph(buildProgram(spec), [], parseGraph(def)).outcome.win;

describe('Lesson Three challenges punish the wrong choice', () => {
  it('Reverse: stack wins, queue fails', () => {
    const lvl = L17_LEARN[0];
    expect(winStruct(lvl, STACK)).toBe(true);
    expect(winStruct(lvl, QUEUE)).toBe(false);
  });
  it('Keep order: queue wins, stack fails', () => {
    const lvl = L17_LEARN[1];
    expect(winStruct(lvl, QUEUE)).toBe(true);
    expect(winStruct(lvl, STACK)).toBe(false);
  });
  it('Mystery A: breadth-first wins, depth-first fails', () => {
    const lvl = L17_LEARN[2];
    expect(winGraph(lvl, BFS)).toBe(true);
    expect(winGraph(lvl, DFS)).toBe(false);
  });
  it('Mystery B: depth-first wins, breadth-first fails', () => {
    const lvl = L17_LEARN[3];
    expect(winGraph(lvl, DFS)).toBe(true);
    expect(winGraph(lvl, BFS)).toBe(false);
  });
});
