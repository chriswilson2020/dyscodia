/**
 * content/levels — the entire curriculum as data.
 *
 * Verbatim from the prototype, now typed. The only additions are internal
 * `solution*` fields on the belt-test / black-belt / sandbox levels (which ship
 * without a learner-facing demo) so the CI gate can prove them solvable. These
 * are engineering data, never shown to the learner — no text code is surfaced.
 */
import type { LevelDef, LessonMeta } from './types';

/* ===== Lesson 1: Moves — LEARN ===== */
export const L1_LEARN: LevelDef[] = [
  { name: 'Steps', icon: '1', title: 'First Steps',
    text: 'Your fox starts on the left, facing right. Add three Step blocks to walk to the red gate.',
    concept: 'New idea: a SEQUENCE — steps run one after another, top to bottom.',
    grid: ['S..G'], dir: 'E', par: 3, demo: ['m', 'm', 'm'], palette: ['move', 'left', 'right'], combo: false },
  { name: 'Loops', icon: '2', title: 'The Long Hall',
    text: 'The hall is long. You could add seven Steps... or be clever. Put one Step inside a Repeat and set it to 7.',
    concept: 'New idea: a LOOP — Repeat does the same thing again and again.',
    grid: ['S......G'], dir: 'E', par: 2, demo: [['rep', 7, ['m']]], palette: ['move', 'left', 'right', 'repeat'], combo: false },
  { name: 'If/Else', icon: '3', title: 'Around the Ring',
    text: 'The path runs around the edge. When the way ahead is clear, Step. When it is blocked, Turn Right. Put If Path inside a big Repeat.',
    concept: 'New idea: IF / ELSE — choose what to do based on what is in front of you.',
    grid: ['S....', '.###.', '.###.', '.###.', '....G'], dir: 'E', par: 4, demo: [['rep', 10, [['if', ['m'], ['r']]]]], palette: ['move', 'left', 'right', 'repeat', 'if'], combo: false },
  { name: 'Combos', icon: '4', title: 'The Staircase',
    text: 'See the pattern? Step, Turn Right, Step, Turn Left — over and over. Build that pattern once in your Combo, then Repeat the Combo 4 times.',
    concept: 'New idea: a FUNCTION — name a set of moves once (a Combo), then reuse it.',
    grid: ['S.###', '#..##', '##..#', '###..', '####G'], dir: 'E', par: 6, demo: [['rep', 4, ['combo']]], demoCombo: ['m', 'r', 'm', 'l'], palette: ['move', 'left', 'right', 'repeat', 'combo'], combo: true },
  { name: 'Boss', icon: '5', title: 'Gem Dojo',
    text: 'Grab both gems 💎, then reach the gate ⛩️. Use everything you know — loops, turns, combos. Fewer blocks = more stars.',
    concept: 'Boss level: use it all. Plan your route, then code it.',
    grid: ['S...*', '.###.', '.....', '.###.', 'G...*'], dir: 'E', par: 16, demo: ['m', 'm', 'm', 'm', 'r', 'm', 'm', 'm', 'm', 'r', 'm', 'm', 'm', 'm'], palette: ['move', 'left', 'right', 'repeat', 'if', 'combo'], combo: true },
  { name: 'Sandbox', icon: '🛠', title: 'Your Dojo',
    text: 'No rules here. Tap tiles to build walls, then write any program you like to reach the gate and grab the gems. Make your own puzzle.',
    concept: 'Free build: invent your own level and solve it.',
    grid: ['S......', '.......', '..#.#..', '.......', '..#.#..', '.......', '*.....G'], dir: 'E', par: null, sandbox: true,
    palette: ['move', 'left', 'right', 'repeat', 'if', 'combo'], combo: true,
    solution: ['r', ['rep', 6, ['m']], 'l', ['rep', 6, ['m']]] },
];

