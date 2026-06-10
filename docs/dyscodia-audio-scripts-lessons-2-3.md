# Dyscodia — Lesson Audio Scripts (Lessons Two & Three)

Same warm, consistent voice as Lessons One. Read slightly slow, with clear pauses at the
full stops. Export each as a plain MP3 and drop it in the **`dojo-audio/`** folder beside the
app. The player loads it automatically on the Learn side of each module.

**Filenames are codified by position:** `l<lesson>m<module>` — so Lesson Two, third module
(Insertion Sort) is `l2m3.mp3`. Sequential and self-documenting:

| Lesson | Module | File |
|--------|--------|------|
| Two | Bubble Sort | `l2m1.mp3` |
| Two | Selection Sort | `l2m2.mp3` |
| Two | Insertion Sort | `l2m3.mp3` |
| Two | Search | `l2m4.mp3` |
| Two | The Race | `l2m5.mp3` |
| Two | Challenge | `l2m6.mp3` |
| Three | Stack | `l3m1.mp3` |
| Three | Queue | `l3m2.mp3` |
| Three | Breadth-First | `l3m3.mp3` |
| Three | Depth-First | `l3m4.mp3` |
| Three | Challenge | `l3m5.mp3` |

---

# Lesson Two — Sorting, Searching & Strategy

## Bubble Sort  ·  `l2m1.mp3`
*Concept: comparing and swapping adjacent items*

Welcome to a brand-new world. Instead of a fox on tiles, you have a row of bars of different heights, and a little lens that sits over two of them at a time. Your job is to put the bars in order, shortest to tallest. Here is the very first idea of sorting: look at the two bars under the lens, and if the left one is taller than the right, swap them. Just that — compare, and swap when they are the wrong way round. Now do it again and again, sliding the lens along the row: if taller, swap; step to the next pair; and when you reach the end, rewind to the start and sweep again. Watch the tallest bar bubble all the way to the right on the first pass, then the next tallest, and the next. That is bubble sort — one of the first sorting methods anyone learns. It is not the fastest, but it is beautifully simple: keep sweeping and swapping out-of-order neighbours, and the whole row falls into order. Repeat until sorted, and let it run.

---

## Selection Sort  ·  `l2m2.mp3`
*Concept: remember the smallest, then place it*

Same row of bars, but a completely different way of thinking. This time, before you move anything, you go looking. Scan along the whole row and remember the shortest bar you have seen — that little marker keeps track of it. When you reach the end, you know exactly which bar is smallest, so you place it at the front, where it belongs. Then you do it again with what is left, and again, and the sorted part grows from the left, one bar at a time. That is selection sort. The clever thing about it is restraint: it does a lot of looking, but it only ever makes one move per pass — it picks the right bar once and puts it straight into place. Where bubble sort fidgets, swapping over and over, selection sort scans patiently and places with confidence. Remember the smallest, place it, repeat — and watch the green sorted region grow.

---

## Insertion Sort  ·  `l2m3.mp3`
*Concept: slide each item back into place*

Here is a third way to sort the same row, and it is the one you probably use without thinking — it is how most people sort a hand of cards. Take each bar in turn, and slide it back to the left, past any bar that is taller than it, until it slots into the right place. That is the whole idea: whenever a bar is shorter than the one on its left, swap them and step back; keep shuffling it left until it fits, then move on to the next. This is insertion sort. Its special talent is this: when the row is already almost in order, it barely has to move anything at all — each bar is nearly home already — so on tidy data it is wonderfully quick. Slide each bar back until it fits, and build the sorted row one slotted-in card at a time. Remember this one — it matters later, when you have to choose the right tool for the job.

---

## Search  ·  `l2m4.mp3`
*Concept: linear search and binary search*

Sorting was about putting things in order. Searching is about finding one thing among many. Start with the simplest way — linear search. Walk along the row, one bar at a time, checking each: is this the one? — until you land on your target and pick it up. It always works, but on a long row it can take a great many checks. Now here is the magic, and it only works on a row that is already sorted: binary search. Instead of starting at the end, jump straight to the middle, and ask one question — is my target higher or lower than this? If it is higher, the whole left half cannot contain it, so throw it away. If it is lower, throw away the right. Then jump to the middle of what is left, and halve it again. Each guess wipes out half the row. Watch the checks counter: where linear search creeps up bar by bar, binary search finds the answer in just a handful of jumps. That is why sorted data is so valuable — it lets you search by halving.

---

## The Race  ·  `l2m5.mp3`
*Concept: complexity — comparing algorithms*

You now know several ways to do the same job, and they all work — but working is not the whole story. This lesson asks a sharper question: which one is better, and how would you even know? The answer is to count the work. Solve a puzzle, and the dojo shows how many steps your method took, against a rival's. Then it grows the problem bigger and bigger, and you watch the gap open up. A linear search of a long row takes one check per item; a binary search takes a handful, no matter how long the row gets. That is the difference between getting slower in step with the data, and barely getting slower at all. Programmers have a name for this — complexity — and it is the reason the right algorithm can finish in a blink while the wrong one grinds for an age. And the best part: line the algorithms up and race them side by side, running together, and simply watch which one crosses the line first. Seeing it beats being told it.

