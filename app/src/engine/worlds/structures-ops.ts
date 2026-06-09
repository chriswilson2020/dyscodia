/**
 * engine/worlds/structures-ops — the Structures world as WorldOps, so the shared
 * interpreter drives it.
 *
 *   stack  leaves: push / pop          condition: ifmore
 *   queue  leaves: enqueue / dequeue   condition: ifmore
 *
 * push & enqueue both take the next input token into the structure; the
 * difference is removal — pop takes the LAST in (stack), dequeue the FIRST in
 * (queue). Win = the output tray matches the target sequence.
 */
import { type StructWorld, type StructState, type StructFrame, seqEq } from './structures';
import type { Outcome } from '../../program-model/types';
import type { WorldOps, Emit } from '../../interpreter/run';

export function structOps(w: StructWorld): WorldOps<StructState, StructFrame> {
  const done = (s: StructState): Outcome | null =>
    seqEq(s.output, w.want) ? { win: true, moves: s.ops } : null;

  return {
    init: () => ({ input: w.seq.slice(), store: [], output: [], ops: 0 }),

    snapshot: (s, id, ev): StructFrame => ({
      input: [...s.input], store: [...s.store], output: [...s.output], ops: s.ops, id, ev,
    }),

    predicate: (s, type): boolean => (type === 'ifmore' ? s.input.length > 0 : false),

    action: (s, type, id, emit: Emit): Outcome | null => {
      switch (type) {
        case 'push':
        case 'enqueue':
          if (s.input.length) { s.store.push(s.input.shift() as number); s.ops++; }
          emit(id, type === 'push' ? 'push' : 'enq'); return null;
        case 'pop':
          if (s.store.length) { s.output.push(s.store.pop() as number); s.ops++; }
          emit(id, 'pop'); return done(s);
        case 'dequeue':
          if (s.store.length) { s.output.push(s.store.shift() as number); s.ops++; }
          emit(id, 'deq'); return done(s);
        default:
          return null;
      }
    },

    wonAtEnd: (s) => seqEq(s.output, w.want),
    effort: (s) => s.ops,
  };
}
