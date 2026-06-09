/**
 * interpreter/dsl — expands the compact authoring shorthand used by "Show me"
 * demos and the internal reference solutions into real program-model blocks.
 *
 * This shorthand is an authoring convenience only; it is never shown to the
 * learner. Leaf tokens: 'm' step, 'l' left, 'r' right, 'sb' set-blue,
 * 'so' set-orange, 'ch' charge, 'combo' call-combo. Containers:
 *   ['rep', n, body]  repeat n times
 *   ['repU', body]    repeat until won
 *   ['if', then, else] / ['iflow', then, else] / ['ifm', then, else]
 * Handler actions use 'goU' | 'goD' | 'goL' | 'goR' | 'ch'.
 */
import { nid } from '../program-model/id';
import type { Block, EventKey, GoBlock, GoType, Handlers } from '../program-model/types';

export type DemoSpec =
  | string
  | ['rep', number, DemoSpec[]]
  | ['repU', DemoSpec[]]
  | [CondKey, DemoSpec[], DemoSpec[]];

type CondKey = 'if' | 'iflow' | 'ifm' | 'ift' | 'ife' | 'ifmt' | 'ifh' | 'ifl' | 'ifsh' | 'iftl' | 'ifmo' | 'iffr';

const LEAF: Record<string, Block['type']> = {
  m: 'move', l: 'left', r: 'right',
  sb: 'setBlue', so: 'setOrange', ch: 'charge', combo: 'combo',
  // Array world leaves
  sw: 'swap', nx: 'next', rw: 'rewind', pk: 'pick', gl: 'goLeft', gr: 'goRight',
  mk: 'mark', pl: 'place', swl: 'swapLeft', stl: 'stepLeft',
  // Structures world leaves
  pu: 'push', po: 'pop', eq: 'enqueue', dq: 'dequeue',
  // Graph world leaves
  tf: 'takeFront', tt: 'takeTop', exp: 'expand',
};

const COND: Record<string, Block['type']> = {
  if: 'if', iflow: 'iflow', ifm: 'ifmode',
  // Array world conditions
  ift: 'iftaller', ife: 'ifend', ifmt: 'ifmatch', ifh: 'ifhigher', ifl: 'iflower',
  ifsh: 'ifshorter', iftl: 'iftallerleft',
  // Structures world condition
  ifmo: 'ifmore',
  // Graph world condition
  iffr: 'iffrontier',
};

export function buildBlock(s: DemoSpec): Block {
  if (typeof s === 'string') return { id: nid(), type: LEAF[s] || 'move' } as Block;
  const k = s[0];
  if (k === 'rep') return { id: nid(), type: 'repeat', count: s[1] as number, body: (s[2] as DemoSpec[]).map(buildBlock) };
  if (k === 'repU') return { id: nid(), type: 'repeat', until: true, count: 10, body: (s[1] as DemoSpec[]).map(buildBlock) };
  const condType = COND[k as string];
  if (condType) {
    return { id: nid(), type: condType, body: (s[1] as DemoSpec[]).map(buildBlock), elseBody: (s[2] as DemoSpec[]).map(buildBlock) } as Block;
  }
  return { id: nid(), type: 'move' };
}

export function buildProgram(spec: DemoSpec[]): Block[] {
  return spec.map(buildBlock);
}

const GO_MAP: Record<string, GoType> = {
  goU: 'goU', goD: 'goD', goL: 'goL', goR: 'goR', ch: 'charge', charge: 'charge',
};

export function buildGo(token: string): GoBlock {
  return { id: nid(), type: GO_MAP[token] || 'goU' };
}

export function buildHandlers(spec: Partial<Record<EventKey, string[]>>): Handlers {
  const h: Handlers = { up: [], down: [], left: [], right: [], charge: [] };
  (Object.keys(spec) as EventKey[]).forEach((key) => {
    h[key] = (spec[key] || []).map(buildGo);
  });
  return h;
}
