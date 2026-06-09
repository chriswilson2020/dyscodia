# Code Dojo — Lesson Audio Scripts

One warm, consistent voice. Read slightly slow, with clear pauses at the full stops.
Export each as a plain MP3 named **l1.mp3 … l6.mp3** and drop them in a **`dojo-audio/`**
folder sitting next to `index.html`. The player loads them automatically — nothing else to do.

(Optional Black Belt clip at the end — see note.)

---

## Lesson 1 — Moves (Yellow Belt)
*Concept: sequence, loop, decision*

Welcome to the dojo. The most important thing to understand first is this: your fox cannot think. It has no idea where the gate is. It only does exactly what your blocks say, one at a time, from the top of the list to the bottom. That ordered list has a name — a sequence — and it is the foundation of all code. Now watch what happens when a job repeats. To take ten steps, you could stack ten Step blocks, but that is slow and easy to get wrong. Instead, put one Step inside a Repeat block and set the number to ten. That is a loop: write it once, run it many times. Last idea. Sometimes the fox has to choose. If the path ahead is clear, step; otherwise, turn. That is an If/Else — a decision the fox makes by checking the world around it. Sequence, loop, decision. Every program you will ever write, in any language, is built from these three. Master them here.

---

## Lesson 2 — Energy (Orange Belt)
*Concept: variables*

There is something new at the top of the screen now: energy. Every single step your fox takes costs one unit, and the number ticks down as it moves. If it reaches zero, the fox stops dead — even if the gate is one step away. So your job has changed. Before, you just needed a path that reached the gate. Now you need a path the fox can actually afford. See the battery on the grid? Stepping onto it refills your energy. And here is the clever part: very often the shortest route runs you dry, while a slightly longer route past the battery gets you there with energy to spare. That energy number is what programmers call a variable. A variable is just a named box that holds a value the program remembers and changes while it runs — your score in a game, the time on a clock, the lives you have left. They are all variables. Watch the number, plan around it, and spend it wisely.

---

## Lesson 3 — Decisions (Green Belt)
*Concept: conditionals at run-time / autonomy*

Until now, you made every decision yourself, before you pressed Run. This lesson hands the thinking to the fox, while it moves. You get two new blocks. If Low checks the energy number, and is only true when energy is running down. Charge tops the fox up, but only when it is standing on a charging pad. Now drop them both inside a Repeat, like this: again and again — if energy is low, charge; otherwise, take a step. Press Run and watch closely. The fox drives the whole length of the road by itself. It stops to charge only at the moment it genuinely needs to, and it never wastes a turn. And here is the powerful part: you never told it *when* to charge. You gave it one small rule, and it works that rule out fresh, every time, from the number in front of it. That is the difference between a plain list of instructions and a real algorithm — a rule smart enough to handle a road of any length you give it.

---

## Lesson 4 — Controls (Blue Belt)
*Concept: events and event handlers*

This lesson feels different, because this time you are the one driving. Instead of writing the fox's whole plan in advance, you wire up the controls and then steer it live. Look at the handler blocks. One says: when the Right arrow is pressed, move right. Another says: when Up is pressed, move up. These are called event handlers. An event is simply something that happens — a key press, a tap, a click. A handler is the piece of code that wakes up and runs the instant that event happens, and not a moment before. So you set your handlers, you press Play, and now the arrow keys and the pad on screen belong to you — guide the fox to the gate yourself. And this is not a toy version. This is exactly how every game and app you use really works underneath. Nothing happens on its own. The program sits and waits, and every time you press something, a handler fires and decides what to do. You have just built the beating heart of interactive software.

---

## Lesson 5 — Memory (Purple Belt)
*Concept: state*

This is the hardest idea in the whole dojo, and also the most important — so stay with me. Look at the staircase. The fox needs to turn right, then left, then right, alternating all the way up. Easy for you, because you can see the whole shape at once. But the fox cannot. To the fox, every corner looks identical — it has no way to tell a turn-right corner from a turn-left corner just by looking. So how can it possibly know? It carries a switch in its head: blue or orange. The rule is simple. If I am blue, turn right and flip to orange. If I am orange, turn left and flip to blue. That switch is memory — the fox remembering what it did last time, so it can decide correctly now. Programmers call this state: the information a program holds on to in order to track where it is. And the very same trick lets the fox sweep a whole field — remember which way you were heading, and you always U-turn the right way. Once you can give a program a memory, you can make it do almost anything.

---

## Lesson 6 — Best Way (Brown Belt)
*Concept: shortest path / breadth-first search*

Plenty of paths reach the gate. This lesson asks a harder question: which path is the shortest? You could guess and count, but a computer needs a method that always works. Here is the one it actually uses — and you can watch it happen. Tap "Show the flood." Starting from the fox, the grid fills outward one ring at a time: every square one step away is labelled one, every square two steps away is labelled two, and so on, the numbers spreading out like water finding its level. The moment the flood reaches the gate, the number sitting on it is the shortest distance — and it is guaranteed, because the flood always reaches the near squares before the far ones. This method has a name: breadth-first search. It is a genuine algorithm, and it is running every time a map app finds your quickest route, or a game character takes the smartest path to chase you. Now it is your turn. Reach the gate in exactly that many steps — not one more. Finding an answer is good. Finding the best answer is engineering.

---

## (Optional) Black Belt
*Note: the player currently hides on tests and the Black Belt. If you want this one to play,
say so and I'll wire a play point for it — export it as `black.mp3`.*

This is your black belt grading. There is no new idea to learn here — and that is the point. Everything is already in your hands: sequences and loops, decisions and energy, handlers, memory, and the shortest path. A black belt does not mean you have finished. It means you can now combine the basics freely to solve a problem you have never seen before. Read each challenge, work out which tools it really needs, and build the cleanest solution you can. Take your time. Think before you place a block. Trust what you have learned. When you pass this, you will not just know some blocks — you will think like a programmer.

---

### Production notes
- One voice throughout; a calm, friendly, slightly-slow delivery suits the dyslexia-friendly design.
- Pause clearly at full stops and between the numbered ideas — listeners are watching the screen at the same time.
- Export MP3 (mono is fine), name `l1.mp3`–`l6.mp3`, put them in `dojo-audio/` beside `index.html`, commit, done.
- ElevenLabs: pick one voice, high stability (~0.6–0.75), and keep it identical across all six for consistency.