/* ===== Lesson 1 — BELT TEST (Yellow) ===== */
export const L1_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — The Corner', text: 'Get your fox to the gate. That is all.',
    hint: 'Walk to the end of the top row, then Turn Right and Step down.',
    grid: ['S..', '..G'], dir: 'E', par: 4, palette: ['move', 'left', 'right'], combo: false,
    solution: ['m', 'm', 'r', 'm'] },
  { name: 'T2', icon: '2', title: 'Test 2 — Long Run', text: 'Reach the far gate. Can you do it in just two blocks?',
    hint: 'One Step inside a Repeat, set to 7.',
    grid: ['S......G'], dir: 'E', par: 2, palette: ['move', 'left', 'right', 'repeat'], combo: false,
    solution: [['rep', 7, ['m']]] },
  { name: 'T3', icon: '3', title: 'Test 3 — The Hook', text: 'Grab the gem 💎, then reach the gate ⛩️.',
    hint: 'Down the right side to the gem, turn, then back along the bottom row.',
    grid: ['S....', '####.', 'G...*'], dir: 'E', par: 8, palette: ['move', 'left', 'right', 'repeat'], combo: false,
    solution: [['rep', 4, ['m']], 'r', ['rep', 2, ['m']], 'r', ['rep', 4, ['m']]] },
  { name: 'T4', icon: '4', title: 'Test 4 — The Ring', text: 'Find your way around to the gate.',
    hint: 'When the path is clear, Step. When blocked, Turn Right. Put an If Path inside a big Repeat.',
    grid: ['S....', '.###.', '.###.', '.###.', '....G'], dir: 'E', par: 4, palette: ['move', 'left', 'right', 'repeat', 'if'], combo: false,
    solution: [['rep', 10, [['if', ['m'], ['r']]]]] },
  { name: 'T5', icon: '5', title: 'Test 5 — The Stairs', text: 'Climb down to the gate.',
    hint: 'Spot the repeating pattern. Build it once as a Combo, then Repeat the Combo.',
    grid: ['S.###', '#..##', '##..#', '###..', '####G'], dir: 'E', par: 6, palette: ['move', 'left', 'right', 'repeat', 'combo'], combo: true,
    solution: [['rep', 4, ['combo']]], solutionCombo: ['m', 'r', 'm', 'l'] },
  { name: 'T6', icon: '6', title: 'Test 6 — The Boss', text: 'Collect both gems 💎💎, then reach the gate ⛩️. Fewest blocks wins.',
    hint: 'Loop down the right edge grabbing both gems, then loop along the bottom to the gate.',
    grid: ['S...*', '.###.', '.....', '.###.', 'G...*'], dir: 'E', par: 8, palette: ['move', 'left', 'right', 'repeat', 'if', 'combo'], combo: true,
    solution: [['rep', 4, ['m']], 'r', ['rep', 4, ['m']], 'r', ['rep', 4, ['m']]] },
];

/* ===== Lesson 2: Energy — LEARN ===== */
export const L2_LEARN: LevelDef[] = [
  { name: 'Power', icon: '1', title: 'Power On',
    text: 'New thing up top: your ENERGY. Every Step costs 1. You have exactly 5 — reach the gate before it runs out.',
    concept: 'New idea: a VARIABLE — a number the dojo remembers and changes as your code runs. Here it is your energy.',
    grid: ['S....G'], dir: 'E', par: 2, energy: 5, battery: 0, demo: [['rep', 5, ['m']]], palette: ['move', 'left', 'right', 'repeat'], combo: false },
  { name: 'Top Up', icon: '2', title: 'Top Up',
    text: 'Four energy is not enough for this hall. Grab the battery 🔋 on the way — it adds to your number.',
    concept: 'A variable can go UP too. A battery adds energy to the number you are tracking.',
    grid: ['S..B...G'], dir: 'E', par: 2, energy: 4, battery: 4, demo: [['rep', 7, ['m']]], palette: ['move', 'left', 'right', 'repeat'], combo: false },
  { name: 'Detour', icon: '3', title: 'The Detour',
    text: 'Go down the right side to grab the battery 🔋, collect the gem 💎, then back along the bottom to the gate ⛩️.',
    concept: 'Track the number in your head as you plan: Steps cost, batteries pay.',
    grid: ['S......B', '#######.', 'G......*'], dir: 'E', par: 8, energy: 8, battery: 12, demo: [['rep', 7, ['m']], 'r', ['rep', 2, ['m']], 'r', ['rep', 7, ['m']]], palette: ['move', 'left', 'right', 'repeat'], combo: false },
  { name: 'Boss', icon: '4', title: 'Power Crisis',
    text: 'The short way straight to the gate runs out of power — and skips the gem 💎. Go the long way: turn down, grab the battery 🔋, sweep up the gem, then reach the gate ⛩️. Power is razor-thin — don’t waste a single step.',
    concept: 'Boss: the obvious path is a trap, and energy stays tight the whole way. Find the route that wastes nothing — you arrive at the gate with your battery on empty.',
    grid: ['S...G', '.###.', 'B###.', '.###.', '..*..'], dir: 'E', par: 9, energy: 3, battery: 9, demo: ['r', ['rep', 4, ['m']], 'l', ['rep', 4, ['m']], 'l', ['rep', 4, ['m']]], palette: ['move', 'left', 'right', 'repeat'], combo: false },
];

/* ===== Lesson 2 — BELT TEST (Orange) ===== */
export const L2_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Just Enough', text: 'Reach the gate. You have exactly enough power — don’t overspend.',
    hint: 'One Step in a Repeat, set to 5.', grid: ['S....G'], dir: 'E', par: 2, energy: 5, battery: 0, palette: ['move', 'left', 'right', 'repeat'], combo: false,
    solution: [['rep', 5, ['m']]] },
  { name: 'T2', icon: '2', title: 'Test 2 — Top Up', text: 'Reach the far gate. Four power won’t do it on its own.',
    hint: 'Grab the battery 🔋 on the way past.', grid: ['S..B...G'], dir: 'E', par: 2, energy: 4, battery: 4, palette: ['move', 'left', 'right', 'repeat'], combo: false,
    solution: [['rep', 7, ['m']]] },
  { name: 'T3', icon: '3', title: 'Test 3 — The Long Way', text: 'Grab the gem 💎 and reach the gate ⛩️ without running dry.',
    hint: 'Down the right side to the battery, grab the gem, back along the bottom.', grid: ['S......B', '#######.', 'G......*'], dir: 'E', par: 8, energy: 8, battery: 12, palette: ['move', 'left', 'right', 'repeat'], combo: false,
    solution: [['rep', 7, ['m']], 'r', ['rep', 2, ['m']], 'r', ['rep', 7, ['m']]] },
  { name: 'T4', icon: '4', title: 'Test 4 — The Trap', text: 'Reach the gate. Careful — the straight line is a trap.',
    hint: 'Going straight runs out of power. Pop down to the battery first, then carry on.', grid: ['S...G', '##B##'], dir: 'E', par: 10, energy: 3, battery: 4, palette: ['move', 'left', 'right', 'repeat'], combo: false,
    solution: ['m', 'm', 'r', 'm', 'l', 'l', 'm', 'r', 'm', 'm'] },
];

