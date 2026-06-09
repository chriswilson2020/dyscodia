# Code Dojo — Teaching Videos

Scripts + a practical production guide. Built for ElevenLabs voiceover over a screen recording of the dojo. One short video per lesson.

---

## The plan in a nutshell

One video per lesson, **2–3 minutes, hard cap**. Structure every time:

1. **The idea** (30–60s) — name the one new way of thinking.
2. **Watch one** — solve a single Learn level slowly while you narrate.
3. **Your turn** — send them into the app.

The screen is the lesson, so the recording is just the dojo itself being used. The voice carries the teaching — which is exactly right for a dyslexic learner. No talking-head, no cartoon presenter; they compete with the thing you actually want watched.

---

## ElevenLabs settings

- **Pick one voice and reuse it for all six.** Consistency makes it feel like a real teacher. A warm, calm, clearly-spoken voice; a British accent suits the context but isn't essential.
- **Slow it slightly.** Instruction for a 13-year-old (especially with dyslexia) wants breathing room. Lower the speed a notch, or add pauses (below).
- **Stability fairly high** (calm, even delivery beats theatrical for teaching). Nudge expressiveness up only if it sounds robotic.
- **Pauses:** the scripts use line breaks and "…" where the learner should *watch the screen*. If your model supports break tags, you can insert `<break time="0.8s" />`; otherwise render paragraph-by-paragraph and leave gaps when you assemble.
- Render each lesson as **one MP3** (or per paragraph if you want tighter control over pauses).

---

## Recording & assembly

**Simplest (no editing):** play the finished MP3 out loud and screen-record the dojo at the same time, doing the actions in time with the words. One take, done. Mac: Cmd-Shift-5. Windows: Game Bar (Win-G) or free **OBS**.

**Slightly nicer (light edit):** record the screen silently, then lay the MP3 over it in a free editor — **CapCut**, **Clipchamp** (Windows), or **iMovie** (Mac). Trim dead air, done.

Either way: record the **real app** (open the HTML file), show the blocks being added, press Run, let the fox move. Zoom the browser to ~125% so the blocks read clearly.

**Captions:** you already have the exact words — paste the script in as subtitles. Counter-intuitively, captions *help* dyslexic viewers when paired with audio, and they make it accessible and searchable if it goes public.

---

## Hosting & safety (it might go broader)

