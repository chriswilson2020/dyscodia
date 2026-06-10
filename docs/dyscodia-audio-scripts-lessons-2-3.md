# Dyscodia — Lesson Audio Scripts (Lessons Two & Three)

These are stories, not instructions. The screen shows the *how*; the voice gives the *why* and
the wonder. Read like a favourite teacher reading aloud — unhurried, warm, leaving little
silences after the big ideas so they have room to land. Short sentences on purpose: easy to
follow, easy to picture. Never rush the last line of a script — that's the one that sticks.

**Filenames are codified by position:** `l<lesson>m<module>` — Lesson Two, module three
(Insertion Sort) is `l2m3.mp3`.

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
*Hook: order appearing from one tiny rule*

Look at this row of bars. All jumbled up. We want to line them up, shortest to tallest.

Now, you could try to plan the whole thing in your head at once. But here is something lovely: you don't have to. You only ever look at two bars side by side. If the left one is taller, you swap them. That's the whole rule. One tiny, almost silly rule.

So how does the *whole* row end up sorted? Watch what happens. With every sweep, the tallest bar drifts along to the end, like a bubble rising up through water. Then the next tallest. Then the next.

Nobody is in charge of the big picture. The bars don't even know they're being sorted — they just keep swapping. And somehow, that's enough.

That's the first secret of computing, and it's a strange and beautiful one: a big, messy problem can melt away under one small rule, done again, and again, and again.

---

## Selection Sort  ·  `l2m2.mp3`
*Hook: patience — find the best, then commit*

Here's a completely different way of thinking. Not a fidget this time. A hunter.

Picture a punnet of strawberries. You don't grab the first one you touch. Your eyes run along the whole lot, looking for the ripest — and *only then* do you pick it. Then you do it again with the ones that are left.

Selection sort thinks exactly like that. It looks all the way along the row, holding just one thing in its memory: the smallest bar it has seen so far. It doesn't move anything yet. It just... remembers. And when it reaches the end, it *knows*, for certain, which bar is smallest. So it places that one, gently, right where it belongs.

Bubble sort was busy — swapping, swapping, swapping. This one is calm. It looks a great deal, and it moves almost not at all.

Two ways to reach the very same tidy row. One restless, one patient. You're already learning something deep here: a problem never has just one solution. Solutions have personalities.

---

## Insertion Sort  ·  `l2m3.mp3`
*Hook: you already know how to do this*

You have done this before. I promise you have. Have you ever picked up a hand of cards and put them in order?

You take each new card and slide it leftwards, past the bigger ones, until it drops into just the right gap. You don't think about it. Your hands simply know.

Well — that is insertion sort. That ordinary thing you do at the kitchen table is a real algorithm, one that computers lean on every day. You have been doing computer science your whole life, and nobody ever told you.

And here's its quiet cleverness. When the cards are already nearly in order, it barely lifts a finger — each one is almost home. Give it tidy data, and it flies.

Hold on to that feeling. Because very soon, you'll have to *choose* which method to trust — and knowing that some are lazy in exactly the right way... that's the kind of thing that wins.

---

## Search  ·  `l2m4.mp3`
*Hook: the leap from plodding to clever*

Now forget sorting for a moment. Here's a brand-new question, and it's one you face every single day: how do you find one thing, hidden among many?

The plain way is to check everything, one by one, until you spot it. It always works. But imagine a thick phone book, and finding a name by reading every line from the very top. You'd be there till bedtime.

So here is the trick that changes everything — and it only works when things are in order. Don't start at the edge. Jump to the *middle*. And ask one question: is the one I want higher, or lower? Whatever the answer — half the row just vanishes. It can't be hiding there, so you throw it away. Then you do it again. Halve it. Halve it. Halve it.

It's the guess-the-number game. I'm thinking of a number between one and a *million*... and you can find it in about twenty guesses. Twenty.

That isn't searching faster. That's searching *cleverer*. And once you've felt that, you will never look at a sorted list the same way again.

---

## The Race  ·  `l2m5.mp3`
*Hook: they all work — so does it matter?*

Every method you've learned reaches the right answer. So who cares which one you pick? Why not just grab any of them?

Here's who cares. Imagine ten things to sort. They'd all finish in a blink — no difference worth a thought. But the real world doesn't have ten things. It has millions. And at a million, the gap between a clever method and a clumsy one isn't a few seconds. It's the difference between *done before you blink*, and *still running this time tomorrow*.

So let's stop arguing about it and race them. Same data, side by side, step for step. Watch one sail across the line while the other is barely warming up. Then make the problem bigger — and watch that gap yawn wide open.

There's a name for this. Complexity. It's the reason your phone answers in an instant instead of grinding away for an hour. The right idea doesn't just win — it wins by *more and more*, the harder the problem gets.

That might be the most powerful thing in all of computing. And you don't have to take my word for it. You get to watch it happen.

---

## Challenge  ·  `l2m6.mp3`
*Hook: now you're the one who decides*

No demonstrations now. No one telling you what to do. This part is just you.

I'm going to hand you a row, every tool you've learned, and one hard limit — only so many moves allowed. And here's the twist that makes it real: there is no single right answer. There can't be. It depends entirely on the row in front of you.

When the bars are nearly sorted, the gentle, lazy methods barely stir, and they breeze under the limit — while the patient hunter wastes its time scanning everything. But turn that row completely backwards, and it all flips over: now the lazy ones thrash about and overspend, and steady, unbothered selection strolls home well within the limit.