/* ===== Lesson 3: Decisions — LEARN ===== */
export const L3_LEARN: LevelDef[] = [
  { name: 'Meter', icon: '1', title: 'Read the Meter',
    text: 'Two new blocks. 🪫 If Low checks your energy number. ⚡ Charge tops you up on a charging pad 🔌. Build: Repeat [ If Low → Charge, else → Step ].',
    concept: 'New idea: decide on a VARIABLE. If Low looks at your energy and chooses — charge when low, step when not.',
    grid: ['S.C..G'], dir: 'E', par: 4, energy: 3, charge: 3, lowAt: 1, demo: [['repU', [['iflow', ['ch'], ['m']]]]], palette: ['move', 'left', 'right', 'repeat', 'iflow', 'charge'], combo: false },
  { name: 'Run', icon: '2', title: 'The Charging Run',
    text: 'Two pads now. Let the fox drive itself: Repeat [ If Low → Charge, else → Step ]. It only stops to charge when the meter is low.',
    concept: 'The same little program handles every pad — the fox decides each time, based on its energy.',
    grid: ['S..C..C..G'], dir: 'E', par: 4, energy: 4, charge: 3, lowAt: 1, demo: [['repU', [['iflow', ['ch'], ['m']]]]], palette: ['move', 'left', 'right', 'repeat', 'iflow', 'charge'], combo: false },
  { name: 'Long Drive', icon: '3', title: 'The Long Drive',
    text: 'A longer road, more pads. Your self-driving loop should handle it with no changes — that is the power of deciding on the variable.',
    concept: 'One decision, repeated, scales to any length of road.',
    grid: ['S..C..C..C..G'], dir: 'E', par: 4, energy: 4, charge: 3, lowAt: 1, demo: [['repU', [['iflow', ['ch'], ['m']]]]], palette: ['move', 'left', 'right', 'repeat', 'iflow', 'charge'], combo: false },
  { name: 'Boss', icon: '4', title: 'The Marathon',
    text: 'Long road, a gem 💎 to grab on the way, charging pads 🔌 to keep you going. Same self-driving loop: charge when low, step when not. Reach the gate ⛩️.',
    concept: 'Boss: trust the decision. The loop refuels exactly when needed and never wastes a step.',
    grid: ['S..C.*C..C..G'], dir: 'E', par: 4, energy: 4, charge: 3, lowAt: 1, demo: [['repU', [['iflow', ['ch'], ['m']]]]], palette: ['move', 'left', 'right', 'repeat', 'iflow', 'charge'], combo: false },
];

/* ===== Lesson 3 — BELT TEST (Green) ===== */
export const L3_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Top Up', text: 'Reach the gate. Use the charging pad 🔌 when you run low.',
    hint: 'Repeat [ If Low → Charge, else → Step ].', grid: ['S.C..G'], dir: 'E', par: 4, energy: 3, charge: 3, lowAt: 1, palette: ['move', 'left', 'right', 'repeat', 'iflow', 'charge'], combo: false,
    solution: [['repU', [['iflow', ['ch'], ['m']]]]] },
  { name: 'T2', icon: '2', title: 'Test 2 — Two Pads', text: 'Reach the far gate, charging when the meter drops.',
    hint: 'The self-driving loop: Repeat [ If Low → Charge, else → Step ].', grid: ['S..C..C..G'], dir: 'E', par: 4, energy: 4, charge: 3, lowAt: 1, palette: ['move', 'left', 'right', 'repeat', 'iflow', 'charge'], combo: false,
    solution: [['repU', [['iflow', ['ch'], ['m']]]]] },
  { name: 'T3', icon: '3', title: 'Test 3 — Long Haul', text: 'A long road with four pads. One loop should do the lot.',
    hint: 'Same loop as before — it scales to any length.', grid: ['S..C..C..C..C..G'], dir: 'E', par: 4, energy: 4, charge: 3, lowAt: 1, palette: ['move', 'left', 'right', 'repeat', 'iflow', 'charge'], combo: false,
    solution: [['repU', [['iflow', ['ch'], ['m']]]]] },
  { name: 'T4', icon: '4', title: 'Test 4 — The Marathon', text: 'Grab the gem 💎 and reach the gate ⛩️ without stalling.',
    hint: 'Drive and refuel: Repeat [ If Low → Charge, else → Step ]. The gem is on the road.', grid: ['S..C.*C..C..G'], dir: 'E', par: 4, energy: 4, charge: 3, lowAt: 1, palette: ['move', 'left', 'right', 'repeat', 'iflow', 'charge'], combo: false,
    solution: [['repU', [['iflow', ['ch'], ['m']]]]] },
];