- **Now, for Gabriel:** keep the MP4s in a folder on his laptop/iPad (offline, no ads, no "recommended" rabbit-hole), **or** an **unlisted** YouTube playlist — shareable by link, not searchable, and it scales the moment you want to widen it.
- **If it goes public later:** make the playlist public, add the captions, give it a consistent thumbnail.
- **Child-safety basics**, since it's children's content: no face on camera (you don't need one), **don't use a child's full name or any personal details** in public videos, and start unlisted until you're sure. The dojo itself has no data collection — progress is stored only in the browser on the device.

---

## THE SCRIPTS

Each has a **Shot list** (what to show) and a **Voiceover** (clean text to paste into ElevenLabs). The voiceover is written to be *heard*, not read.

---

### Lesson 1 — Moves  · *Yellow Belt*

**Shot list:** Open Lesson 1 → "First Steps." Add three Step blocks, Run, fox reaches the gate. Cut to "The Long Hall": add a Repeat with one Step inside, set it to 7, Run. Briefly show "Around the Ring" solving with If Path. End on the level list.

**Voiceover:**

Welcome to the Code Dojo. This is where you teach a little fox to think.

Here's the whole idea: the fox does exactly what you tell it. Nothing more, nothing less. So if you want it to reach the gate, you give it a list of steps — and it follows them, top to bottom.

Watch. Three steps… and it walks straight to the gate. That's called a sequence. One thing after another.

Now, this next hall is long. You *could* drag in seven steps… or you can be clever. Drop one step inside a Repeat, and tell it to do it seven times. One block, same result. That's a loop — and loops are how you stop doing boring work by hand.

Sometimes the fox needs to *choose*. If the path ahead is clear, step. If it's blocked, turn. That's a decision.

And when you find yourself doing the same little dance over and over, you can bottle it up as a Combo and reuse it.

That's your toolkit: steps, loops, decisions, and combos. Everything else is built from these four.

Your turn. Work through the lessons, then take the belt test. Pass it, and you earn your first belt. Off you go.

---

### Lesson 2 — Energy  · *Orange Belt*

**Shot list:** Lesson 2 → "Power On." Point to the energy number up top. Run a Repeat of steps, watch energy count down to the gate. Cut to "Top Up": run out, then show the battery topping it back up. End on the boss "Power Crisis" board (don't solve, just show the trap).

**Voiceover:**

Last time, the fox just followed steps. Now it has to keep track of something — and that changes everything.

See that number at the top? That's energy. Every step costs one. Run out, and the fox stops dead.

So this isn't just "find the way" any more. It's "find the way *and* don't run out." A number that the fox remembers and changes as it moves — that's called a variable. It's one of the most important ideas in all of computing, and here it's sitting right at the top of the screen.

Watch the number tick down as it walks… and watch it jump back up when the fox grabs a battery.

Now here's the trap on the boss level. The short way, straight to the gate, *looks* obvious — but it runs out of power halfway, and it skips the gem. The clever move is to go the long way round, grab the battery, and arrive with the tank on empty. Same idea you'll use one day to manage health, or money, or fuel.

Plan your energy. Take the belt test when you're ready.

---

### Lesson 3 — Decisions  · *Green Belt*

**Shot list:** Lesson 3 → "Read the Meter." Build `Repeat [ If Low → Charge, else → Step ]`. Run, watch the fox drive itself, stopping to charge only when low. Cut to a longer level — same program, no changes, still works.

**Voiceover:**

So far, *you've* made every decision for the fox. Now you're going to teach it to decide for itself.

There are two new blocks. "If Low" looks at the energy number and asks a question: am I running low? And "Charge" tops the fox up when it's standing on a charging pad.

Put them together and something brilliant happens. Build this: repeat — if you're low, charge; otherwise, take a step.

Watch. It drives forward… and the moment it gets low, it stops, charges, and carries on. All on its own. You didn't tell it *when* to charge — it worked that out from the number.

And here's the beautiful part. That same little program — those same blocks — works on a short road *and* a long road. You don't change a thing. That's the difference between writing instructions and describing *behaviour*. Behaviour scales. Instructions don't.

This is a self-driving fox. Build the loop, watch it think, and earn your green belt.

---

### Lesson 4 — Controls  · *Blue Belt*

**Shot list:** Lesson 4 → "Take the Controls." Drop "Go Right" into the ➡️ slot. Press Play. Drive the fox with the arrow keys / on-screen D-pad to the gate. Show wiring all four arrows on the next level, then driving a maze.

**Voiceover:**

Everything you've built so far runs by itself. Now *you* are going to drive — and that means programming the controls.

This level is different. Instead of one list of instructions, you get slots — one for each key. They say: *when* this key is pressed, *do* this. That's called an event. Your code stops running top-to-bottom and starts reacting — to you.

Watch. I'll drop "Go Right" into the right-arrow slot… press Play… and now the right arrow actually moves the fox. I built that control.

Wire up all four arrows, and you've made yourself a game pad. You can even wire a key to Charge — a power button.

And here's why this matters. Up to now, the fox knew everything in advance. Now it can't — because it has no idea which key *you'll* press next. So decisions stop being optional. The world just became unpredictable, and that's what makes it a real game.

Build your controls, press Play, and drive. Blue belt's waiting.

---

### Lesson 5 — Memory  · *Purple Belt*

**Shot list:** Lesson 5 → "The Staircase Switch." Build `Repeat [ Step, then If Blue → Right & Set Orange, else → Left & Set Blue ]`. Run, point out the coloured ring flipping as it climbs. Cut to "The Sweep": run it mowing the field row by row. Pause at a U-turn and point at the ring.

**Voiceover:**

Here's the deepest idea yet, and it's a small one. Until now, the fox only ever reacted to what it could *see* — a wall in front of it, a low battery. Now it's going to remember something it *can't* see.

Two new blocks. "Set Mode" flips a switch in the fox's head — blue or orange. You can see it as a coloured ring. And "If Blue" checks that switch, and does different things depending on it.

Watch it climb this staircase. Step, then flip the switch, and the switch decides which way to turn next. One rule… changing behaviour.

Now the clever bit. On this field, the fox has to mow every row, snaking back and forth. And here's the catch — look. At *both* ends of a row, the fox sees exactly the same thing: a wall ahead, both sides open. Looking tells it nothing. The only thing that knows which way to turn… is what it *remembers* about the way it was going.

That's memory. And that's how a robot mower or a printer head really works. Earn your purple belt.

---

### Lesson 6 — Best Way  · *Brown Belt*

**Shot list:** Lesson 6 → "Straight Talk." Solve it in 6 steps; show the step counter and "best possible." Then wander a longer route and show it being rejected. Cut to "The Labyrinth": press **🌊 Show the flood**, let it spread and number every tile, point at the number on the gate. Trace the route down the numbers.

**Voiceover:**

Every lesson so far has asked one question: does it work? This one asks a harder one. Is it the *best*?

Reaching the gate isn't enough any more. Look at the step counter, and look at the target: "best possible." Now you have to find the *shortest* way. Wander, and you'll still arrive — but it won't count. Watch: nine steps, when the best is six. Try again.

For a small grid you can eyeball it. But this maze? No chance. So let me show you how a computer does it. Press "Show the flood."

Watch it spread out from the start, one ring at a time — every tile gets a number: how many steps to reach it. And the very first time the flood touches the gate… that number *is* the shortest distance. There's no shorter way, because the flood would have got there sooner.

That's a real algorithm — it's called breadth-first search — and you just watched it run. Now read the route off the numbers: follow them downward, smallest step by step, back to the start.

Find the best way. Brown belt — and then the black belt grading, where everything comes together.

---

*Tip: if you record these in order, you'll naturally build a playlist that mirrors the belts — white through black. Keep each one short, keep your voice warm, and let the screen do the teaching.*
