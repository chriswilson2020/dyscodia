/**
 * content/array-levels — the Array world curriculum (P1).
 *
 * Two new disciplines that reuse the shared interpreter:
 *   Lesson 7 "Sorting"  — bubble sort with the comparator lens.
 *   Lesson 8 "Search"   — linear search (scan until the lens rests on the target).
 *
 * Everything is expressed in blocks; no syntax, no numbers-as-code. Each level
 * carries an internal `solution` (same DSL) so the CI gate proves it sorts /
 * finds. These are kept OUT of the colour-belt list, so grid progression and the
 * black-belt gate are unchanged.
 */
import type { LevelDef, LessonMeta } from './types';

const SORT_PALETTE: LevelDef['palette'] = ['repeat', 'iftaller', 'swap', 'next', 'ifend', 'rewind'];
const SELECT_PALETTE: LevelDef['palette'] = ['repeat', 'ifshorter', 'mark', 'ifend', 'place', 'next'];
const INSERT_PALETTE: LevelDef['palette'] = ['repeat', 'iftallerleft', 'swapLeft', 'stepLeft', 'next'];
// Every sort block — the Challenge levels let you build ANY sort, and you must
// pick the one that fits the data to stay under the move budget.
const CHALLENGE_PALETTE: LevelDef['palette'] = [
  'repeat', 'swap', 'next', 'rewind', 'iftaller', 'ifend',
  'mark', 'place', 'ifshorter', 'swapLeft', 'stepLeft', 'iftallerleft',
];
const FIND_PALETTE: LevelDef['palette'] = ['repeat', 'ifmatch', 'next', 'pick'];
const SEARCH_PALETTE: LevelDef['palette'] = ['repeat', 'ifmatch', 'ifhigher', 'goLeft', 'goRight', 'pick'];

// Bubble: Repeat until sorted [ If taller → Swap · Next · If at end → Rewind ]
export const BUBBLE = [['repU', [['ift', ['sw'], []], 'nx', ['ife', ['rw'], []]]]] as LevelDef['solution'];
// Selection: Repeat until sorted [ If shorter → Mark · If at end → Place · else → Next ]
export const SELECTION = [['repU', [['ifsh', ['mk'], []], ['ife', ['pl'], ['nx']]]]] as LevelDef['solution'];
// Insertion (gnome): Repeat until sorted [ If taller-left → Swap left, Step left · else → Next ]
export const INSERTION = [['repU', [['iftl', ['swl', 'stl'], ['nx']]]]] as LevelDef['solution'];
// Linear search: Repeat until found [ If match → Pick · else → Next ]
export const LINEAR = [['repU', [['ifmt', ['pk'], ['nx']]]]] as LevelDef['solution'];
// Binary search (sorted row): Repeat until found [ If match → Pick · else If higher → Go right · else → Go left ]
export const BINARY = [['repU', [['ifmt', ['pk'], [['ifh', ['gr'], ['gl']]]]]]] as LevelDef['solution'];

/* ===== Lesson 7: Sorting — LEARN ===== */
export const L7_LEARN: LevelDef[] = [
  { name: 'Swap', icon: '1', title: 'The First Swap', world: 'array', goal: 'sort',
    text: 'Two bars, taller one on the left. The 🔍 lens compares the two bars under it — if the left is taller, Swap them. Try it, or tap 👀 Show me.',
    concept: 'New world: an ARRAY. Sorting means putting the bars in order, shortest to tallest — one compare-and-swap at a time.',
    bars: [2, 1], par: 6, palette: SORT_PALETTE, combo: false, demo: BUBBLE, solution: BUBBLE },
  { name: 'Bubble', icon: '2', title: 'Bubble Up', world: 'array', goal: 'sort',
    text: 'Three bars now. Build the rule that sorts any row: Repeat until sorted [ If taller → Swap · Next · If at end → Rewind ]. Watch the tallest bar “bubble” to the right.',
    concept: 'New idea: BUBBLE SORT. Sweep left to right swapping out-of-order pairs; the biggest floats to the end each pass. Repeat until sorted.',
    bars: [3, 1, 2], par: 6, palette: SORT_PALETTE, combo: false, demo: BUBBLE, solution: BUBBLE },
  { name: 'Mix', icon: '3', title: 'A Proper Mix', world: 'array', goal: 'sort',
    text: 'Five bars, well shuffled. The very same rule sorts them — it doesn’t care how jumbled they are.',
    concept: 'One rule, any arrangement: the loop keeps sweeping until every pair is in order.',
    bars: [5, 2, 8, 1, 4], par: 6, palette: SORT_PALETTE, combo: false, demo: BUBBLE, solution: BUBBLE },
  { name: 'Boss', icon: '4', title: 'The Big Shuffle', world: 'array', goal: 'sort',
    text: 'Eight bars in a real muddle. Your bubble rule clears it with no changes at all — that’s a real algorithm: it scales to any size.',
    concept: 'Boss: the same compare-swap-repeat rule sorts a long row. You never told it how many bars there are.',
    bars: [8, 3, 5, 1, 9, 2, 7, 4], par: 6, palette: SORT_PALETTE, combo: false, demo: BUBBLE, solution: BUBBLE },
];

