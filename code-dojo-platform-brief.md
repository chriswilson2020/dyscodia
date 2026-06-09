# Code Dojo → Platform: Handoff Brief

A starting document for a fresh Claude Code / Claude Cowork session. Bring the working prototype
(`code-dojo.html`) into the new repo as `prototype/` — it is the spec-by-example. This brief
captures the *why* so the new session doesn't relearn it by trial and error.

---

## 1. Vision

A concept-first platform that teaches **algorithms and programming concepts entirely visually**,
without ever using or showing the syntax of any programming language. Learners build the *structure*
of a solution by tapping blocks and watching it run in a world. They learn what a loop, a variable,
a queue, recursion, or a search actually *is* — deeply enough that the understanding transfers to
any real language later — but the platform itself stays language-free from start to finish.

Syntax is the tax that stops people learning the ideas. This removes the tax permanently. It is
**not** a stepping stone to typing code; the visual medium is the whole thing.

Designed accessibility-first (dyslexia in particular), with a dojo / belt mastery frame.

## 2. Why the prototype works — principles to protect

These are non-negotiable. They are *why* the prototype lands; do not regress them.

- **Concepts, never syntax.** Blocks express meaning (sequence, loop, conditional, variable, event,
  state, search). No keywords, no punctuation, no text code anywhere — not as a goal, not as a
  "code view", not later. The blocks and the world are the entire language.
- **Concrete & embodied.** Abstract control flow is made *visible*: you watch the loop step, you see
  state as the fox's coloured ring, you watch the search flood the grid. Papert's turtle / Karel the
  Robot lineage.
- **Immediate feedback + "Show me" demos + provable solvability.** Every level is verified solvable
  before shipping (currently via Node harnesses that mirror the engine). Keep this; make it CI.
- **Low reading load.** Atkinson Hyperlegible / Lexend, cream background, big tap targets, colour
  cues, short text, optional read-aloud, multiple-choice over free text. A feature, not a constraint.
- **Mastery motivation.** Belts, certificates, a coherent narrative. Progress is visible and earned.
- **Mobile-first, zero-install.** Runs in a browser, no accounts required to start.

## 3. North-star: language-agnostic means *no language at all*

The point of "not tied to any one language" is that the platform never drops into a programming
language — not to teach it, not to show it, not eventually. The ideas are taught and assessed purely
through blocks and worlds.

- A learner who masters this understands the *idea* of a loop, of state, of recursion, of a queue,
  of breadth-first search. That conceptual mastery is what transfers — to Python, to Lua, to
  anything — when they meet a real language elsewhere, on their own terms, later.
- The platform's job is the ideas, taught visually, with zero syntax. That is the differentiator and
  the whole reason it works for learners (and adults) who bounce off text code.
- Progression does **not** fade toward typing. It deepens: harder algorithms, new worlds, and
  eventually choosing the right tool for an unseen problem — all still visual.

(Internally the program is of course a structured data model the interpreter walks — that is plain
engineering. It is never surfaced to the learner as code, and there is no code-generation feature.)

## 4. Microworlds: how to teach algorithms beyond pathfinding

One engine, swappable *worlds*, a shared program model + interpreter. Each world is shaped to a
concept family. Everything below is taught and solved with blocks in the world — never with text.

| World | Looks like | Teaches |
|-------|-----------|---------|
| **Grid** (have it) | fox on tiles, gate, gems, walls | sequence, loop, conditional, variable, event, state; search & pathfinding: BFS, DFS, Dijkstra (terrain costs), A*, greedy vs optimal |
| **Array** | row of bars/heights, a comparator + swap | sorting (bubble/insertion/selection/merge), linear vs binary search |
| **Turtle / Draw** | pen on a canvas | recursion, fractals, geometry, decomposition — with a **visible call stack** |
| **Structures** | conveyor belt = queue, plate stack = stack | stacks/queues; then *show* BFS using the queue, DFS using the stack |
| **Graph** | rooms + corridors (generalised grid) | graph traversal, shortest path on arbitrary graphs |
| **Bot / Event** (Lesson 4 style) | live-driven fox / mini-game | events, handlers, game loops — the on-ramp to interactivity |

**Complexity / Big-O**: race two algorithms on the same world, count operations, watch the gap grow
on bigger inputs. Intuition for O(n²) vs O(n log n) before any notation — and still no code.

## 5. Curriculum structure

- Generalise belts → **disciplines (dojos)**, each White→Black, each ending in a boss that applies
  the discipline's hardest idea at scale (the prototype already does this per-lesson).
- A final **grandmaster capstone**: a problem with no prescribed tool, where the learner must *choose*
  the right algorithm/structure from everything learned — all expressed in blocks.
- Keep certificates per belt/discipline.

## 6. Architecture (refactor target)

The prototype is one ~180KB HTML file — correct for a prototype, wrong for a platform. Split into:

