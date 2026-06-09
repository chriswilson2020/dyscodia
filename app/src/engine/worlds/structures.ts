/**
 * engine/worlds/structures — the Structures world: a STACK (plates, last-in
 * first-out) and a QUEUE (conveyor belt, first-in first-out). Tokens flow from
 * an input row, through the structure, into an output tray. You feel the
 * difference: a stack reverses a row; a queue keeps its order. Later this is the
 * world that shows a queue powering breadth-first search and a stack powering
 * depth-first.
 *
 * DOM-free except the canvas renderer; plugs into the shared interpreter via
 * structures-ops.
 */
import type { LevelDef } from '../../content/types';
import type { FrameBase } from '../../program-model/types';

export interface StructWorld {
  def: LevelDef;
  seq: number[];
  want: number[];
  struct: 'stack' | 'queue';
  kind: 'structures';
}

export interface StructState {
  input: number[];
  store: number[];   // the stack/queue contents (stack top / queue back = end)
  output: number[];
  ops: number;
}

export interface StructFrame extends FrameBase {
  input: number[];
  store: number[];
  output: number[];
  ops: number;
}

export function parseStruct(def: LevelDef): StructWorld {
  return {
    def,
    seq: (def.seq || []).slice(),
    want: (def.want || []).slice(),
    struct: def.struct || 'stack',
    kind: 'structures',
  };
}

export function seqEq(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function structInitialFrame(w: StructWorld): StructFrame {
  return { input: w.seq.slice(), store: [], output: [], ops: 0, id: null, ev: 'start' };
}

// ---- canvas rendering -----------------------------------------------------

type Ctx = CanvasRenderingContext2D;
const TOK = 40, GAP = 6, PAD = 14, BOARD_H = 300;
const COLORS = ['#1f9b8a', '#e08a1e', '#d8587a', '#7b5bd6', '#3aa05a', '#2f7fb0', '#e0671e', '#6a4cc4'];
const colorOf = (v: number) => COLORS[((v % COLORS.length) + COLORS.length) % COLORS.length];

export function fitStructCanvas(canvas: HTMLCanvasElement, _w: StructWorld): void {
  canvas.width = 540;
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

function token(ctx: Ctx, x: number, y: number, v: number, ghost?: boolean): void {
  ctx.globalAlpha = ghost ? 0.28 : 1;
  ctx.fillStyle = ghost ? '#b9ad8e' : colorOf(v);
  rr(ctx, x, y, TOK, TOK, 7); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '700 19px Lexend, system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(v), x + TOK / 2, y + TOK / 2 + 1);
  ctx.globalAlpha = 1;
}

function caption(ctx: Ctx, x: number, y: number, t: string): void {
  ctx.fillStyle = '#5b566b';
  ctx.font = '700 12px Lexend, system-ui, sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(t, x, y);
}

export function drawStructFrame(ctx: Ctx, w: StructWorld, f: StructFrame): void {
  const W = 540;
  ctx.clearRect(0, 0, W, BOARD_H);

  // input row (top)
  caption(ctx, PAD, 20, 'IN');
  f.input.forEach((v, i) => token(ctx, PAD + 30 + i * (TOK + GAP), 4, v));

  // structure (middle)
  const isStack = w.struct === 'stack';
  caption(ctx, PAD, 118, isStack ? 'STACK (last in, first out)' : 'QUEUE (first in, first out)');
  if (isStack) {
    const baseY = 250;
    f.store.forEach((v, j) => token(ctx, PAD + 40, baseY - (j + 1) * (TOK + 4), v));
    ctx.strokeStyle = '#d9cdb4'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(PAD + 34, 130); ctx.lineTo(PAD + 34, baseY + 6); ctx.lineTo(PAD + 40 + TOK + 6, baseY + 6); ctx.lineTo(PAD + 40 + TOK + 6, 130); ctx.stroke();
  } else {
    const y = 132;
    ctx.strokeStyle = '#d9cdb4'; ctx.lineWidth = 2;
    rr(ctx, PAD + 30, y - 4, W - PAD * 2 - 30, TOK + 8, 8); ctx.stroke();
    f.store.forEach((v, j) => token(ctx, PAD + 36 + j * (TOK + GAP), y, v));
  }

  // output tray (bottom) with ghost target
  caption(ctx, PAD, BOARD_H - 52, 'OUT');
  const oy = BOARD_H - 46;
  for (let i = 0; i < w.want.length; i++) {
    const x = PAD + 36 + i * (TOK + GAP);
    if (i < f.output.length) token(ctx, x, oy, f.output[i]);
    else token(ctx, x, oy, w.want[i], true);
  }
}