/* ===== Lesson 7 — BELT TEST (Sorter) ===== */
export const L7_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Three Bars', world: 'array', goal: 'sort',
    text: 'Sort the row, shortest to tallest.', hint: 'Repeat until sorted [ If taller → Swap · Next · If at end → Rewind ].',
    bars: [2, 3, 1], par: 6, palette: SORT_PALETTE, combo: false, solution: BUBBLE },
  { name: 'T2', icon: '2', title: 'Test 2 — Four Bars', world: 'array', goal: 'sort',
    text: 'Sort them all.', hint: 'The same bubble rule works — let it run until sorted.',
    bars: [4, 1, 3, 2], par: 6, palette: SORT_PALETTE, combo: false, solution: BUBBLE },
  { name: 'T3', icon: '3', title: 'Test 3 — Six Bars', world: 'array', goal: 'sort',
    text: 'A bigger row. Clear it.', hint: 'It scales — the rule does not change with the size.',
    bars: [6, 2, 9, 1, 7, 3], par: 6, palette: SORT_PALETTE, combo: false, solution: BUBBLE },
];

/* ===== Lesson 8: Search — LEARN ===== */
export const L8_LEARN: LevelDef[] = [
  { name: 'Scan', icon: '1', title: 'Check Each One', world: 'array', goal: 'find', target: 1,
    text: 'Find the green bar (the 1). Build: Repeat until found [ If match → Pick · else → Next ]. Check each bar; only Pick when it matches. Watch the “checks” counter climb.',
    concept: 'New idea: LINEAR SEARCH. Check items one at a time, left to right. The decision matters — Pick the match, otherwise step on. Pick the wrong one and you fail.',
    bars: [3, 7, 2, 9, 5, 1], par: 4, palette: FIND_PALETTE, combo: false, demo: LINEAR, solution: LINEAR },
  { name: 'Scan 2', icon: '2', title: 'The Long Scan', world: 'array', goal: 'find', target: 5,
    text: 'A longer row, and your bar is right at the far end. Same rule — but count the checks it takes. That’s the cost of scanning one by one.',
    concept: 'Linear search does up to one check per bar. On a long row that’s a lot of checks — remember the number for the next lesson.',
    bars: [4, 1, 6, 2, 8, 3, 7, 5], par: 4, palette: FIND_PALETTE, combo: false, demo: LINEAR, solution: LINEAR },
  { name: 'Halve', icon: '3', title: 'Halve It', world: 'array', goal: 'search', target: 11,
    text: 'This row is SORTED. So jump to the middle and ask: is my target higher or lower? Throw away the half that can’t hold it, and repeat. Build: Repeat until found [ If match → Pick · else If higher → Go right · else → Go left ].',
    concept: 'New idea: BINARY SEARCH. On a sorted row you can halve the search every step — the greyed-out bars are gone for good. Watch how few checks it needs.',
    bars: [1, 3, 5, 7, 9, 11, 13], par: 6, palette: SEARCH_PALETTE, combo: false, demo: BINARY, solution: BINARY },
  { name: 'Boss', icon: '4', title: 'The Big Sorted Row', world: 'array', goal: 'search', target: 26,
    text: 'Fifteen sorted bars. Linear search would check up to thirteen of them. Your halving rule lands on the target in just a handful — read the “checks” counter and compare.',
    concept: 'Boss: binary search turns a long hunt into a few halvings (about log₂ of the size). Same idea, dramatic on big rows — that’s why sorted data is worth so much.',
    bars: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], par: 6, palette: SEARCH_PALETTE, combo: false, demo: BINARY, solution: BINARY },
];