/* ===== Lesson 4: Controls — LEARN (interactive) ===== */
export const L4_LEARN: LevelDef[] = [
  { name: 'One Key', icon: '1', title: 'Take the Controls', interactive: true,
    text: 'A new kind of level — you drive! First, teach the keys: drop Go ▶ into the ➡️ slot. Then press ▶ Play and use the right arrow (or tap ▶) to reach the gate.',
    concept: 'New idea: EVENTS. A handler says “WHEN this key is pressed, DO this.” Your code now reacts to the player.',
    grid: ['S....G'], dir: 'E', par: null, demoHandlers: { right: ['goR'] }, demoSeq: ['right', 'right', 'right', 'right', 'right'], palette: ['goU', 'goD', 'goL', 'goR'], combo: false },
  { name: 'Four Keys', icon: '2', title: 'All Four Ways', interactive: true,
    text: 'Wire all four arrows to their directions (➡️ → Go ▶, ⬇️ → Go ▼, and so on). Then Play and steer the fox around to the gate.',
    concept: 'Each key gets its own handler. Together they make a full set of controls — your own game pad.',
    grid: ['S....', '.###.', '.....', '.###.', '....G'], dir: 'E', par: null, demoHandlers: { up: ['goU'], down: ['goD'], left: ['goL'], right: ['goR'] }, demoSeq: ['down', 'down', 'down', 'down', 'right', 'right', 'right', 'right'], palette: ['goU', 'goD', 'goL', 'goR'], combo: false },
  { name: 'Power', icon: '3', title: 'The Power Button', interactive: true,
    text: 'Long road, limited energy 🔋. Wire the arrows, and wire ⚡ → Charge. Drive to the pad 🔌, press ⚡ to top up, then carry on to the gate.',
    concept: 'Events are not only for moving. Wire a key to Charge and you have a power button.',
    grid: ['S..C...G'], dir: 'E', par: null, energy: 4, charge: 4, demoHandlers: { right: ['goR'], charge: ['ch'] }, demoSeq: ['right', 'right', 'right', 'charge', 'right', 'right', 'right', 'right'], palette: ['goU', 'goD', 'goL', 'goR', 'charge'], combo: false },
  { name: 'Boss', icon: '4', title: 'Free Roam', interactive: true,
    text: 'A proper little game: two gems 💎, a charging pad 🔌, and energy to manage. Wire your controls, then drive around, grab both gems, and reach the gate ⛩️.',
    concept: 'Boss: you built the controls AND you play. The fox does exactly what your handlers say.',
    grid: ['S...*', '.....', '..C..', '.....', '*...G'], dir: 'E', par: null, energy: 16, charge: 8, demoHandlers: { up: ['goU'], down: ['goD'], left: ['goL'], right: ['goR'], charge: ['ch'] }, demoSeq: ['right', 'right', 'right', 'right', 'down', 'down', 'down', 'down', 'left', 'left', 'left', 'left', 'right', 'right', 'right', 'right'], palette: ['goU', 'goD', 'goL', 'goR', 'charge'], combo: false },
];

/* ===== Lesson 4 — BELT TEST (Blue) ===== */
export const L4_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Drive', interactive: true, text: 'Wire the controls and drive to the gate.',
    hint: 'Put Go ▶ in the ➡️ slot, then Play and press right.', grid: ['S.....G'], dir: 'E', par: null, palette: ['goU', 'goD', 'goL', 'goR'], combo: false,
    solutionHandlers: { right: ['goR'] }, solutionSeq: ['right', 'right', 'right', 'right', 'right', 'right'] },
  { name: 'T2', icon: '2', title: 'Test 2 — Steer', interactive: true, text: 'Wire all four arrows and find your way to the gate.',
    hint: 'Each arrow slot gets its matching Go block.', grid: ['S....', '.###.', '.....', '.###.', '....G'], dir: 'E', par: null, palette: ['goU', 'goD', 'goL', 'goR'], combo: false,
    solutionHandlers: { up: ['goU'], down: ['goD'], left: ['goL'], right: ['goR'] }, solutionSeq: ['down', 'down', 'down', 'down', 'right', 'right', 'right', 'right'] },
  { name: 'T3', icon: '3', title: 'Test 3 — Refuel', interactive: true, text: 'Drive to the gate. Use ⚡ on the pad 🔌 before you run dry.',
    hint: 'Wire ⚡ → Charge. Top up on the pad.', grid: ['S..C...G'], dir: 'E', par: null, energy: 4, charge: 4, palette: ['goU', 'goD', 'goL', 'goR', 'charge'], combo: false,
    solutionHandlers: { right: ['goR'], charge: ['ch'] }, solutionSeq: ['right', 'right', 'right', 'charge', 'right', 'right', 'right', 'right'] },
  { name: 'T4', icon: '4', title: 'Test 4 — Free Roam', interactive: true, text: 'Grab both gems 💎 and reach the gate ⛩️, managing your energy.',
    hint: 'Wire all the controls including ⚡, then drive carefully.', grid: ['S...*', '.....', '..C..', '.....', '*...G'], dir: 'E', par: null, energy: 16, charge: 8, palette: ['goU', 'goD', 'goL', 'goR', 'charge'], combo: false,
    solutionHandlers: { up: ['goU'], down: ['goD'], left: ['goL'], right: ['goR'], charge: ['ch'] }, solutionSeq: ['right', 'right', 'right', 'right', 'down', 'down', 'down', 'down', 'left', 'left', 'left', 'left', 'right', 'right', 'right', 'right'] },
];

