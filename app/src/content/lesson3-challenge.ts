/**
 * content/lesson3-challenge — the Lesson Three Challenge module.
 *
 * No demos. The learner is given a target and BOTH options, and must reason
 * about the goal to pick the right tool:
 *   - Structure choice: hit a target output — reverse it (Pop, stack) or keep
 *     the order (Dequeue, queue)? Both removal blocks are offered.
 *   - Mystery traversal: reproduce a target visit order on a graph — was it
 *     breadth-first (Take Front) or depth-first (Take Top)? You must read the
 *     order and deduce, because nothing tells you which.
 */
import type { LevelDef, LessonMeta } from './types';

// Reference solutions (same shorthand the other modules use).
const STACK = [['repU', [['ifmo', ['pu'], ['po']]]]] as LevelDef['solution'];   // push, then pop → reversed
const QUEUE = [['repU', [['ifmo', ['eq'], ['dq']]]]] as LevelDef['solution'];   // enqueue, then dequeue → same order
const BFS = [['repU', [['iffr', ['tf', 'exp'], []]]]] as LevelDef['solution'];  // Take Front → breadth-first
const DFS = [['repU', [['iffr', ['tt', 'exp'], []]]]] as LevelDef['solution'];  // Take Top → depth-first

const STRUCT_CHOICE: LevelDef['palette'] = ['repeat', 'ifmore', 'push', 'pop', 'enqueue', 'dequeue'];
const GRAPH_CHOICE: LevelDef['palette'] = ['repeat', 'iffrontier', 'takeFront', 'takeTop', 'expand'];

// A branching graph where breadth-first and depth-first give different orders.
const G: Pick<LevelDef, 'nodes' | 'edges'> = {
  nodes: [[0, 1], [1, 0], [1, 2], [2, 1], [3, 0], [3, 2], [4, 1]],
  edges: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6]],
};

export const L17_LEARN: LevelDef[] = [
  { name: 'Reverse?', icon: '1', title: 'Make It Reverse', world: 'structures', struct: 'queue',
    text: 'No demo. You have BOTH a stack and a queue. The output must come out REVERSED. Which removal do you use — Pop (takes the last one in) or Dequeue (takes the first)?',
    concept: 'CHALLENGE: choose the structure. Reversing means last-in-first-out — that is a stack. Fill it (Push), then Pop it all off.',
    hint: 'Reversed = last in, first out. Pop takes the back; Dequeue takes the front.',
    seq: [3, 1, 4, 2], want: [2, 4, 1, 3], par: null, palette: STRUCT_CHOICE, combo: false, solution: STACK },
  { name: 'Keep?', icon: '2', title: 'Keep It in Order', world: 'structures', struct: 'queue',
    text: 'Same two tools. This time the output must keep the SAME order. Pop or Dequeue?',
    concept: 'CHALLENGE: the opposite choice. Keeping the order means first-in-first-out — that is a queue. Dequeue takes from the front.',
    hint: 'Same order = first in, first out. That is the queue: Dequeue.',
    seq: [5, 2, 8, 1], want: [5, 2, 8, 1], par: null, palette: STRUCT_CHOICE, combo: false, solution: QUEUE },
  { name: 'Mystery A', icon: '3', title: 'Which Search? (A)', world: 'graph', struct: 'queue', startNode: 0, ...G,
    text: 'No demo, and no label. Reproduce this visit order. Look at HOW it spreads — does it fan out to the nearest rooms first, or dive down one path? Then pick Take Front or Take Top.',
    concept: 'CHALLENGE: read the order, name the algorithm. Spreading nearest-first is breadth-first (a queue — Take Front).',
    hint: 'It reaches the close rooms before the far ones — that is breadth-first.',
    par: null, palette: GRAPH_CHOICE, combo: false, solution: BFS },
  { name: 'Mystery B', icon: '4', title: 'Which Search? (B)', world: 'graph', struct: 'stack', startNode: 0, ...G,
    text: 'Same graph, a different target order. Does this one fan out, or plunge down one branch before backtracking? Pick the Take block that produces it.',
    concept: 'CHALLENGE: this order dives deep first — that is depth-first (a stack — Take Top).',
    hint: 'It goes deep down one path before coming back — that is depth-first.',
    par: null, palette: GRAPH_CHOICE, combo: false, solution: DFS },
];

export const L17_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Reverse It', world: 'structures', struct: 'queue',
    text: 'Make the output reversed. Pick the right structure.', hint: 'Reversed → stack → Pop.',
    seq: [2, 4, 6, 8], want: [8, 6, 4, 2], par: null, palette: STRUCT_CHOICE, combo: false, solution: STACK },
  { name: 'T2', icon: '2', title: 'Test 2 — Which Search?', world: 'graph', struct: 'queue', startNode: 0, ...G,
    text: 'Reproduce this visit order. Read it, then choose.', hint: 'Nearest-first → breadth-first → Take Front.',
    par: null, palette: GRAPH_CHOICE, combo: false, solution: BFS },
];

export const CHALLENGE3_LESSONS: LessonMeta[] = [
  { id: 'l17', tab: '🧩 Challenge', belt: { name: 'Puzzler Belt', badge: '🧩' }, learn: L17_LEARN, test: L17_TEST },
];