/* ===== Lesson 8 — BELT TEST (Finder) ===== */
export const L8_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Scan for 7', world: 'array', goal: 'find', target: 7,
    text: 'Find and Pick the 7 by scanning.', hint: 'Repeat until found [ If match → Pick · else → Next ].',
    bars: [5, 2, 7, 1, 9], par: 4, palette: FIND_PALETTE, combo: false, solution: LINEAR },
  { name: 'T2', icon: '2', title: 'Test 2 — Halve for 8', world: 'array', goal: 'search', target: 8,
    text: 'The row is sorted — halve your way to the 8.', hint: 'If match → Pick · else If higher → Go right · else → Go left.',
    bars: [1, 2, 3, 4, 5, 6, 7, 8, 9], par: 6, palette: SEARCH_PALETTE, combo: false, solution: BINARY },
  { name: 'T3', icon: '3', title: 'Test 3 — Halve for 60', world: 'array', goal: 'search', target: 60,
    text: 'A sorted row in tens. Find the 60 in as few checks as you can.', hint: 'Jump to the middle, drop the wrong half, repeat.',
    bars: [10, 20, 30, 40, 50, 60, 70, 80], par: 6, palette: SEARCH_PALETTE, combo: false, solution: BINARY },
];

/* ===== Selection Sort — LEARN ===== */
export const L9_LEARN: LevelDef[] = [
  { name: 'Mark', icon: '1', title: 'Remember the Smallest', world: 'array', goal: 'sort',
    text: 'A different idea: scan the whole row remembering the SHORTEST bar so far (the 🔖 mark), then Place it at the front. Build: Repeat until sorted [ If shorter → Mark · If at end → Place · else → Next ].',
    concept: 'New idea: SELECTION SORT. Each pass finds the smallest remaining bar (remembered with a mark) and places it next in order. The green region is done.',
    bars: [3, 1, 2], par: 6, palette: SELECT_PALETTE, combo: false, demo: SELECTION, solution: SELECTION },
  { name: 'Select', icon: '2', title: 'Pick the Least', world: 'array', goal: 'sort',
    text: 'Five bars. Same rule: scan, remember the shortest, place it, repeat. Watch the green sorted region grow one bar at a time.',
    concept: 'Selection sort makes the fewest swaps — one Place per pass — even though it scans a lot.',
    bars: [5, 2, 8, 1, 4], par: 6, palette: SELECT_PALETTE, combo: false, demo: SELECTION, solution: SELECTION },
  { name: 'Boss', icon: '3', title: 'Select the Lot', world: 'array', goal: 'sort',
    text: 'Eight bars. The same remember-the-smallest rule clears them — one placement per pass.',
    concept: 'Boss: selection sort scales the same way — find the least of what’s left, place it, repeat.',
    bars: [8, 3, 5, 1, 9, 2, 7, 4], par: 6, palette: SELECT_PALETTE, combo: false, demo: SELECTION, solution: SELECTION },
];
export const L9_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Select Four', world: 'array', goal: 'sort',
    text: 'Sort by selection.', hint: 'Repeat until sorted [ If shorter → Mark · If at end → Place · else → Next ].',
    bars: [4, 1, 3, 2], par: 6, palette: SELECT_PALETTE, combo: false, solution: SELECTION },
  { name: 'T2', icon: '2', title: 'Test 2 — Select Six', world: 'array', goal: 'sort',
    text: 'A bigger row — same rule.', hint: 'Scan, remember the smallest, place it, repeat.',
    bars: [6, 2, 9, 1, 7, 3], par: 6, palette: SELECT_PALETTE, combo: false, solution: SELECTION },
];

