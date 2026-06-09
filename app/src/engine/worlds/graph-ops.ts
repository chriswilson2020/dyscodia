/**
 * engine/worlds/graph-ops — the Graph world as WorldOps. The frontier is a
 * stack or a queue (from the level); that single choice is the whole difference
 * between depth-first and breadth-first.
 *
 *   leaves:    take (remove next frontier node, visit it)
 *              expand (add the current node's unvisited neighbours to the frontier)
 *   condition: iffrontier (anything left to explore?)
 *
 * Win = every node has been visited (the order list is complete).
 */
import { type GraphWorld, type GraphState, type GraphFrame } from './graph';
import type { Outcome } from '../../program-model/types';
import type { WorldOps, Emit } from '../../interpreter/run';

const eq = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i]);

export function graphOps(w: GraphWorld): WorldOps<GraphState, GraphFrame> {
  // Won only when the FULL visit order matches the target — so taking from the
  // wrong end (depth-first when breadth-first is wanted, or vice versa) fails.
  const done = (s: GraphState): Outcome | null =>
    s.order.length === w.n && eq(s.order, w.target) ? { win: true, moves: s.ops } : null;

  return {
    init: () => {
      const visited = Array<boolean>(w.n).fill(false);
      visited[w.start] = true;
      return { frontier: [w.start], visited, order: [], cur: -1, ops: 0 };
    },

    snapshot: (s, id, ev): GraphFrame => ({
      frontier: [...s.frontier], visited: [...s.visited], order: [...s.order], cur: s.cur, ops: s.ops, id, ev,
    }),

    predicate: (s, type): boolean => (type === 'iffrontier' ? s.frontier.length > 0 : false),

    action: (s, type, id, emit: Emit): Outcome | null => {
      if (type === 'takeFront' || type === 'takeTop') {
        if (s.frontier.length) {
          s.cur = type === 'takeFront' ? (s.frontier.shift() as number) : (s.frontier.pop() as number);
          s.order.push(s.cur); s.ops++;
        }
        emit(id, 'take'); return done(s);
      }
      if (type === 'expand') {
        if (s.cur >= 0) {
          for (const nb of w.adj[s.cur]) {
            if (!s.visited[nb]) { s.visited[nb] = true; s.frontier.push(nb); s.ops++; }
          }
        }
        emit(id, 'expand'); return done(s);
      }
      return null;
    },

    wonAtEnd: (s) => eq(s.order, w.target),
    effort: (s) => s.ops,
  };
}
