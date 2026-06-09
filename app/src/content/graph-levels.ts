/**
 * content/graph-levels — the Graph world curriculum (Lesson Three, synthesis).
 *
 *   Breadth-First module — Take Front (oldest waiting room): explores ring by
 *     ring, nearest first. This is exactly the flood from Lesson One's "Best Way".
 *   Depth-First module — Take Top (newest room): follows one path as deep as it
 *     goes, then backtracks.
 *
 * The two share the same shape but differ in ONE block — Take Front vs Take Top —
 * and the win requires reproducing that traversal's exact visit order, so the
 * choice is real and visible. Each level carries an internal `solution` for CI.
 */
import type { LevelDef, LessonMeta } from './types';

// Both Take blocks are offered in every traversal level — the learner chooses
// which end to take from, and that choice is what makes it breadth- or depth-first.
const TRAVERSE_PALETTE: LevelDef['palette'] = ['repeat', 'iffrontier', 'takeFront', 'takeTop', 'expand'];

// Breadth-first: take the OLDEST waiting node (front). Depth-first: take the NEWEST (top).
const BFS_SOL = [['repU', [['iffr', ['tf', 'exp'], []]]]] as LevelDef['solution'];
const DFS_SOL = [['repU', [['iffr', ['tt', 'exp'], []]]]] as LevelDef['solution'];

// Shared graphs (node positions in small ints; edges as index pairs).
const GA: Pick<LevelDef, 'nodes' | 'edges'> = {
  nodes: [[2, 0], [1, 1], [3, 1], [0, 2], [2, 2], [4, 2]],
  edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]],
};
const GB: Pick<LevelDef, 'nodes' | 'edges'> = {
  nodes: [[0, 1], [1, 0], [1, 2], [2, 1], [3, 0], [3, 2], [4, 1]],
  edges: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6]],
};
const GC: Pick<LevelDef, 'nodes' | 'edges'> = {
  nodes: [[0, 1], [1, 0], [1, 2], [2, 1], [2, 3], [3, 0], [3, 2], [4, 1]],
  edges: [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [3, 6], [5, 7], [6, 7], [4, 6]],
};

/* ===== Breadth-First — LEARN (queue frontier) ===== */
export const L14_LEARN: LevelDef[] = [
  { name: 'Flood', icon: '1', title: 'Ring by Ring', world: 'graph', struct: 'queue', startNode: 0, ...GA,
    text: 'Light up every room. The waiting rooms sit in a line (the frontier). Use Take Front to take the OLDEST waiting room, then Expand to add its new neighbours to the back. Build: Repeat [ If frontier → Take Front · Expand ]. Taking the oldest first makes it spread ring by ring. (Try Take Top instead and watch it fail — that order is depth-first!)',
    concept: 'New world: a GRAPH. New idea: BREADTH-FIRST SEARCH. Taking the OLDEST waiting room first (Take Front) visits the nearest rooms first — the very flood from Lesson One.',
    par: 4, palette: TRAVERSE_PALETTE, combo: false, demo: BFS_SOL, solution: BFS_SOL },
  { name: 'Spread', icon: '2', title: 'The Diamond', world: 'graph', struct: 'queue', startNode: 0, ...GB,
    text: 'A graph with two ways round. The queue still visits nearest-first — both sides fill before the far room.',
    concept: 'Breadth-first reaches everything by the shortest number of hops — that is why it finds shortest paths.',
    par: 4, palette: TRAVERSE_PALETTE, combo: false, demo: BFS_SOL, solution: BFS_SOL },
  { name: 'Boss', icon: '3', title: 'The Whole Map', world: 'graph', struct: 'queue', startNode: 0, ...GC,
    text: 'A bigger map. The same queue rule lights every room, nearest first.',
    concept: 'Boss: breadth-first scales to any graph — one queue, ring by ring.',
    par: 4, palette: TRAVERSE_PALETTE, combo: false, demo: BFS_SOL, solution: BFS_SOL },
];
export const L14_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Flood It', world: 'graph', struct: 'queue', startNode: 0, ...GA,
    text: 'Light up every room, breadth-first.', hint: 'Repeat [ If frontier → Take Front · Expand ]. Take Front = oldest waiting.',
    par: 4, palette: TRAVERSE_PALETTE, combo: false, solution: BFS_SOL },
  { name: 'T2', icon: '2', title: 'Test 2 — The Diamond', world: 'graph', struct: 'queue', startNode: 0, ...GB,
    text: 'Visit the whole graph, nearest first.', hint: 'Take Front, then Expand its neighbours to the back.',
    par: 4, palette: TRAVERSE_PALETTE, combo: false, solution: BFS_SOL },
];

/* ===== Depth-First — LEARN (stack frontier) ===== */
export const L15_LEARN: LevelDef[] = [
  { name: 'Dive', icon: '1', title: 'Down One Path', world: 'graph', struct: 'stack', startNode: 0, ...GA,
    text: 'Same rooms, same Expand — but swap one block. Use Take Top to take the NEWEST room added (the top of the pile), so you keep diving down one path before coming back. Build: Repeat [ If frontier → Take Top · Expand ]. (Take Front would give breadth-first instead.)',
    concept: 'New idea: DEPTH-FIRST SEARCH. Taking the NEWEST room first (Take Top) follows one path as deep as it goes, then backtracks — the same rule, just Take Top instead of Take Front.',
    par: 4, palette: TRAVERSE_PALETTE, combo: false, demo: DFS_SOL, solution: DFS_SOL },
  { name: 'Deeper', icon: '2', title: 'The Diamond, Deep', world: 'graph', struct: 'stack', startNode: 0, ...GB,
    text: 'The same diamond as breadth-first — but the stack plunges down one side first. Compare the visit order with the queue version.',
    concept: 'Depth-first and breadth-first visit the same rooms in a very different order. Swap Take Top for Take Front and the algorithm flips.',
    par: 4, palette: TRAVERSE_PALETTE, combo: false, demo: DFS_SOL, solution: DFS_SOL },
  { name: 'Boss', icon: '3', title: 'Dive the Map', world: 'graph', struct: 'stack', startNode: 0, ...GC,
    text: 'The big map, depth-first. One stack, diving deep, until every room is lit.',
    concept: 'Boss: depth-first scales too — a stack is all it takes.',
    par: 4, palette: TRAVERSE_PALETTE, combo: false, demo: DFS_SOL, solution: DFS_SOL },
];
export const L15_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Dive In', world: 'graph', struct: 'stack', startNode: 0, ...GA,
    text: 'Light up every room, depth-first.', hint: 'Repeat [ If frontier → Take Top · Expand ]. Take Top = newest added.',
    par: 4, palette: TRAVERSE_PALETTE, combo: false, solution: DFS_SOL },
  { name: 'T2', icon: '2', title: 'Test 2 — Deep Diamond', world: 'graph', struct: 'stack', startNode: 0, ...GB,
    text: 'Traverse the whole graph, diving deep first.', hint: 'Take Top each time, then Expand.',
    par: 4, palette: TRAVERSE_PALETTE, combo: false, solution: DFS_SOL },
];

export const GRAPH_LESSONS: LessonMeta[] = [
  { id: 'l14', tab: '🌊 Breadth-First', belt: { name: 'Flooder Belt', badge: '🌊' }, audio: 'breadth-first', learn: L14_LEARN, test: L14_TEST },
  { id: 'l15', tab: '🤿 Depth-First', belt: { name: 'Diver Belt', badge: '🤿' }, audio: 'depth-first', learn: L15_LEARN, test: L15_TEST },
];