/* ===== Insertion Sort — LEARN ===== */
export const L10_LEARN: LevelDef[] = [
  { name: 'Shift', icon: '1', title: 'Shuffle It Back', world: 'array', goal: 'sort',
    text: 'Another way: whenever a bar is taller than the one on its left, Swap them left and step back — like slotting a card into a row you’re holding. Build: Repeat until sorted [ If taller-left → Swap left, Step left · else → Next ].',
    concept: 'New idea: INSERTION SORT. Walk along; each bar slides left past taller ones until it sits in the right place.',
    bars: [3, 1, 2], par: 5, palette: INSERT_PALETTE, combo: false, demo: INSERTION, solution: INSERTION },
  { name: 'Insert', icon: '2', title: 'Slot Them In', world: 'array', goal: 'sort',
    text: 'Five bars. Same rule: step right, and whenever the left bar is taller, shuffle back until it fits.',
    concept: 'Insertion sort is brilliant when the row is nearly sorted — most bars barely move.',
    bars: [5, 2, 8, 1, 4], par: 5, palette: INSERT_PALETTE, combo: false, demo: INSERTION, solution: INSERTION },
  { name: 'Boss', icon: '3', title: 'Insert the Lot', world: 'array', goal: 'sort',
    text: 'Eight bars. Slide each into place — the same rule, any length.',
    concept: 'Boss: insertion sort builds the sorted row one slotted-in bar at a time.',
    bars: [8, 3, 5, 1, 9, 2, 7, 4], par: 5, palette: INSERT_PALETTE, combo: false, demo: INSERTION, solution: INSERTION },
];
export const L10_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Insert Four', world: 'array', goal: 'sort',
    text: 'Sort by insertion.', hint: 'Repeat until sorted [ If taller-left → Swap left, Step left · else → Next ].',
    bars: [4, 1, 3, 2], par: 5, palette: INSERT_PALETTE, combo: false, solution: INSERTION },
  { name: 'T2', icon: '2', title: 'Test 2 — Insert Six', world: 'array', goal: 'sort',
    text: 'A bigger row — same rule.', hint: 'Step right; whenever the left bar is taller, shuffle back.',
    bars: [6, 2, 9, 1, 7, 3], par: 5, palette: INSERT_PALETTE, combo: false, solution: INSERTION },
];

/* ===== The Race — LEARN (complexity intuition) ===== */
export const L11_LEARN: LevelDef[] = [
  { name: 'Best Tool', icon: '1', title: 'Linear vs Binary', world: 'array', goal: 'search', target: 16, race: 'searchGrowth',
    text: 'Build binary search to find the green bar on this sorted row. When you do, the dojo shows how many checks a plain left-to-right scan would have needed — and what happens on much bigger rows.',
    concept: 'New idea: COMPLEXITY. Two algorithms that both work are not equal — count their steps as the input grows. Binary search is O(log n); linear is O(n).',
    bars: [2, 4, 6, 8, 10, 12, 14, 16], par: 6, palette: SEARCH_PALETTE, combo: false, demo: BINARY, solution: BINARY },
  { name: 'Nearly Sorted', icon: '2', title: 'Nearly Sorted', world: 'array', goal: 'sort', race: 'sortCompare',
    text: 'This row is almost in order already. Sort it with insertion sort, then compare the move-counts: insertion and bubble finish almost at once — but selection still scans the whole row, pass after pass.',
    concept: 'New idea: ADAPTIVE algorithms. Insertion and bubble notice when little work is left; selection always does the same full scan, sorted or not. The best choice depends on your data.',
    bars: [1, 2, 4, 3, 5, 6], par: 5, palette: INSERT_PALETTE, combo: false, demo: INSERTION, solution: INSERTION },
  { name: 'Shuffled', icon: '3', title: 'A Real Shuffle', world: 'array', goal: 'sort', race: 'sortCompare',
    text: 'A properly shuffled row. Sort it with bubble, then compare all three sorts’ operation counts on this exact shuffle.',
    concept: 'On random data all three are O(n²), but the counts still differ — selection makes the fewest swaps, insertion and bubble do more shuffling.',
    bars: [8, 3, 5, 1, 9, 2, 7, 4], par: 6, palette: SORT_PALETTE, combo: false, demo: BUBBLE, solution: BUBBLE },
  { name: 'Sort Race', icon: '4', title: 'The Sort Race', world: 'array', goal: 'sort', race: 'parallelSort',
    text: 'No coding this time — just watch. The same shuffled row is handed to bubble, selection and insertion all at once. Press 🏁 Race and see which crosses the line first.',
    concept: 'Watch them run in parallel: each lane steps one operation at a time, so the lengths you see ARE the running times. The shortest lane wins.',
    bars: [7, 2, 9, 4, 1, 8, 3, 6], par: null, palette: [], combo: false },
  { name: 'Search Race', icon: '5', title: 'The Search Race', world: 'array', goal: 'search', target: 11, race: 'parallelSearch',
    text: 'The big one: linear search and binary search hunt the same target on the same sorted row, side by side. Press 🏁 Race — binary is done in a blink while linear is still trudging.',
    concept: 'Seeing O(log n) next to O(n): binary halves the row each step; linear plods one bar at a time. On bigger rows the gap is enormous.',
    bars: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], par: null, palette: [], combo: false },
];
export const L11_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Race to Find', world: 'array', goal: 'search', target: 9, race: 'searchGrowth',
    text: 'Find the 9 with binary search on this sorted row.', hint: 'If match → Pick · else If higher → Go right · else → Go left.',
    bars: [1, 2, 3, 4, 5, 6, 7, 8, 9], par: 6, palette: SEARCH_PALETTE, combo: false, solution: BINARY },
  { name: 'T2', icon: '2', title: 'Test 2 — Race to Sort', world: 'array', goal: 'sort', race: 'sortCompare',
    text: 'Sort this row, then read the comparison.', hint: 'Any sort works — try bubble.',
    bars: [5, 2, 8, 1, 4], par: 6, palette: SORT_PALETTE, combo: false, solution: BUBBLE },
];