/* ===== Lesson 5: Memory — LEARN ===== */
const SCH_MEMORY = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 300"><rect x="2" y="2" width="556" height="296" rx="14" fill="#faf2df" stroke="#d9cdb4" stroke-width="2"/><text x="280" y="34" text-anchor="middle" font-family="Lexend,sans-serif" font-weight="800" font-size="20" fill="#2c2a3a">Every corner looks the same to the fox 🦊</text><text x="280" y="60" text-anchor="middle" font-family="Atkinson Hyperlegible,sans-serif" font-size="15" fill="#5b566b">So it carries a switch and flips it every step — the switch picks the turn.</text><rect x="37" y="82" width="116" height="150" rx="12" fill="#fff" stroke="#d9cdb4" stroke-width="2"/><circle cx="95" cy="130" r="20" fill="#2f7fb0"/><circle cx="95" cy="130" r="20" fill="none" stroke="#00000022" stroke-width="2"/><path d="M 109 108 q 26 0 26 26" fill="none" stroke="#2c2a3a" stroke-width="4"/><polygon points="135,132 135,148 145,138" fill="#2c2a3a"/><text x="95" y="198" text-anchor="middle" font-family="Lexend,sans-serif" font-weight="700" font-size="14" fill="#2c2a3a">🔵 turn Right</text><text x="95" y="220" text-anchor="middle" font-family="Atkinson Hyperlegible,sans-serif" font-size="13" fill="#5b566b">then flip the switch</text><line x1="157" y1="130" x2="165" y2="130" stroke="#2c2a3a" stroke-width="3"/><polygon points="165,124 165,136 175,130" fill="#2c2a3a"/><text x="165" y="118" text-anchor="middle" font-family="Atkinson Hyperlegible,sans-serif" font-size="12" fill="#5b566b">flip</text><rect x="177" y="82" width="116" height="150" rx="12" fill="#fff" stroke="#d9cdb4" stroke-width="2"/><circle cx="235" cy="130" r="20" fill="#e08a1e"/><circle cx="235" cy="130" r="20" fill="none" stroke="#00000022" stroke-width="2"/><path d="M 221 108 q -26 0 -26 26" fill="none" stroke="#2c2a3a" stroke-width="4"/><polygon points="195,132 195,148 185,138" fill="#2c2a3a"/><text x="235" y="198" text-anchor="middle" font-family="Lexend,sans-serif" font-weight="700" font-size="14" fill="#2c2a3a">🟠 turn Left</text><text x="235" y="220" text-anchor="middle" font-family="Atkinson Hyperlegible,sans-serif" font-size="13" fill="#5b566b">then flip the switch</text><line x1="297" y1="130" x2="305" y2="130" stroke="#2c2a3a" stroke-width="3"/><polygon points="305,124 305,136 315,130" fill="#2c2a3a"/><text x="305" y="118" text-anchor="middle" font-family="Atkinson Hyperlegible,sans-serif" font-size="12" fill="#5b566b">flip</text><rect x="317" y="82" width="116" height="150" rx="12" fill="#fff" stroke="#d9cdb4" stroke-width="2"/><circle cx="375" cy="130" r="20" fill="#2f7fb0"/><circle cx="375" cy="130" r="20" fill="none" stroke="#00000022" stroke-width="2"/><path d="M 389 108 q 26 0 26 26" fill="none" stroke="#2c2a3a" stroke-width="4"/><polygon points="415,132 415,148 425,138" fill="#2c2a3a"/><text x="375" y="198" text-anchor="middle" font-family="Lexend,sans-serif" font-weight="700" font-size="14" fill="#2c2a3a">🔵 turn Right</text><text x="375" y="220" text-anchor="middle" font-family="Atkinson Hyperlegible,sans-serif" font-size="13" fill="#5b566b">then flip the switch</text><rect x="468" y="82" width="80" height="150" rx="12" fill="#eef6ef" stroke="#d9cdb4" stroke-width="2"/><text x="508" y="142" text-anchor="middle" font-size="44">⛩️</text><text x="508" y="198" text-anchor="middle" font-family="Lexend,sans-serif" font-weight="700" font-size="13" fill="#2c2a3a">…to the gate</text><text x="280" y="286" text-anchor="middle" font-family="Atkinson Hyperlegible,sans-serif" font-size="14" fill="#5b566b">Set 🟠 / Set 🔵 flips the switch · If 🔵 reads it</text></svg>';

