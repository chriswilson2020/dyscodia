/**
 * engine/worlds/graph — a node-and-edge graph traversed with a frontier
 * structure. This is the synthesis world: the QUEUE you built drives a
 * breadth-first flood (visiting in rings), the STACK drives depth-first
 * (plunging deep). Same graph, opposite structure, visibly different order —
 * closing the loop back to Lesson One's pathfinding.
 *
 * The learner runs: Repeat [ If frontier → Take a node · Expand its neighbours ].
 * DOM-free except the canvas renderer; plugs into the shared interpreter via
 * graph-ops.
 */
import type { LevelDef } from '../../content/types';
import type { FrameBase } from '../../program-model/types';

export interface GraphWorld {
  def: LevelDef;
  nodes: Array<[number, number]>;
  adj: number[][];
  start: number;
  struct: 'queue' | 'stack';
  n: number;
  /** The visit order the learner must reproduce (breadth- or depth-first). */
  target: number[];
  kind: 'graph';
}

/**
 * Canonical traversal order. 'front' removes the oldest frontier node (queue →
 * breadth-first); 'top' removes the newest (stack → depth-first). Expand always
 * appends unvisited neighbours, so the only difference is which end we take from.
 */
export function canonicalOrder(adj: number[][], start: number, mode: 'front' | 'top'): number[] {
  const visited = Array<boolean>(adj.length).fill(false);
  visited[start] = true;
  const frontier = [start];
  const order: number[] = [];
  while (frontier.length) {
    const cur = mode === 'front' ? (frontier.shift() as number) : (frontier.pop() as number);
    order.push(cur);
    for (const nb of adj[cur]) if (!visited[nb]) { visited[nb] = true; frontier.push(nb); }
  }
  return order;
}

export interface GraphState {
  frontier: number[];
  visited: boolean[];
  order: number[];   // visitation order (the output)
  cur: number;       // last taken node, or -1
  ops: number;
}

export interface GraphFrame extends FrameBase {
  frontier: number[];
  visited: boolean[];
  order: number[];
  cur: number;
  ops: number;
}

export function parseGraph(def: LevelDef): GraphWorld {
  const nodes = (def.nodes || []).map((p) => [p[0], p[1]] as [number, number]);
  const n = nodes.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  (def.edges || []).forEach(([a, b]) => {
    if (adj[a].indexOf(b) < 0) adj[a].push(b);
    if (adj[b].indexOf(a) < 0) adj[b].push(a);
  });
  const start = def.startNode != null ? def.startNode : 0;
  const struct = def.struct === 'stack' ? 'stack' : 'queue';
  const target = canonicalOrder(adj, start, struct === 'queue' ? 'front' : 'top');
  return { def, nodes, adj, n, start, struct, target, kind: 'graph' };
}

export function graphInitialFrame(w: GraphWorld): GraphFrame {
  const visited = Array<boolean>(w.n).fill(false);
  visited[w.start] = true;
  return { frontier: [w.start], visited, order: [], cur: -1, ops: 0, id: null, ev: 'start' };
}

// ---- canvas rendering -----------------------------------------------------

type Ctx = CanvasRenderingContext2D;
const PAD = 34, BOARD_W = 460, BOARD_H = 340, R = 21;

function bounds(w: GraphWorld) {
  const xs = w.nodes.map((p) => p[0]), ys = w.nodes.map((p) => p[1]);
  return { minx: Math.min(...xs), maxx: Math.max(...xs), miny: Math.min(...ys), maxy: Math.max(...ys) };
}
function place(w: GraphWorld, i: number): [number, number] {
  const b = bounds(w);
  const sx = (BOARD_W - PAD * 2) / Math.max(1, b.maxx - b.minx);
  const sy = (BOARD_H - PAD * 2 - 36) / Math.max(1, b.maxy - b.miny);
  return [PAD + (w.nodes[i][0] - b.minx) * sx, PAD + (w.nodes[i][1] - b.miny) * sy];
}

export function fitGraphCanvas(canvas: HTMLCanvasElement, _w: GraphWorld): void {
  canvas.width = BOARD_W; canvas.height = BOARD_H;
}

export function drawGraphFrame(ctx: Ctx, w: GraphWorld, f: GraphFrame): void {
  ctx.clearRect(0, 0, BOARD_W, BOARD_H);
  // edges
  ctx.strokeStyle = '#cdbf9f'; ctx.lineWidth = 3;
  for (let a = 0; a < w.n; a++) for (const b of w.adj[a]) if (a < b) {
    const pa = place(w, a), pb = place(w, b);
    ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
  }
  // nodes
  const orderIdx = (i: number) => f.order.indexOf(i);
  for (let i = 0; i < w.n; i++) {
    const [x, y] = place(w, i);
    const inFrontier = f.frontier.indexOf(i) >= 0;
    const taken = orderIdx(i) >= 0;
    let fill = '#efe3c8';
    if (taken) fill = '#1f9b8a';
    else if (inFrontier) fill = '#f4c542';
    else if (f.visited[i]) fill = '#cfe8df';
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = (i === f.cur) ? 5 : 2;
    ctx.strokeStyle = (i === f.cur) ? '#e0671e' : '#b6a880';
    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.stroke();
    // label: visit order number once taken, else node id
    ctx.fillStyle = taken ? '#fff' : '#5b566b';
    ctx.font = '700 16px Lexend, system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(taken ? String(orderIdx(i) + 1) : String.fromCharCode(65 + i), x, y + 1);
  }
  // Frontier readout, with the end each Take block removes from made explicit.
  // (No goal label — that would give away the answer in the Mystery challenge.)
  ctx.fillStyle = '#5b566b';
  ctx.font = '700 12px Lexend, system-ui, sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  const names = f.frontier.map((i) => String.fromCharCode(65 + i)).join(' ');
  ctx.fillText('Take Front ◂  ' + (names || '—') + '  ▸ Take Top', 10, BOARD_H - 12);
}