/* ===== Challenge — LEARN (pick the right sort under a move budget) ===== */
export const L16_LEARN: LevelDef[] = [
  { name: 'Almost There', icon: '1', title: 'Best Case', world: 'array', goal: 'sort', maxOps: 10,
    text: 'This row is almost in order already. Sort it — but in 10 moves or fewer. No demo this time: the sort you reach for might do far too much work. Which sort barely has to move when the data is nearly sorted?',
    concept: 'CHALLENGE: pick the right tool. On nearly-sorted data, an adaptive sort (insertion or bubble) finishes in a handful of moves — but selection still scans the whole row, pass after pass, and blows the budget.',
    hint: 'Selection blows the budget here. Build insertion instead: If taller-left → Swap left, Step left · else → Next.',
    bars: [1, 2, 3, 5, 4, 6, 7, 8], par: null, palette: CHALLENGE_PALETTE, combo: false, solution: INSERTION },
  { name: 'Backwards', icon: '2', title: 'Worst Case', world: 'array', goal: 'sort', maxOps: 30,
    text: 'This row is completely reversed — the hardest case. Sort it in 30 moves or fewer. The adaptive sort that won the last level now does its MOST work. Which sort does the same steady amount of work no matter how jumbled the row is?',
    concept: 'CHALLENGE: the right tool flips. When the data is in the worst possible order, the adaptive sorts explode — but selection makes just one swap per pass, so its steady work now wins.',
    hint: 'Bubble and insertion explode on a reversed row. Build selection: If shorter → Mark · If at end → Place · else → Next.',
    bars: [8, 7, 6, 5, 4, 3, 2, 1], par: null, palette: CHALLENGE_PALETTE, combo: false, solution: SELECTION },
];
export const L16_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Nearly Done', world: 'array', goal: 'sort', maxOps: 8,
    text: 'Nearly sorted. Sort it in 8 moves or fewer.', hint: 'Adaptive sort, not selection.',
    bars: [1, 2, 4, 3, 5, 6, 7], par: null, palette: CHALLENGE_PALETTE, combo: false, solution: INSERTION },
  { name: 'T2', icon: '2', title: 'Test 2 — All Reversed', world: 'array', goal: 'sort', maxOps: 24,
    text: 'Fully reversed. Sort it in 24 moves or fewer.', hint: 'Selection’s steady work fits the budget.',
    bars: [7, 6, 5, 4, 3, 2, 1], par: null, palette: CHALLENGE_PALETTE, combo: false, solution: SELECTION },
];

export const ARRAY_LESSONS: LessonMeta[] = [
  { id: 'l7', tab: '🔢 Bubble Sort', belt: { name: 'Sorter Belt', badge: '🔢' }, learn: L7_LEARN, test: L7_TEST },
  { id: 'l9', tab: '🔖 Selection Sort', belt: { name: 'Selector Belt', badge: '🔖' }, learn: L9_LEARN, test: L9_TEST },
  { id: 'l10', tab: '📥 Insertion Sort', belt: { name: 'Inserter Belt', badge: '📥' }, learn: L10_LEARN, test: L10_TEST },
  { id: 'l8', tab: '🔎 Search', belt: { name: 'Finder Belt', badge: '🔎' }, learn: L8_LEARN, test: L8_TEST },
  { id: 'l11', tab: '🏁 The Race', belt: { name: 'Strategist Belt', badge: '🏁' }, learn: L11_LEARN, test: L11_TEST },
  { id: 'l16', tab: '🧠 Challenge', belt: { name: 'Tactician Belt', badge: '🧠' }, learn: L16_LEARN, test: L16_TEST },
];
