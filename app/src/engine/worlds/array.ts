/**
 * engine/worlds/array — the Array world: a row of bars and a comparator "lens"
 * the learner drives with blocks. It teaches, entirely visually:
 *   - sorting  (bubble): Swap / Next / Rewind, condition "is the left taller?"
 *   - linear search:     Next / Pick, condition "is this the one?" — scan and grab
 *   - binary search:     Go left / Go right / Pick on a SORTED row — the range
 *                        halves each step and the discarded half greys out
 *
 * A visible "checks" counter lets the learner watch linear take ~n steps where
 * binary takes ~log2(n). No numbers-as-code, no syntax — you watch the bars.
 *
 * DOM-free except the canvas renderer; plugs into the shared interpreter via
 * array-ops.
 */
import type { LevelDef } from '../../content/types';
import type { FrameBase } from '../../program-model/types';

export type ArrayGoal = 'sort' | 'find' | 'search';

export interface ArrayWorld {
  def: LevelDef;
  bars: number[];
  n: number;
  goal: ArrayGoal;
  target: number;
  kind: 'array';
}

export interface ArrayState {
  arr: number[];
  /** Active pointer: comparator-left (sort), scan cursor (find), or mid (search). */
  i: number;
  /** Search range (binary search); full row otherwise. */
  lo: number;
  hi: number;
  /** Remembered "smallest so far" index (selection sort). */
  mark: number;
  /** Sorted-region boundary: indices < b are placed (selection sort). */
  b: number;
  /** "Checks" / moves counter. */
  ops: number;
}

export interface ArrayFrame extends FrameBase {
  arr: number[];
  i: number;
  lo: number;
  hi: number;
  mark: number;
  b: number;
  ops: number;
}

export const midOf = (lo: number, hi: number): number => Math.floor((lo + hi) / 2);

export function parseArray(def: LevelDef): ArrayWorld {
  const bars = (def.bars || []).slice();
  return {
    def, bars, n: bars.length,
    goal: def.goal || 'sort',
    target: def.target != null ? def.target : -1,
    kind: 'array',
  };
}

export function isSorted(a: number[]): boolean {
  for (let k = 0; k < a.length - 1; k++) if (a[k] > a[k + 1]) return false;
  return true;
}

/** Where the active pointer starts for each goal. */
export function startState(w: ArrayWorld): ArrayState {
  const n = w.n;
  if (w.goal === 'search') { const lo = 0, hi = n - 1; return { arr: w.bars.slice(), i: midOf(lo, hi), lo, hi, mark: 0, b: 0, ops: 0 }; }
  return { arr: w.bars.slice(), i: 0, lo: 0, hi: n - 1, mark: 0, b: 0, ops: 0 };
}

// ---- canvas rendering -----------------------------------------------------

type Ctx = CanvasRenderingContext2D;
const BAR_W = 50, GAP = 12, PAD = 18, BOARD_H = 320, BASE = 40;

export function fitArrayCanvas(canvas: HTMLCanvasElement, w: ArrayWorld): void {
  canvas.width = PAD * 2 + w.n * BAR_W + (w.n - 1) * GAP;
  canvas.height = BOARD_H;
}

function rr(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawArrayFrame(ctx: Ctx, w: ArrayWorld, f: ArrayFrame): void {
  const W = PAD * 2 + w.n * BAR_W + (w.n - 1) * GAP;
  ctx.clearRect(0, 0, W, BOARD_H);
  const maxv = Math.max(1, ...w.bars);
  const baseY = BOARD_H - BASE;
  const searching = w.goal === 'search';
  const palette = w.def.palette || [];
  const usesMark = palette.indexOf('mark') >= 0;     // selection sort
  const usesPlace = palette.indexOf('place') >= 0;   // selection sort sorted-region
  // A 2-wide comparator (Swap/Next neighbours) only when 'swap' is in play.
  const wideLens = w.goal === 'sort' && palette.indexOf('swap') >= 0;
  for (let k = 0; k < f.arr.length; k++) {
    const v = f.arr[k];
    const bh = (v / maxv) * (BOARD_H - 90);
    const x = PAD + k * (BAR_W + GAP), y = baseY - bh;
    const discarded = searching && (k < f.lo || k > f.hi);
    const isTarget = (w.goal === 'find' || searching) && v === w.target;
    let fill = isTarget ? '#3aa05a' : '#1f9b8a';
    if (usesPlace && k < f.b) fill = '#79c39a';
    if (f.ev === 'swap' && (k === f.i || k === f.i + 1)) fill = '#e08a1e';
    if (f.ev === 'pick' && k === f.i) fill = '#3aa05a';
    if (discarded) fill = '#ccc2a8';
    ctx.fillStyle = fill;
    rr(ctx, x, y, BAR_W, bh, 8); ctx.fill();
    ctx.fillStyle = discarded ? '#9a8f74' : '#2c2a3a';
    ctx.font = '700 18px Lexend, system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(String(v), x + BAR_W / 2, y - 5);
  }
  // remembered "smallest so far" marker (selection sort)
  if (usesMark && f.mark >= 0 && f.mark < f.arr.length) {
    const mx = PAD + f.mark * (BAR_W + GAP) + BAR_W / 2;
    ctx.fillStyle = '#d8587a';
    ctx.beginPath();
    ctx.moveTo(mx - 9, 8); ctx.lineTo(mx + 9, 8); ctx.lineTo(mx, 22);
    ctx.closePath(); ctx.fill();
  }
  // comparator / scan / mid lens
  if (f.i >= 0) {
    const span = wideLens ? 2 : 1;
    const lx = PAD + f.i * (BAR_W + GAP) - 7;
    const lw = BAR_W * span + GAP * (span - 1) + 14;
    ctx.strokeStyle = '#f4c542'; ctx.lineWidth = 4;
    rr(ctx, lx, 26, lw, BOARD_H - 44, 11); ctx.stroke();
  }
}

export function arrayInitialFrame(w: ArrayWorld): ArrayFrame {
  const s = startState(w);
  return { arr: s.arr, i: s.i, lo: s.lo, hi: s.hi, mark: s.mark, b: s.b, ops: 0, id: null, ev: 'start' };
}
