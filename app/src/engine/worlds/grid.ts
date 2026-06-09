/**
 * engine/worlds/grid — the Grid world: parse an ASCII level into a World, and
 * render world state to a canvas. Drawing is intentionally DOM-free (it touches
 * only the 2D context); the UI layer owns the HUD text so the engine stays
 * presentation-agnostic and reusable by future worlds.
 *
 * ASCII legend:  S start · G gate · * gem · B battery · C charger · # wall · . floor
 */
import { DELTA, DIRMAP, type World } from '../core';
import type { LevelDef } from '../../content/types';
import type { Dir, Frame } from '../../program-model/types';

export function parseLevel(def: LevelDef): World {
  const rows = (def.grid || []).map((r) => r.split(''));
  const H = rows.length;
  const W = Math.max(...rows.map((r) => r.length));
  rows.forEach((r) => { while (r.length < W) r.push('#'); });

  let sx = 0, sy = 0, gx = 0, gy = 0;
  const gems = new Set<string>();
  const batteries = new Map<string, number>();
  const chargers = new Set<string>();

  const walls = rows.map((r, y) => r.map((c, x) => {
    if (c === 'S') { sx = x; sy = y; return false; }
    if (c === 'G') { gx = x; gy = y; return false; }
    if (c === '*') { gems.add(x + ',' + y); return false; }
    if (c === 'B') { batteries.set(x + ',' + y, def.battery || 0); return false; }
    if (c === 'C') { chargers.add(x + ',' + y); return false; }
    return c === '#';
  }));

  return {
    def, W, H, sx, sy, gx, gy,
    sdir: DIRMAP[def.dir || 'E'],
    walls, gems, batteries, chargers,
    chargeVal: def.charge || 0,
    lowAt: def.lowAt != null ? def.lowAt : 1,
    usesMode: (def.palette || []).includes('ifmode'),
    hasEnergy: def.energy != null,
    startEnergy: def.energy as number,
    walk(x: number, y: number) {
      return x >= 0 && y >= 0 && x < this.W && y < this.H && !this.walls[y][x];
    },
  };
}

// ---- canvas rendering -----------------------------------------------------

export function tileSize(w: World): number {
  return Math.floor(Math.min(420 / w.W, 380 / w.H));
}

export function fitCanvas(canvas: HTMLCanvasElement, w: World): void {
  const T = tileSize(w);
  canvas.width = w.W * T;
  canvas.height = w.H * T;
}

type Ctx = CanvasRenderingContext2D;

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawEmoji(ctx: Ctx, ch: string, x: number, y: number, T: number, s: number): void {
  ctx.font = Math.floor(T * s) + 'px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ch, x * T + T / 2, y * T + T / 2 + 1);
}

function drawArrow(ctx: Ctx, cx: number, cy: number, dir: Dir, T: number): void {
  const r = T * 0.40;
  const [dx, dy] = DELTA[dir];
  const tx = cx + dx * r, ty = cy + dy * r;
  const perp = [-dy, dx], w = T * 0.12;
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(tx - dx * T * 0.18 + perp[0] * w, ty - dy * T * 0.18 + perp[1] * w);
  ctx.lineTo(tx - dx * T * 0.18 - perp[0] * w, ty - dy * T * 0.18 - perp[1] * w);
  ctx.closePath();
  ctx.fill();
}

/** Draw a single playback frame. Returns nothing; the UI reads HUD values from the frame. */
export function drawFrame(ctx: Ctx, w: World, f: Frame): void {
  const T = tileSize(w);
  ctx.clearRect(0, 0, w.W * T, w.H * T);
  for (let y = 0; y < w.H; y++) for (let x = 0; x < w.W; x++) {
    const px = x * T, py = y * T, wall = w.walls[y][x];
    ctx.fillStyle = wall ? '#7c6a4a' : '#f4e9cd';
    roundRect(ctx, px + 2, py + 2, T - 4, T - 4, 8); ctx.fill();
    if (!wall) { ctx.strokeStyle = '#e3d4ad'; ctx.lineWidth = 1; roundRect(ctx, px + 2, py + 2, T - 4, T - 4, 8); ctx.stroke(); }
  }
  drawEmoji(ctx, '⛩️', w.gx, w.gy, T, 0.62);
  const got = new Set(f.gems);
  w.gems.forEach((k) => { if (!got.has(k)) { const [gx, gy] = k.split(',').map(Number); drawEmoji(ctx, '💎', gx, gy, T, 0.5); } });
  (f.batt || []).forEach((k) => { const [bx, by] = k.split(',').map(Number); drawEmoji(ctx, '🔋', bx, by, T, 0.5); });
  if (w.chargers) w.chargers.forEach((k) => { const [cx, cy] = k.split(',').map(Number); drawEmoji(ctx, '🔌', cx, cy, T, 0.5); });
  const hx = f.x * T, hy = f.y * T;
  ctx.fillStyle = (f.ev === 'bonk' || f.ev === 'noenergy') ? '#d8587a' : '#2c2a3a';
  drawArrow(ctx, hx + T / 2, hy + T / 2, f.dir, T);
  if (w.usesMode) {
    ctx.strokeStyle = (f.mode === 1) ? '#e08a1e' : '#2f7fb0';
    ctx.lineWidth = Math.max(2, T * 0.08);
    ctx.beginPath();
    ctx.arc(f.x * T + T / 2, f.y * T + T / 2, T * 0.40, 0, Math.PI * 2);
    ctx.stroke();
  }
  drawEmoji(ctx, '🦊', f.x, f.y, T, 0.6);
  if (f.ev === 'bonk') drawEmoji(ctx, '💥', f.x, f.y, T, 0.5);
  if (f.ev === 'noenergy') drawEmoji(ctx, '😵', f.x, f.y, T, 0.5);
}

// ---- shortest-path flood reveal ------------------------------------------

export function floodMax(w: World): number {
  return Math.max(0, ...(w.dist || []).flat().filter((v) => v >= 0));
}

/** Reveal BFS distances up to `layer` rings — the "Show the flood" animation. */
export function drawFloodUpto(ctx: Ctx, w: World, layer: number): void {
  const T = tileSize(w);
  const maxD = floodMax(w) || 1;
  ctx.clearRect(0, 0, w.W * T, w.H * T);
  for (let y = 0; y < w.H; y++) for (let x = 0; x < w.W; x++) {
    const px = x * T, py = y * T, wall = w.walls[y][x];
    ctx.fillStyle = wall ? '#7c6a4a' : '#f4e9cd';
    roundRect(ctx, px + 2, py + 2, T - 4, T - 4, 8); ctx.fill();
    const d = w.dist![y][x];
    if (d >= 0 && d <= layer) {
      const t = d / maxD;
      ctx.fillStyle = `hsl(${198 - t * 30},72%,${80 - t * 42}%)`;
      roundRect(ctx, px + 2, py + 2, T - 4, T - 4, 8); ctx.fill();
      ctx.fillStyle = t > 0.5 ? '#fff' : '#234';
      ctx.font = `700 ${Math.floor(T * 0.34)}px Lexend, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(d), px + T / 2, py + T / 2 + 1);
    }
  }
  drawEmoji(ctx, '⛩️', w.gx, w.gy, T, 0.5);
  drawEmoji(ctx, '🦊', w.sx, w.sy, T, 0.5);
}
