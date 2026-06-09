/**
 * ui/parallel-race — a live, side-by-side race. Every algorithm runs on the SAME
 * input at once, in stacked lanes, stepping one operation per tick. You literally
 * watch one finish while another is still grinding — the fastest, most concrete
 * way to feel "which algorithm is better". The frames come from the real
 * interpreter (the same runs the learner builds), so the race is honest.
 */
import type { LevelDef } from '../content/types';
import { BUBBLE, SELECTION, INSERTION, LINEAR, BINARY } from '../content/array-levels';
import { parseArray, type ArrayFrame } from '../engine/worlds/array';
import { runArray } from '../interpreter/array';
import { buildProgram, type DemoSpec } from '../interpreter/dsl';

export interface RaceLane {
  name: string;
  goal: 'sort' | 'find' | 'search';
  color: string;
  frames: ArrayFrame[];
  target: number;
}

const RBAR = 22, RGAP = 6, RPAD = 12, LABEL_W = 96, LANE_H = 92, LANE_GAP = 12, TOP = 6;

function mkDef(bars: number[], goal: 'sort' | 'find' | 'search', target?: number): LevelDef {
  return { name: '', icon: '', title: '', text: '', par: null, palette: [], combo: false, world: 'array', bars, goal, target };
}

function laneFrames(bars: number[], goal: 'sort' | 'find' | 'search', spec: DemoSpec[], target: number): ArrayFrame[] {
  return runArray(buildProgram(spec), [], parseArray(mkDef(bars, goal, target))).frames;
}

export function buildLanes(def: LevelDef): RaceLane[] {
  const bars = def.bars || [];
  const target = def.target != null ? def.target : -1;
  if (def.race === 'parallelSearch') {
    return [
      { name: 'Linear', goal: 'find', color: '#d8587a', target, frames: laneFrames(bars, 'find', LINEAR as DemoSpec[], target) },
      { name: 'Binary', goal: 'search', color: '#1f9b8a', target, frames: laneFrames(bars, 'search', BINARY as DemoSpec[], target) },
    ];
  }
  return [
    { name: 'Bubble', goal: 'sort', color: '#7b5bd6', target, frames: laneFrames(bars, 'sort', BUBBLE as DemoSpec[], target) },
    { name: 'Selection', goal: 'sort', color: '#3aa05a', target, frames: laneFrames(bars, 'sort', SELECTION as DemoSpec[], target) },
    { name: 'Insertion', goal: 'sort', color: '#e0671e', target, frames: laneFrames(bars, 'sort', INSERTION as DemoSpec[], target) },
  ];
}

/** Lane that finishes in the fewest steps. */
export function raceWinner(lanes: RaceLane[]): string {
  return lanes.reduce((best, l) => (l.frames.length < best.frames.length ? l : best), lanes[0]).name;
}

export function fitRaceCanvas(canvas: HTMLCanvasElement, def: LevelDef, lanes: RaceLane[]): void {
  const n = (def.bars || []).length;
  canvas.width = LABEL_W + RPAD * 2 + n * RBAR + (n - 1) * RGAP;
  canvas.height = TOP + lanes.length * LANE_H + (lanes.length - 1) * LANE_GAP;
}

type Ctx = CanvasRenderingContext2D;

function rr(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Draw all lanes at the given tick. Returns whether every lane has finished. */
export function drawRace(ctx: Ctx, def: LevelDef, lanes: RaceLane[], tick: number): { allDone: boolean } {
  const bars = def.bars || [];
  const n = bars.length;
  const maxv = Math.max(1, ...bars);
  ctx.clearRect(0, 0, (ctx.canvas as HTMLCanvasElement).width, (ctx.canvas as HTMLCanvasElement).height);
  let allDone = true;

  lanes.forEach((lane, li) => {
    const y0 = TOP + li * (LANE_H + LANE_GAP);
    const fi = Math.min(tick, lane.frames.length - 1);
    const f = lane.frames[fi];
    const done = tick >= lane.frames.length - 1;
    if (!done) allDone = false;
    const baseY = y0 + LANE_H - 16;

    // label
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = lane.color;
    ctx.font = '700 15px Lexend, system-ui, sans-serif';
    ctx.fillText((done ? '🏁 ' : '') + lane.name, 6, y0 + 20);
    ctx.fillStyle = '#5b566b';
    ctx.font = '700 12px Lexend, system-ui, sans-serif';
    ctx.fillText('ops ' + f.ops, 6, y0 + 40);

    const searching = lane.goal === 'search';
    for (let k = 0; k < n; k++) {
      const v = f.arr[k];
      const bh = (v / maxv) * (LANE_H - 34);
      const x = LABEL_W + RPAD + k * (RBAR + RGAP), y = baseY - bh;
      const discarded = searching && (k < f.lo || k > f.hi);
      const isTarget = (lane.goal === 'find' || searching) && v === lane.target;
      let fill = isTarget ? '#3aa05a' : lane.color;
      if (f.ev === 'pick' && k === f.i) fill = '#3aa05a';
      if (discarded) fill = '#ccc2a8';
      ctx.fillStyle = done ? fill : fill;
      ctx.globalAlpha = done ? 1 : 0.92;
      rr(ctx, x, y, RBAR, bh, 4); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // lens
    if (f.i >= 0 && !done) {
      const span = lane.goal === 'sort' ? 2 : 1;
      const lx = LABEL_W + RPAD + f.i * (RBAR + RGAP) - 4;
      const lw = RBAR * span + RGAP * (span - 1) + 8;
      ctx.strokeStyle = '#f4c542'; ctx.lineWidth = 3;
      rr(ctx, lx, y0 + 6, lw, LANE_H - 14, 7); ctx.stroke();
    }
  });

  return { allDone };
}