export const L5_LEARN: LevelDef[] = [
  { name: 'Switch', icon: '1', title: 'The Staircase Switch',
    text: 'See the picture below: the fox can’t tell one corner from the next, so it flips a switch each step and lets the switch pick the turn. Build it: Repeat [ Step · If 🔵 → Right & Set 🟠 · else → Left & Set 🔵 ]. Try it yourself, or tap 👀 Show me.',
    concept: 'New idea: MEMORY. The fox can’t see which way it turned last — so it flips a switch (🔵 ↔ 🟠) each step and checks it. That switch is its memory: it’s how the fox knows whether to turn right or left this time.',
    grid: ['S.##', '#..#', '##..', '###G'], dir: 'E', par: 7, diagram: SCH_MEMORY, demo: [['rep', 8, ['m', ['ifm', ['r', 'so'], ['l', 'sb']]]]], palette: ['move', 'left', 'right', 'repeat', 'ifmode', 'setBlue', 'setOrange'], combo: false },
  { name: 'Switchback', icon: '2', title: 'The Switchback',
    text: 'Now the straights are long. Walk until you hit a wall, THEN flip your switch to pick the turn — right, then left, then right. Build: Repeat until ⛩️ [ If Path → Step · else → If 🔵 → Right & Set 🟠 · else → Left & Set 🔵 ].',
    concept: 'A new job for memory: If Path walks the straights, and the switch only decides which way to turn when you finally meet a wall.',
    grid: ['S..##', '##.##', '##...', '####.', '####G'], dir: 'E', par: 8, demo: [['repU', [['if', ['m'], [['ifm', ['r', 'so'], ['l', 'sb']]]]]]], palette: ['move', 'left', 'right', 'repeat', 'if', 'ifmode', 'setBlue', 'setOrange'], combo: false },
  { name: 'Sweep', icon: '3', title: 'The Sweep',
    text: 'Mow the WHOLE field: grab every gem 💎 and reach the gate ⛩️. At each end the fox must U-turn — and both ends look identical, so only its switch knows which way to turn. Build: Repeat until ⛩️ [ If Path → Step · else → If 🔵 → Right, Step, Right & Set 🟠 · else → Left, Step, Left & Set 🔵 ].',
    concept: 'The same memory trick, now driving a U-turn to sweep a whole field — this is how a robot mower or a printer head really works.',
    grid: ['S****', '*****', '*****', 'G****'], dir: 'E', par: 12, demo: [['repU', [['if', ['m'], [['ifm', ['r', 'm', 'r', 'so'], ['l', 'm', 'l', 'sb']]]]]]], palette: ['move', 'left', 'right', 'repeat', 'if', 'ifmode', 'setBlue', 'setOrange'], combo: false },
  { name: 'Boss', icon: '4', title: 'The Big Field',
    text: 'The championship: clear a whole BIG field — every gem 💎 — and reach the gate ⛩️. Your sweep rule doesn’t change at all; set the Repeat to ‘until ⛩️’ and let it run. Same memory, any size.',
    concept: 'A real algorithm scales: the same remembered switch clears a field of any size — you never told it how big the room is.',
    grid: ['S*****', '******', '******', '******', '*****G'], dir: 'E', par: 12, demo: [['repU', [['if', ['m'], [['ifm', ['r', 'm', 'r', 'so'], ['l', 'm', 'l', 'sb']]]]]]], palette: ['move', 'left', 'right', 'repeat', 'if', 'ifmode', 'setBlue', 'setOrange'], combo: false },
];

/* ===== Lesson 5 — BELT TEST (Purple) ===== */
export const L5_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Stairs', text: 'Make the fox climb the staircase to the gate.',
    hint: 'Repeat [ Step, then If 🔵 → Right & Set 🟠, else → Left & Set 🔵 ].', grid: ['S.##', '#..#', '##..', '###G'], dir: 'E', par: 7, palette: ['move', 'left', 'right', 'repeat', 'ifmode', 'setBlue', 'setOrange'], combo: false,
    solution: [['rep', 8, ['m', ['ifm', ['r', 'so'], ['l', 'sb']]]]] },
  { name: 'T2', icon: '2', title: 'Test 2 — Mow', text: 'Collect every gem 💎 and reach the gate ⛩️.',
    hint: 'Snake the rows. At each end, If 🔵 U-turn one way (Set 🟠), else the other (Set 🔵).', grid: ['S***', '****', '***G'], dir: 'E', par: 12, palette: ['move', 'left', 'right', 'repeat', 'if', 'ifmode', 'setBlue', 'setOrange'], combo: false,
    solution: [['repU', [['if', ['m'], [['ifm', ['r', 'm', 'r', 'so'], ['l', 'm', 'l', 'sb']]]]]]] },
  { name: 'T3', icon: '3', title: 'Test 3 — Bigger Mow', text: 'Same job, bigger field. Clear it all.',
    hint: 'The very same rule works — it does not care how big the field is.', grid: ['S****', '*****', '*****', 'G****'], dir: 'E', par: 12, palette: ['move', 'left', 'right', 'repeat', 'if', 'ifmode', 'setBlue', 'setOrange'], combo: false,
    solution: [['repU', [['if', ['m'], [['ifm', ['r', 'm', 'r', 'so'], ['l', 'm', 'l', 'sb']]]]]]] },
  { name: 'T4', icon: '4', title: 'Test 4 — The Whole Field', text: 'Clear the entire field and reach the gate ⛩️.',
    hint: 'Your sweeping rule handles any size — collect everything, end at the gate.', grid: ['S*****', '******', '******', '******', '*****G'], dir: 'E', par: 12, palette: ['move', 'left', 'right', 'repeat', 'if', 'ifmode', 'setBlue', 'setOrange'], combo: false,
    solution: [['repU', [['if', ['m'], [['ifm', ['r', 'm', 'r', 'so'], ['l', 'm', 'l', 'sb']]]]]]] },
];

