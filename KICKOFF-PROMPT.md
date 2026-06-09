# Kickoff prompt — paste into a fresh Claude Code session

This folder is ready to drop into a new project (or a new git repo). Open it in Claude Code, then
paste the prompt below to start the platform build. The brief at
`docs/code-dojo-platform-brief.md` has the full vision, principles, architecture and roadmap.

## Core principle (read first)

This platform teaches programming and algorithm concepts **entirely visually**, through blocks and
worlds. It **never** uses, shows, generates, or fades toward the syntax of any programming language.
No "code view", no Python/JS/Lua output, no typing — not as a goal, not later. The blocks and the
world are the whole medium. Language-agnostic means *no language at all*.

---

## What's in this folder

- `index.html` — the working game. Open it in a browser to play, or deploy as-is to GitHub Pages.
- `README.md` — repo readme (play, deploy, audio folder, etc.).
- `dojo-audio/` — drop `l1.mp3`…`l6.mp3` here for lesson voiceovers (see the note inside).
- `prototype/code-dojo.html` — the same game, kept as the spec-by-example for the rebuild.
- `docs/`
  - `code-dojo-platform-brief.md` — the platform vision + architecture + phased plan.
  - `code-dojo-audio-scripts.md` — voiceover scripts (record these).
  - `code-dojo-video-scripts.md` — earlier video/voiceover scripts.

## Play / deploy now (no build needed)

- Play: open `index.html` in a browser.
- Deploy: push this folder to a GitHub repo → Settings → Pages → Deploy from branch `main`, folder
  `/ (root)`. (Audio needs the live URL, not a file opened off disk.)

---

## Phase 0 prompt (paste this first)

> I'm turning a prototype into a platform. In `prototype/code-dojo.html` is a working single-file
> block-coding game: a fox is programmed via tappable blocks to solve grid puzzles, teaching
> sequence, loops, conditionals, variables, events, state, and breadth-first search, with a belt
> progression and dyslexia-first design. Read it fully — it's the spec-by-example — and read
> `docs/code-dojo-platform-brief.md` for the vision and principles.
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

## Phase 1 prompt (after P0 is approved)

> Now P1: add a second world to prove the engine generalises beyond the grid — an **Array world** for
> sorting (a row of bars the fox compares and swaps; teaches bubble/insertion/selection and linear vs
> binary search). Reuse the same block/program model and interpreter; only the world and its render
> differ. Still entirely visual — no text code of any kind. Add the new world's levels as content data
> and put them through the same CI solvability gate.

## Decisions to make before building (see brief §7 and §1/§11)

- **Scope** — home/family use vs a SEND-first curriculum product (the latter adds accounts and
  teacher tooling later).
- (Block editor: keep the bespoke dyslexia-first one — Blockly is a poor fit here because its whole
  point is generating text code, which we explicitly don't want. See brief §7.)

## Use Claude Cowork alongside Claude Code

Use Cowork (non-engineering) for curriculum authoring, writing lesson scripts (the audio-scripts file
is a template), and organising assets — while Claude Code does the engine/codebase work.
