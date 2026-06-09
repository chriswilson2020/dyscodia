/**
 * engine/worlds/grid-ops — the Grid world expressed as WorldOps, so the shared
 * interpreter can drive it. This is the grid half of the world/interpreter
 * split: control flow lives in interpreter/run, world rules live here (wrapping
 * the engine primitives). Behaviour is identical to the prototype's simulate();
 * the solvability gate proves frame-for-frame parity.
 */
import {
  type World, type SimState,
  initState, frontClear, won, tryStep, turn, charge, setMode,
} from '../core';
import type { Frame, FrameEvent, Outcome } from '../../program-model/types';
import type { WorldOps, Emit } from '../../interpreter/run';

export function gridOps(w: World): WorldOps<SimState, Frame> {
  return {
    init: () => initState(w),

    snapshot: (s, id, ev): Frame => ({
      x: s.x, y: s.y, dir: s.dir,
      gems: [...s.gems], batt: [...s.batt],
      energy: s.energy, mode: s.mode, moves: s.moves,
      id, ev: ev as FrameEvent,
    }),

    predicate: (s, type): boolean => {
      if (type === 'if') return frontClear(w, s);
      if (type === 'iflow') return w.hasEnergy && s.energy <= w.lowAt;
      if (type === 'ifmode') return s.mode === 0;
      return false;
    },

    action: (s, type, id, emit: Emit): Outcome | null => {
      switch (type) {
        case 'move': {
          const r = tryStep(w, s);
          if (r.event === 'noenergy') { emit(id, 'noenergy'); return { win: false, reason: 'noenergy' }; }
          if (r.event === 'bonk') { emit(id, 'bonk'); return { win: false, reason: 'bonk' }; }
          emit(id, 'move');
          return r.won ? { win: true, moves: s.moves } : null;
        }
        case 'left': turn(s, -1); emit(id, 'turn'); return null;
        case 'right': turn(s, 1); emit(id, 'turn'); return null;
        case 'setBlue': setMode(s, 0); emit(id, 'mode'); return null;
        case 'setOrange': setMode(s, 1); emit(id, 'mode'); return null;
        case 'charge': charge(w, s); emit(id, 'charge'); return null;
        default: return null;
      }
    },

    wonAtEnd: (s) => won(w, s),
    effort: (s) => s.moves,
  };
}