/* ===== Lesson 6: Best Way — LEARN (shortest path) ===== */
export const L6_LEARN: LevelDef[] = [
  { name: 'Direct', icon: '1', title: 'Straight Talk', shortest: true,
    text: 'Reach the gate — but in the FEWEST steps. Wandering still gets there; the challenge is the shortest way. Tap 🌊 Show the flood to see how a computer finds it.',
    concept: 'New idea: BEST, not just done. Every puzzle so far asked “make it work.” This one asks “is it the shortest?”',
    grid: ['S....', '.....', '....G'], dir: 'E', par: null, palette: ['move', 'left', 'right', 'repeat'], combo: false },
  { name: 'Wall', icon: '2', title: 'Around the Wall', shortest: true,
    text: 'A wall blocks the straight line. Find the shortest way around. Use 🌊 to see the distance to every tile.',
    concept: 'Shortest means reasoning about the detour: which way around costs fewer steps?',
    grid: ['S.#..', '..#..', '..#..', '..#..', '....G'], dir: 'E', par: null, palette: ['move', 'left', 'right', 'repeat'], combo: false },
  { name: 'Fork', icon: '3', title: 'The Fork', shortest: true,
    text: 'Two ways round, and one is shorter. The 🌊 flood spreads out from the start one ring at a time — the number it lands on the gate is the shortest distance.',
    concept: 'The flood is how a computer really does it: spread out ring by ring; the first time it reaches the gate is the shortest way. (This is breadth-first search.)',
    grid: ['S.#...', '..#.#.', '..#.#.', '....#.', '.##.#.', '.#...G'], dir: 'E', par: null, palette: ['move', 'left', 'right', 'repeat'], combo: false },
  { name: 'Boss', icon: '4', title: 'The Labyrinth', shortest: true,
    text: 'A real maze — too tangled to eyeball. Find the shortest path to the gate ⛩️. Let the 🌊 flood reveal the distances, then trace the route by following the numbers down.',
    concept: 'Boss: a maze where you cannot just see the answer. The flood finds the shortest length for you — and you read the route off the numbers, smallest step by step.',
    grid: ['S.....', '.####.', '.#..#.', '.#.##.', '.#....', '##.###', '.....G'], dir: 'E', par: null, palette: ['move', 'left', 'right', 'repeat'], combo: false },
];

/* ===== Lesson 6 — BELT TEST (Brown, no flood) ===== */
export const L6_TEST: LevelDef[] = [
  { name: 'T1', icon: '1', title: 'Test 1 — Direct', shortest: true, text: 'Reach the gate in the fewest steps. No flood to help this time.',
    hint: 'Straight across and down — count the shortest route in your head.', grid: ['S....', '.....', '....G'], dir: 'E', par: null, palette: ['move', 'left', 'right', 'repeat'], combo: false },
  { name: 'T2', icon: '2', title: 'Test 2 — The Wall', shortest: true, text: 'Shortest way around the wall to the gate.',
    hint: 'Reach the gap, then straight to the gate. Which way round is fewer steps?', grid: ['S.#..', '..#..', '..#..', '..#..', '....G'], dir: 'E', par: null, palette: ['move', 'left', 'right', 'repeat'], combo: false },
  { name: 'T3', icon: '3', title: 'Test 3 — The Bends', shortest: true, text: 'Find the shortest path through.',
    hint: 'Picture the flood spreading — take the route that never doubles back.', grid: ['S....', '#.##.', '...#.', '.#.#.', '.#..G'], dir: 'E', par: null, palette: ['move', 'left', 'right', 'repeat'], combo: false },
  { name: 'T4', icon: '4', title: 'Test 4 — The Maze', shortest: true, text: 'The shortest way through the maze to the gate ⛩️.',
    hint: 'Trace it ring by ring in your head: how few steps can reach the gate?', grid: ['S.#...', '..#.#.', '..#.#.', '....#.', '.##.#.', '.#...G'], dir: 'E', par: null, palette: ['move', 'left', 'right', 'repeat'], combo: false },
];

