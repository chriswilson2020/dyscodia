/**
 * content/types — the authored shape of a level. Content is pure data so the
 * curriculum can grow without touching engine, interpreter, or UI code.
 *
 * `solution*` fields are INTERNAL: a reference answer used only by the CI
 * solvability gate to prove every level is winnable. They are never rendered
 * and never shown to the learner.
 */
import type { DemoSpec } from '../interpreter/dsl';
import type { EventKey } from '../program-model/types';

/** The block kinds a level's palette can offer. */
export type PaletteType =
  | 'move' | 'left' | 'right' | 'repeat' | 'if' | 'combo'
  | 'charge' | 'iflow'
  | 'goU' | 'goD' | 'goL' | 'goR'
  | 'setBlue' | 'setOrange' | 'ifmode'
  // Array world
  | 'swap' | 'next' | 'rewind' | 'iftaller' | 'ifend' | 'ifmatch'
  | 'pick' | 'goLeft' | 'goRight' | 'ifhigher' | 'iflower'
  | 'mark' | 'place' | 'swapLeft' | 'stepLeft' | 'ifshorter' | 'iftallerleft'
  // Structures world
  | 'push' | 'pop' | 'enqueue' | 'dequeue' | 'ifmore'
  // Graph world
  | 'takeFront' | 'takeTop' | 'expand' | 'iffrontier';

export type HandlerSpec = Partial<Record<EventKey, string[]>>;

export interface LevelDef {
  name: string;
  icon: string;
  title: string;
  text: string;
  concept?: string;
  hint?: string;

  /** Which world this level runs in. Defaults to 'grid'. */
  world?: 'grid' | 'array' | 'structures' | 'graph';

  // --- Graph world ---
  /** Node positions in small integer coordinates (scaled to the canvas). */
  nodes?: Array<[number, number]>;
  /** Undirected edges as pairs of node indices. */
  edges?: Array<[number, number]>;
  /** Starting node index for a traversal. */
  startNode?: number;

  // --- Structures world ---
  /** Input tokens fed into the structure. */
  seq?: number[];
  /** Target output tray sequence. */
  want?: number[];
  /** Which structure this level uses. */
  struct?: 'stack' | 'queue';

  // --- Grid world ---
  /** ASCII map rows. Legend: S start, G gate, * gem, B battery, C charger, # wall, . floor. */
  grid?: string[];
  /** Initial facing. */
  dir?: 'N' | 'E' | 'S' | 'W';
  /** Block target for 3 stars, or null for free-build / shortest levels. */
  par: number | null;
  /**
   * Operation budget (Array sort challenges): the run must finish in at most this
   * many moves, so the learner has to pick the sort that fits THIS data — the
   * wrong choice still sorts but blows the budget.
   */
  maxOps?: number;

  // --- Array world ---
  /** Bar heights for the Array world. */
  bars?: number[];
  /** Array goal: sort the row, linear-find the target, or binary-search a sorted row. */
  goal?: 'sort' | 'find' | 'search';
  /**
   * Complexity-race level.
   *  - 'searchGrowth' / 'sortCompare': learner solves, then a count panel appears.
   *  - 'parallelSort' / 'parallelSearch': a live race — every algorithm runs at
   *    once in stacked lanes; you watch which finishes first (no block-building).
   */
  race?: 'searchGrowth' | 'sortCompare' | 'parallelSort' | 'parallelSearch';
  /** Target value for find levels. */
  target?: number;

  energy?: number;
  battery?: number;
  charge?: number;
  lowAt?: number;

  palette: PaletteType[];
  combo: boolean;

  // mode flags
  sandbox?: boolean;
  interactive?: boolean;
  shortest?: boolean;

  // "Show me" demo (learner-facing)
  demo?: DemoSpec[];
  demoCombo?: DemoSpec[];
  demoChain?: { spec: DemoSpec[]; combo?: DemoSpec[]; after?: string }[];
  demoMsg?: string;
  demoFail?: boolean;
  demoHandlers?: HandlerSpec;
  demoSeq?: EventKey[];

  // optional supporting diagram (inline SVG markup)
  diagram?: string;

  // INTERNAL reference solution for the CI solvability gate (never shown)
  solution?: DemoSpec[];
  solutionCombo?: DemoSpec[];
  solutionHandlers?: HandlerSpec;
  solutionSeq?: EventKey[];
}

export interface LessonMeta {
  id: string;
  tab: string;
  belt: { name: string; badge: string };
  /** Filename slug for this module's lesson audio (e.g. 'bubble-sort' → dojo-audio/bubble-sort.mp3). */
  audio?: string;
  learn?: LevelDef[];
  test: LevelDef[];
}
