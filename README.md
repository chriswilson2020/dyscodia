# Dyscodia — Code Dojo

**Learn programming and algorithms entirely visually — no syntax, ever.**

Code Dojo teaches the *ideas* behind code — sequence, loops, conditionals, variables,
events, memory, search, sorting, data structures and graph traversal — through tappable
blocks and animated worlds. There is no code view, no language targets, and no typing.
The blocks and the worlds are the whole medium. It's designed accessibility-first
(dyslexia in particular): friendly typefaces, a low-glare palette, big tap targets,
optional read-aloud, and minimal text.

**▶ Live site:** https://chriswilson2020.github.io/dyscodia/

---

## What's inside

The same shared interpreter drives four distinct worlds, grouped into Lessons:

### Lesson One — the Grid (a fox on tiles)
Six modules taking the fox from first steps to shortest-path search:

- **Moves** — sequence, loops, conditionals, reusable combos (functions)
- **Energy** — variables you watch change
- **Decisions** — branching on a value (self-driving loops)
- **Controls** — events and handlers (you drive)
- **Memory** — carrying a hidden state to solve mazes
- **Best Way** — shortest paths, with the breadth-first "flood" made visible

### Lesson Two — the Array (a row of bars + a comparator lens)
- **Bubble / Selection / Insertion Sort** — three sorts, each its own module
- **Search** — linear scan and binary halving
- **The Race** — complexity made concrete: op-count comparisons, a growth panel,
  and **live side-by-side races** (three sorts at once; linear vs binary) so you
  *watch* which algorithm wins as the input grows

### Lesson Three — Structures & Graphs
- **Stack** (LIFO, reverse a row) and **Queue** (FIFO, keep the order)
- **Breadth-First** and **Depth-First** traversal — the same program on the same
  graph, where swapping one block (**Take Front** vs **Take Top**) flips between
  the two algorithms, closing the loop back to Lesson One's flood

Belts are earned per Lesson (Yellow → Orange → Green …), with a printable certificate.

## Core principle

Concepts, never syntax. Blocks express *meaning* — a loop, a conditional, a variable,
a queue, a search — and the world makes the abstract concrete: you watch the loop step,
see state as the fox's coloured ring, watch the search flood the grid, watch the bars
settle into order. The conceptual mastery is what transfers to any real language later.

## Tech

- **TypeScript** throughout; **Vite** build; **Vitest** tests
- Static, client-only — the production build is a **single self-contained HTML file**
  (`app/dist/index.html`) that runs straight from the filesystem
- Architecture: `program-model` (the typed blocks the interpreter walks) ·
  `engine` (world-agnostic core + per-world sim/render) · `interpreter` (a shared
  control-flow walker that produces a frame timeline) · `content` (every lesson and
  level as data) · `editor` + `ui`. No code-generation module, by design.

## Run locally

```bash
cd app
npm install
npm run dev      # local dev server
npm run build    # single-file production build → dist/index.html
npm test         # runs the solvability gate + UI tests
```

## The solvability gate (CI)

`npm test` runs the **real interpreter** over every authored level and fails if any
level is unsolvable, any "Show me" demo doesn't solve, any shortest-path target is
wrong, any sort doesn't end sorted, any search doesn't find its target, or any graph
traversal doesn't reproduce the right visit order. Content literally cannot ship broken.
The same suite gates the GitHub Pages deploy.

## Accessibility (acceptance criteria)

Atkinson Hyperlegible / Lexend typefaces, cream low-glare palette, generous spacing and
large targets, read-aloud on demand (**no surprise audio** — learner-triggered only),
colour always paired with icon/shape, and no typing required of the learner — ever.

## Repository layout

```
app/            the platform (TypeScript + Vite + Vitest)
prototype/      the original single-file prototype (spec-by-example)
docs/           brief, audio & video scripts
dojo-audio/     drop lesson mp3s here (graceful "not added yet" state otherwise)
.github/        CI (solvability gate) + GitHub Pages deploy
```

## Lesson audio (optional)

The Learn side of each grid module shows an audio player that looks for one MP3 per
lesson in `dojo-audio/` (`l1.mp3` … `l6.mp3`). Add the files you have; the rest show a
greyed-out "add lN.mp3" state. Audio is learner-triggered only. Scripts are in
`docs/code-dojo-audio-scripts.md`.

---

A learning game by **Listerdale Life Sciences**.