/* ===== Black Belt grading (mixed) ===== */
export const BLACK_TEST: LevelDef[] = [
  { name: 'G1', icon: '1', title: 'Grading 1 — Combo', text: 'Climb down to the gate.',
    hint: 'Spot the repeating pattern. Build a Combo, then Repeat it.',
    grid: ['S.###', '#..##', '##..#', '###..', '####G'], dir: 'E', par: 6, palette: ['move', 'left', 'right', 'repeat', 'combo'], combo: true,
    solution: [['rep', 4, ['combo']]], solutionCombo: ['m', 'r', 'm', 'l'] },
  { name: 'G2', icon: '2', title: 'Grading 2 — Decisions', text: 'Find your way around to the gate.',
    hint: 'If the path is clear, Step; else Turn Right. Inside a big Repeat.',
    grid: ['S....', '.###.', '.###.', '.###.', '....G'], dir: 'E', par: 4, palette: ['move', 'left', 'right', 'repeat', 'if'], combo: false,
    solution: [['rep', 10, [['if', ['m'], ['r']]]]] },
  { name: 'G3', icon: '3', title: 'Grading 3 — Power', text: 'Reach the gate. Mind your energy — the obvious way is a trap.',
    hint: 'Straight runs dry. Detour to the battery first.',
    grid: ['S...G', '##B##'], dir: 'E', par: 10, energy: 3, battery: 4, palette: ['move', 'left', 'right', 'repeat'], combo: false,
    solution: ['m', 'm', 'r', 'm', 'l', 'l', 'm', 'r', 'm', 'm'] },
  { name: 'G4', icon: '4', title: 'Grading 4 — Auto-Pilot', text: 'Reach the far gate, charging only when the meter is low.',
    hint: 'Repeat [ If Low → Charge, else → Step ].',
    grid: ['S..C..C..G'], dir: 'E', par: 4, energy: 4, charge: 3, lowAt: 1, palette: ['move', 'left', 'right', 'repeat', 'iflow', 'charge'], combo: false,
    solution: [['repU', [['iflow', ['ch'], ['m']]]]] },
  { name: 'G5', icon: '5', title: 'Grading 5 — Pilot', interactive: true, text: 'Wire the controls and drive the fox to the gate.',
    hint: 'Put Go ▶ in the ➡️ slot, then press Play.',
    grid: ['S....G'], dir: 'E', par: null, palette: ['goU', 'goD', 'goL', 'goR'], combo: false,
    solutionHandlers: { right: ['goR'] }, solutionSeq: ['right', 'right', 'right', 'right', 'right'] },
  { name: 'G6', icon: '6', title: 'Grading 6 — Memory', text: 'Clear the field — every gem 💎 — and reach the gate ⛩️.',
    hint: 'Snake the rows; remember your travel direction with the mode.',
    grid: ['S***', '****', '***G'], dir: 'E', par: 12, palette: ['move', 'left', 'right', 'repeat', 'if', 'ifmode', 'setBlue', 'setOrange'], combo: false,
    solution: [['repU', [['if', ['m'], [['ifm', ['r', 'm', 'r', 'so'], ['l', 'm', 'l', 'sb']]]]]]] },
  { name: 'G7', icon: '7', title: 'Grading 7 — Shortest', shortest: true, text: 'Reach the gate by the shortest path — fewest steps.',
    hint: 'No doubling back. Count the rings in your head.',
    grid: ['S....', '#.##.', '...#.', '.#.#.', '.#..G'], dir: 'E', par: null, palette: ['move', 'left', 'right', 'repeat'], combo: false },
];

export const LMETA: LessonMeta[] = [
  { id: 'l1', tab: '📚 Lesson 1: Moves', belt: { name: 'Yellow Belt', badge: '🟨' }, audio: 'moves', learn: L1_LEARN, test: L1_TEST },
  { id: 'l2', tab: '📗 Lesson 2: Energy', belt: { name: 'Orange Belt', badge: '🟧' }, audio: 'energy', learn: L2_LEARN, test: L2_TEST },
  { id: 'l3', tab: '📙 Lesson 3: Decisions', belt: { name: 'Green Belt', badge: '🟩' }, audio: 'decisions', learn: L3_LEARN, test: L3_TEST },
  { id: 'l4', tab: '📕 Lesson 4: Controls', belt: { name: 'Blue Belt', badge: '🟦' }, audio: 'controls', learn: L4_LEARN, test: L4_TEST },
  { id: 'l5', tab: '📓 Lesson 5: Memory', belt: { name: 'Purple Belt', badge: '🟣' }, audio: 'memory', learn: L5_LEARN, test: L5_TEST },
  { id: 'l6', tab: '📔 Lesson 6: Best Way', belt: { name: 'Brown Belt', badge: '🟤' }, audio: 'best-way', learn: L6_LEARN, test: L6_TEST },
];

export const BLACK: LessonMeta = { id: 'black', tab: '🥋 Black Belt', belt: { name: 'Black Belt', badge: '🥋' }, test: BLACK_TEST };
