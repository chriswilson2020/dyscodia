/**
 * content/struct-levels — the Structures world curriculum (Lesson Three).
 *
 *   Stack module — LIFO: feed a row in, get it back reversed.
 *   Queue module — FIFO: feed a row in, get it back in the same order.
 *
 * The two share the SAME program shape — Repeat [ If more → take · else → release ]
 * — so the only difference is the structure, which is exactly the lesson.
 * Each level carries an internal `solution` for the CI gate.
 */
import type { LevelDef, LessonMeta } from './types';

const STACK_PALETTE: LevelDef['palette'] = ['repeat', 'ifmore', 'push', 'pop'];
const QUEUE_PALETTE: LevelDef['palette'] = ['repeat', 'ifmore', 'enqueue', 'dequeue'];

// Push everything in, then pop it all out → reversed.
const STACK_SOL = [['repU', [['ifmo', ['pu'], ['po']]]]] as LevelDef['solution'];
// Enqueue everything in, then dequeue it all out → same order.
const QUEUE_SOL = [['repU', [['ifmo', ['eq'], ['dq']]]]] as LevelDef['solution'];

/* ===== Stack — LEARN ===== */
export const L12_LEARN: LevelDef[] = [
  { name: 'Reverse', icon: '1', title: 'Last In, First Out', world: 'structures', struct: 'stack',
    text: 'A stack is like a pile of plates: the last one you put on is the first you take off. Push every token on, then pop them all off — they come out reversed. Build: Repeat [ If more → Push · else → Pop ].',
    concept: 'New world: STRUCTURES. New idea: a STACK (LIFO). Pushing then popping reverses a row — the plate you added last comes off first.',
    seq: [1, 2, 3], want: [3, 2, 1], par: 4, palette: STACK_PALETTE, combo: false, demo: STACK_SOL, solution: STACK_SOL },
  { name: 'Reverse 2', icon: '2', title: 'Flip the Row', world: 'structures', struct: 'stack',
    text: 'A longer row. Same rule — push them all on, then pop them all off.',
    concept: 'The stack remembers order and hands it back backwards. That reversal is what a stack is for.',
    seq: [3, 1, 4, 2], want: [2, 4, 1, 3], par: 4, palette: STACK_PALETTE, combo: false, demo: STACK_SOL, solution: STACK_SOL },
  { name: 'Boss', icon: '3', title: 'Reverse the Lot', world: 'structures', struct: 'stack',
    text: 'Five tokens. Push them all, pop them all — out they come, reversed.',
    concept: 'Boss: the same LIFO rule reverses a row of any length.',
    seq: [5, 2, 8, 1, 4], want: [4, 1, 8, 2, 5], par: 4, palette: STACK_PALETTE, combo: false, demo: STACK_SOL, solution: STACK_SOL },
];
export const L12_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Reverse Three', world: 'structures', struct: 'stack',
    text: 'Make the output the reverse of the input.', hint: 'Repeat [ If more → Push · else → Pop ].',
    seq: [2, 4, 6], want: [6, 4, 2], par: 4, palette: STACK_PALETTE, combo: false, solution: STACK_SOL },
  { name: 'T2', icon: '2', title: 'Test 2 — Reverse Four', world: 'structures', struct: 'stack',
    text: 'Reverse the row.', hint: 'Push all of them on first, then pop them all off.',
    seq: [7, 3, 9, 1], want: [1, 9, 3, 7], par: 4, palette: STACK_PALETTE, combo: false, solution: STACK_SOL },
];

/* ===== Queue — LEARN ===== */
export const L13_LEARN: LevelDef[] = [
  { name: 'Keep Order', icon: '1', title: 'First In, First Out', world: 'structures', struct: 'queue',
    text: 'A queue is like a conveyor belt: the first token on is the first off. Enqueue every token, then dequeue them all — they come out in the SAME order. Build: Repeat [ If more → Enqueue · else → Dequeue ].',
    concept: 'New idea: a QUEUE (FIFO). Same program shape as the stack, but a queue keeps the order instead of reversing it.',
    seq: [1, 2, 3], want: [1, 2, 3], par: 4, palette: QUEUE_PALETTE, combo: false, demo: QUEUE_SOL, solution: QUEUE_SOL },
  { name: 'Keep Order 2', icon: '2', title: 'Hold the Line', world: 'structures', struct: 'queue',
    text: 'A longer row. The belt preserves the order — first in, first out.',
    concept: 'Where a stack reverses, a queue preserves. That order-keeping is what a queue is for.',
    seq: [3, 1, 4, 2], want: [3, 1, 4, 2], par: 4, palette: QUEUE_PALETTE, combo: false, demo: QUEUE_SOL, solution: QUEUE_SOL },
  { name: 'Boss', icon: '3', title: 'Pass Them Through', world: 'structures', struct: 'queue',
    text: 'Five tokens through the belt, order intact.',
    concept: 'Boss: FIFO keeps any row in order — the first to arrive is the first to leave.',
    seq: [5, 2, 8, 1, 4], want: [5, 2, 8, 1, 4], par: 4, palette: QUEUE_PALETTE, combo: false, demo: QUEUE_SOL, solution: QUEUE_SOL },
];
export const L13_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Keep Three', world: 'structures', struct: 'queue',
    text: 'Output the row in the same order.', hint: 'Repeat [ If more → Enqueue · else → Dequeue ].',
    seq: [2, 4, 6], want: [2, 4, 6], par: 4, palette: QUEUE_PALETTE, combo: false, solution: QUEUE_SOL },
  { name: 'T2', icon: '2', title: 'Test 2 — Keep Four', world: 'structures', struct: 'queue',
    text: 'Preserve the order through the queue.', hint: 'Enqueue them all, then dequeue them all.',
    seq: [7, 3, 9, 1], want: [7, 3, 9, 1], par: 4, palette: QUEUE_PALETTE, combo: false, solution: QUEUE_SOL },
];

export const STRUCT_LESSONS: LessonMeta[] = [
  { id: 'l12', tab: '🥞 Stack', belt: { name: 'Stacker Belt', badge: '🥞' }, learn: L12_LEARN, test: L12_TEST },
  { id: 'l13', tab: '🚚 Queue', belt: { name: 'Queuer Belt', badge: '🚚' }, learn: L13_LEARN, test: L13_TEST },
];
