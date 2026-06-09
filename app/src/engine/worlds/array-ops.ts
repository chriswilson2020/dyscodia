/**
 * engine/worlds/array-ops — the Array world as WorldOps, so the shared
 * interpreter drives it.
 *
 *   bubble    leaves: swap / next / rewind             conditions: iftaller / ifend
 *   selection leaves: mark / place / next              conditions: ifshorter / ifend
 *   insertion leaves: swapLeft / stepLeft / next       conditions: iftallerleft
 *   linear    leaves: next / pick                      conditions: ifmatch
 *   binary    leaves: goLeft / goRight / pick          conditions: ifmatch / ifhigher / iflower
 *
 * Any sort move that leaves the row ordered wins. Search wins by PICKING the
 * target — a real decision; picking the wrong bar fails.
 */
import { type ArrayWorld, type ArrayState, type ArrayFrame, isSorted, midOf, startState } from './array';
import type { Outcome } from '../../program-model/types';
import type { WorldOps, Emit } from '../../interpreter/run';

export function arrayOps(w: ArrayWorld): WorldOps<ArrayState, ArrayFrame> {
  // A sort goal is won the moment the row is ordered — checked after every move.
  const doneSort = (s: ArrayState): Outcome | null =>
    w.goal === 'sort' && isSorted(s.arr) ? { win: true, moves: s.ops } : null;

  return {
    init: () => startState(w),

    snapshot: (s, id, ev): ArrayFrame => ({
      arr: [...s.arr], i: s.i, lo: s.lo, hi: s.hi, mark: s.mark, b: s.b, ops: s.ops, id, ev,
    }),

    predicate: (s, type): boolean => {
      const n = s.arr.length;
      switch (type) {
        case 'iftaller': return s.i >= 0 && s.i < n - 1 && s.arr[s.i] > s.arr[s.i + 1];
        case 'iftallerleft': return s.i >= 1 && s.arr[s.i - 1] > s.arr[s.i];
        case 'ifshorter': return s.i >= 0 && s.mark >= 0 && s.arr[s.i] < s.arr[s.mark];
        case 'ifend': return s.i >= n - 1;
        case 'ifmatch': return s.i >= 0 && s.arr[s.i] === w.target;
        case 'ifhigher': return s.i >= 0 && w.target > s.arr[s.i];
        case 'iflower': return s.i >= 0 && w.target < s.arr[s.i];
        default: return false;
      }
    },

    action: (s, type, id, emit: Emit): Outcome | null => {
      const n = s.arr.length;
      const swap = (a: number, b: number) => { const t = s.arr[a]; s.arr[a] = s.arr[b]; s.arr[b] = t; };
      switch (type) {
        // --- bubble ---
        case 'swap':
          if (s.i >= 0 && s.i < n - 1) { swap(s.i, s.i + 1); s.ops++; }
          emit(id, 'swap'); return doneSort(s);
        case 'rewind':
          s.i = 0; emit(id, 'rewind'); return doneSort(s);
        // --- shared scan ---
        case 'next':
          s.i = s.i < n - 1 ? s.i + 1 : s.i; s.ops++;
          emit(id, 'next'); return doneSort(s);
        // --- selection ---
        case 'mark':
          s.mark = s.i; emit(id, 'mark'); return doneSort(s);
        case 'place':
          if (s.b >= 0 && s.b < n && s.mark >= 0 && s.mark < n) { swap(s.b, s.mark); s.ops++; }
          s.b += 1; s.i = s.b; s.mark = s.b;
          emit(id, 'place'); return doneSort(s);
        // --- insertion (gnome) ---
        case 'swapLeft':
          if (s.i >= 1) { swap(s.i - 1, s.i); s.ops++; }
          emit(id, 'swap'); return doneSort(s);
        case 'stepLeft':
          s.i = s.i > 0 ? s.i - 1 : 0; s.ops++;
          emit(id, 'next'); return doneSort(s);
        // --- search ---
        case 'pick':
          s.ops++; emit(id, 'pick');
          return s.arr[s.i] === w.target ? { win: true, moves: s.ops } : { win: false, reason: 'wrong' };
        case 'goRight':
          s.lo = s.i + 1; s.i = midOf(s.lo, s.hi); s.ops++;
          emit(id, 'goright'); return s.lo > s.hi ? { win: false, reason: 'wrong' } : null;
        case 'goLeft':
          s.hi = s.i - 1; s.i = midOf(s.lo, s.hi); s.ops++;
          emit(id, 'goleft'); return s.lo > s.hi ? { win: false, reason: 'wrong' } : null;
        default:
          return null;
      }
    },

    wonAtEnd: (s) => w.goal === 'sort' && isSorted(s.arr),
    effort: (s) => s.ops,
  };
}