- **engine/** — world simulation (step, collide, energy, gems, render to canvas). World-agnostic
  core + per-world modules.
- **program-model/** — the block/program data model the interpreter walks. Internal only; never
  rendered as text code.
- **interpreter/** — walks the program against a world; produces a frame timeline for playback.
- **editor/** — the block UI (tap to add/edit/reorder).
- **content/** — **lessons & worlds as data** (JSON/YAML), so curriculum is authored *without*
  touching engine code. Critical for scaling content and for non-devs (Cowork) to add lessons.
- **ui/** — shell, navigation, belts, certificates, audio player, persistence.

There is deliberately **no code-generation module.**

## 7. Build vs buy the block editor

- Google **Blockly** exists, but its main selling point is generating text code in many languages —
  which this platform explicitly does **not** want, and its blocks are syntax-shaped and not
  accessibility-tuned. So Blockly is a poor fit here.
- **Recommendation:** keep the bespoke, friendly, dyslexia-first block editor from the prototype and
  grow it. The block vocabulary is part of the pedagogy, not a generic tool to bolt on.

## 8. Tech stack (recommendation)

- **Svelte or React** for the UI; **TypeScript** throughout (the program model + interpreter benefit
  from types).
- **Vite** build; deploy as a static site (GitHub Pages today; any static host later).
- **Vitest/Jest** for unit tests on the interpreter and level solvability.
- Keep it a **static, client-only app** for as long as possible. Add a backend only when accounts /
  teacher dashboards are genuinely needed.

## 9. Testing / CI — formalise the solvability gate

The prototype is hand-verified with Node harnesses that mirror the engine. Make this automatic:

- Every authored level declares (or the build derives) a reference solution.
- CI runs the **real interpreter** over every level and fails the build if any level is unsolvable,
  any "Show me" demo doesn't actually solve, or any "best path" target is wrong.
- This is a genuine differentiator: content can't ship broken.

## 10. Accessibility requirements (carry forward, treat as acceptance criteria)

- Dyslexia-friendly typefaces, cream/low-glare palette, generous spacing, large targets.
- Read-aloud available; **no surprise/auto speech** (learner-triggered only — a lesson learned).
- Recorded lesson audio with a real player (play/pause + scrub), files loaded from a folder, with a
  graceful "not added yet" state.
- Minimal text; prefer multiple-choice and direct manipulation. (No typing required — ever, for the
  learner.)
- Colour never the *only* signal (pair with icon/shape) — important for colourblind learners too.

## 11. Persistence & growth (later phases)

- MVP: `localStorage` (per device), reset control. (Prototype already does this.)
- Later: optional accounts for cross-device progress, parent/teacher views, class assignment,
  printable progress reports. This is where a SEND-curriculum product would live.

## 12. Phased roadmap

- **P0 — Extract the spine.** Refactor prototype into engine / program-model / interpreter /
  content-as-data, no new features. Add the CI solvability gate. Ship parity with today.
- **P1 — New worlds.** Array world (sorting) and Turtle world (recursion) — proves the engine
  generalises beyond the grid. All blocks, no text.
- **P2 — More algorithms & depth.** Weighted pathfinding (Dijkstra/A*), data-structure world
  (stack/queue) feeding the search worlds, complexity races.
- **P3 — Authoring & scale.** Content-authoring tooling (so Cowork can write lessons), then accounts
  / teacher mode if pursuing the product path.

## 13. How to run the handoff

- **Claude Code** for the build: point it at this brief + `prototype/code-dojo.html`. Start at P0.
- **Claude Cowork** alongside for curriculum, lesson scripts (`code-dojo-audio-scripts.md` is a
  template), and asset organisation — work that doesn't need an engineer.
- Bring into the new repo: `code-dojo.html` (as `prototype/`), `README.md`,
  `code-dojo-audio-scripts.md`, and this brief.

---

## Appendix — copy-paste kickoff prompt for the first Claude Code session

> I'm turning a prototype into a platform. In `prototype/code-dojo.html` is a working single-file
> block-coding game: a fox is programmed via tappable blocks to solve grid puzzles, teaching
> sequence, loops, conditionals, variables, events, state, and breadth-first search, with a belt
> progression and dyslexia-first design. Read it fully — it's the spec-by-example — and read
> `code-dojo-platform-brief.md` for the vision and principles.
>
> Core principle, non-negotiable: this platform teaches programming and algorithm concepts ENTIRELY
> VISUALLY, through blocks and worlds. It never uses, shows, generates, or fades toward the syntax of
> any programming language. There is no "code view", no language targets, no typing. The blocks and
> the world are the whole medium.
>
> Goal for this first phase (P0): refactor the single file into a clean, typed, modular codebase
> **without changing what the user sees** — engine (world sim), program-model (the block/program data
> model the interpreter walks, internal only), interpreter (produces a playback timeline), and content
> (every lesson/level as data, not code). Use TypeScript + Vite, keep it a static client-only app, and
> set up Vitest. Do NOT add any code-generation module.
>
> Then add a CI gate: a test that runs the real interpreter over every level and fails if any level is
> unsolvable, any "Show me" demo doesn't solve it, or any shortest-path target is wrong — this
> replaces the manual Node verification done today.
>
> Before writing code, propose the program-model shape and the module boundaries and let me approve
> them. Preserve all accessibility behaviour (fonts, palette, read-aloud, learner-triggered audio only,
> minimal text). Don't add new features yet — parity first.

(After P0 is approved, the next session's goal is P1: add a second world — an Array world for sorting —
proving the engine generalises beyond the grid. Still entirely visual, no text code.)