---

## Challenge  ·  `l2m6.mp3`
*Concept: choosing the right sort for the data*

No demonstrations this time. This is where you find out whether you really understand what you have learned. You will be given a row to sort, all the sorting blocks you know, and a tight budget — a limit on how many moves you are allowed. The catch is that there is no single right answer: the best sort depends on the row in front of you. When the bars are almost in order, an adaptive sort like insertion barely has to move, and sails under the budget — while selection, doing its full scan every pass, runs over. But hand you a row that is completely backwards, and it flips: the adaptive sorts now do their very worst work, while steady selection comes in under the limit. So look hard at the data before you choose. Read its shape, remember how each sort behaves, and pick the one that fits. This is the real skill — not knowing the algorithms, but knowing when to use which. Take your time, and think before you build.

---

# Lesson Three — Structures & Graphs

## Stack  ·  `l3m1.mp3`
*Concept: last in, first out — a stack reverses*

A new world again — this time about how you hold your data while you work. Picture a stack of plates. You add a plate to the top, and when you need one, you take it off the top. The last plate you put on is the first one you take off. That is a stack, and it has a useful magic: it reverses things. Watch. Feed a row of tokens in, pushing each one onto the stack. Now pop them off, one by one. Because the last in comes off first, they come out in the opposite order to how they went in — reversed, for free. Push them all on; pop them all off; the row is flipped. Programmers call this last in, first out, and it is everywhere — the Undo button in every app you use is a stack of your actions, handing back the most recent one first. A simple idea, with surprising power.

---

## Queue  ·  `l3m2.mp3`
*Concept: first in, first out — a queue preserves order*

Now meet the stack's opposite. Picture a queue at a shop, or a conveyor belt. You join at the back, and you are served from the front — so the first to arrive is the first to leave. That is a queue: first in, first out. Use the very same shape of program as before, but with a queue instead of a stack, and something different happens. Feed the tokens in, adding each to the back. Take them out from the front, one by one. Because the first in comes out first, the order is kept exactly as it was — no reversing this time. Where a stack flips a row, a queue preserves it. That is the whole difference between the two, and it is not a small one: choosing a stack or a queue decides whether your data comes back forwards or backwards. And, as you are about to see, it can even decide which algorithm you are running.

---

## Breadth-First  ·  `l3m3.mp3`
*Concept: a queue spreads the search ring by ring*

Time to put your queue to work on something real. Here is a graph — rooms joined by corridors — and your job is to light up every room, starting from one. Keep a list of rooms waiting to be visited; that list is called the frontier. The rule is the same each time: take a room from the frontier, light it, then add its new neighbours to the back of the list. The question is which room you take next — and here you take the one that has been waiting longest, the one at the front. That makes the search spread outward evenly, like ripples on a pond: first the rooms next to the start, then the rooms one step further, then further still. This is breadth-first search, and it is exactly the flood you met back in Lesson One, when you found the shortest path. Because it always reaches the near rooms before the far ones, it is the method that finds shortest routes. A queue at the heart of it, spreading ring by ring.

---

## Depth-First  ·  `l3m4.mp3`
*Concept: swap the queue for a stack and the algorithm changes*

Same graph, same rule — take a room, light it, add its neighbours — but change one thing, and you change the whole algorithm. This time, when you choose which room to visit next, take the newest one you added, not the oldest. Take from the top, like a stack. Watch what happens: instead of spreading out evenly, the search plunges straight down one corridor, as deep as it can go, only backing up when it hits a dead end. That is depth-first search. The astonishing part is how little you changed. Breadth-first and depth-first explore the very same rooms; the only difference is whether your frontier behaves like a queue or a stack — whether you take the oldest waiting room or the newest. Swap that one choice, and a gentle ripple becomes a deep dive. The structure you pick is the algorithm you get. Sit with that idea — it is one of the most elegant in all of computing.

---

## Challenge  ·  `l3m5.mp3`
*Concept: choose the structure; deduce the algorithm from the order*

No demonstrations, and no labels — just you and the problem. First, you will be handed both a stack and a queue, and a target. You have to decide for yourself: do you want the row reversed, or kept in order? Reversed means last in, first out — that is the stack, so pop from the back. Same order means first in, first out — that is the queue, so take from the front. Choose wrongly, and the output will not match. Then comes the harder one. You are shown a graph and the exact order its rooms must be visited in — but nobody tells you whether that is breadth-first or depth-first. You have to read it. Does it fan out to the nearest rooms first, or dive down one path before coming back? Spot the pattern, name the algorithm in your head, and pick the block that produces it — take from the front, or take from the top. This is the whole point of everything you have learned: not just knowing how each tool works, but recognising, from the shape of a problem, which tool it is asking for.

---

### Production notes
- One voice throughout; calm, friendly, slightly-slow delivery suits the dyslexia-friendly design.
- Pause clearly at full stops — listeners are watching the screen at the same time.
- Export MP3 (mono is fine), name by the table above (`l2m1` … `l2m6`, then `l3m1` … `l3m5`), put them in `dojo-audio/` beside the app, commit, done.
- ElevenLabs: pick one voice, high stability (~0.6–0.75), and keep it identical across every clip — including the Lesson One set — for consistency.
