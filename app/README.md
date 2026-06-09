# Dyscodia — platform build

The prototype (`../prototype/code-dojo.html`) refactored into a typed, modular,
static client-only app. **No behaviour changes** — this is parity with the
prototype, with a clean spine to build worlds on next.

Core principle, unchanged: programming and algorithm concepts are taught
**entirely visually**, through blocks and worlds. No language syntax is ever
used, shown, generated, or faded toward. There is no code view and no typing.

## Run

```bash
cd app
npm install
npm run dev      # local dev server
npm run build    # single-file static build → dist/index.html (opens via file://)
npm test         # the solvability gate + UI smoke test
```

## Architecture

```
src/
  program-model/   types only — Block, Program, Handlers, Frame, Outcome (internal; never rendered as text)
  engine/          world simulation. core (state, step/turn/charge primitives, BFS) + worlds/grid (parse + canvas render)
  interpreter/     walks a Program → Frame timeline; event interpreter for interactive levels; demo/solution DSL expander
  content/         every lesson & level as data, plus internal reference solutions for the CI gate
  editor/          block presentation metadata (icons, colours, labels)
  ui/              shell: navigation, editor, playback, belts, certificates, audio, persistence
```

There is deliberately **no code-generation module**.

## The solvability gate

`npm test` runs the *real* interpreter over every authored level and fails if:

- any level is unsolvable (its reference solution doesn't reach the gate),
- any "Show me" demo doesn't actually solve its level,
- any shortest-path level's gate is unreachable or its target disagrees with an
  independent breadth-first search.

This replaces the prototype's manual Node verification. CI (`.github/workflows/ci.yml`)
runs the gate, a type-check, and the build on every push.

## Accessibility (carried forward as acceptance criteria)

Atkinson Hyperlegible / Lexend, cream low-glare palette, large tap targets,
read-aloud on demand, **learner-triggered audio only** (no surprise speech),
colour always paired with icon/shape, and no typing required of the learner.

## Audio

Recorded lesson audio loads from `dojo-audio/<lessonId>.mp3` with a graceful
"not added yet" state, exactly as the prototype expects.