So look. *Really* look at what you've been given. Feel its shape.

This is the leap — from following instructions, to thinking like an engineer. Not knowing how the tools work, but knowing, at a glance, which one this moment is *asking* for. That judgement is the whole game. Take your time. Trust your eye.

---

# Lesson Three — Structures & Graphs

## Stack  ·  `l3m1.mp3`
*Hook: the everyday magic of Undo*

Picture a tall stack of plates. You add to the top. You take from the top. So the plate you put down *last* is the very first one you'll pick up again.

Simple, isn't it? But hidden inside that is a kind of magic. Feed things in, one after another — then take them all back out — and they come out *backwards*. The order flips, all by itself, for free.

And you already trust your whole life to this. Every time you press Undo — in a drawing, in a sentence you're writing — the computer reaches into a stack and hands you back the very last thing you did. Press it again, and there's the one before that. Last in, first out.

Such a small idea. A pile of plates. And yet it's quietly holding up half the software you have ever touched.

The best ideas in computing are often like this — almost too simple to seem important. And almost always, they turn out to be the important ones.

---

## Queue  ·  `l3m2.mp3`
*Hook: the stack's opposite — and you've stood in it*

Now meet the stack's complete opposite — and you've stood inside it a hundred times. A queue.

At the ice-cream van, who gets served first? Whoever got there first. You join at the back, you wait your turn, you leave from the front. First in, first out. Fair.

Watch what that does. Feed things into a queue, take them out again — and this time the order is kept, perfectly. No flipping. Where a stack *reverses*, a queue *remembers*.

Same simple shape — add at one end, take from the other — but a completely different soul.

And here's the thing I really want you to hold on to, because it's about to matter enormously. The *only* difference between a stack and a queue is which end you take from. The front, or the back. One tiny choice.

Remember that. Because in just a moment, that single choice is going to decide which famous algorithm you're running — and you won't quite believe how much rides on it.

---

## Breadth-First  ·  `l3m3.mp3`
*Hook: ripples on a pond*

Drop a stone into a still pond. Watch the ripples. They touch the nearest water first, then a little further out, then further still — a perfect, spreading circle.

That's this whole lesson. You've got a map of rooms joined by corridors, and you want to light up every one, starting from where you're standing. Keep a little waiting-list of rooms to visit — and always take the one that has been waiting *longest*. The oldest first.

And what you get is exactly those ripples. The rooms right beside you, then the rooms one step beyond, then two — spreading outward, evenly, never racing ahead of itself.

You've met this before; you just didn't know its name. It's the flood from Lesson One — the one that found the shortest path. And it is no toy. This is what happens, right now, when your maps app finds your quickest way home: it floods out from you, ring by ring, until it reaches where you're going.

The nearest reached first. That's *why* it always finds the shortest way. A stone in a pond, doing real work.

---

## Depth-First  ·  `l3m4.mp3`
*Hook: one tiny change, a whole new algorithm*

Same map. Same rule — light a room, then add its neighbours to your list. But change one single thing, and something extraordinary happens.

This time, when you choose which room to visit next, take the *newest* one you found. Not the oldest. The newest.

And suddenly you're not spreading out at all. You're an explorer who picks one tunnel and follows it down, and down, as far as it will go — only ever turning back when you hit a dead end. Then you try the next. Think of Theseus deep in the labyrinth, unspooling his thread, pressing on into the dark.

Now here is the part to sit very still for. To turn that gentle, spreading ripple into this headlong dive... you changed almost nothing. You didn't rewrite the rule. You just took from the *other end* of your list.

Oldest, and it ripples outward. Newest, and it dives down. The structure you reach for *is* the algorithm you become.

That quiet, enormous idea is one of the most beautiful things you will ever meet in all of computing. Let it land.

---

## Challenge  ·  `l3m5.mp3`
*Hook: read the trail like a detective*

Last one. And this time, you're the detective.

First I'll give you both tools — the stack and the queue — and a result I'm after. Reversed, or kept in order? You already know in your bones which is which. Choose wrong, and it won't match. So choose well.

Then comes the real puzzle. I'll show you a graph, and the exact order its rooms were visited in — but I will *not* tell you how it was done. You have to read the trail yourself. Did it fan out, gently, nearest-first? Or did it plunge down one path and disappear into the deep?

Spot it. Name it, quietly, in your own head. Then pick the block that would have left those footprints.

This is everything you've learned, folded into a single moment. Not reciting how a tool works — *recognising*, from the shape of a problem, which tool was here.

That's not following anymore. That's understanding. And understanding is the one thing nobody can ever take away from you.

---

### Production notes
- One warm, unhurried voice throughout — a storyteller, not a narrator. The same voice across all of Lessons One to Three.
- Leave a real beat of silence after the big reveals and before each final line. Those pauses are where the thinking happens.
- Short sentences are deliberate — they're kinder to listeners who are also watching the screen, and to dyslexic and neurodivergent learners especially. Don't smooth them into long ones.
- Export MP3 (mono is fine), name by the table above (`l2m1` … `l2m6`, then `l3m1` … `l3m5`), drop in `dojo-audio/` beside the app.
- ElevenLabs: one voice, high stability (~0.6–0.75), kept identical across every clip. A slightly slower rate suits these.
