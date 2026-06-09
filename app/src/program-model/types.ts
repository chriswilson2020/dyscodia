/**
 * program-model — the internal data model the interpreter walks.
 *
 * This is plain engineering: a structured representation of the blocks the
 * learner assembles. It is NEVER surfaced to the learner as text code, and
 * there is deliberately no serialization to any programming language. The
 * blocks and the world are the whole medium.
 */

/** Facing direction. Index into DELTA: 0=N, 1=E, 2=S, 3=W. */
export type Dir = 0 | 1 | 2 | 3;

/** Every concept the block vocabulary can express, as discriminant tags. */
export type BlockType =
  // motion (leaf)
  | 'move' | 'left' | 'right'
  // state operations (leaf)
  | 'charge' | 'setBlue' | 'setOrange'
  // Array world leaves (sort + search)
  | 'swap' | 'next' | 'rewind' | 'pick' | 'goLeft' | 'goRight'
  | 'mark' | 'place' | 'swapLeft' | 'stepLeft'
  // Structures world leaves
  | 'push' | 'pop' | 'enqueue' | 'dequeue'
  // Graph world leaves
  | 'takeFront' | 'takeTop' | 'expand'
  // containers
  | 'repeat' | 'if' | 'iflow' | 'ifmode'
  // Array world conditions
  | 'iftaller' | 'ifend' | 'ifmatch' | 'ifhigher' | 'iflower'
  | 'ifshorter' | 'iftallerleft'
  // Structures world condition
  | 'ifmore'
  // Graph world condition
  | 'iffrontier'
  // call the single named procedure ("Combo")
  | 'combo';

export interface BaseBlock {
  /** Stable identity, used to highlight the running block during playback. */
  id: string;
  type: BlockType;
}

/** Leaf blocks — no children. (Grid: motion/state; Array: swap/next/rewind/pick/go.) */
export interface LeafBlock extends BaseBlock {
  type: 'move' | 'left' | 'right' | 'charge' | 'setBlue' | 'setOrange'
      | 'swap' | 'next' | 'rewind' | 'pick' | 'goLeft' | 'goRight'
      | 'mark' | 'place' | 'swapLeft' | 'stepLeft'
      | 'push' | 'pop' | 'enqueue' | 'dequeue'
      | 'takeFront' | 'takeTop' | 'expand' | 'combo';
}

/** A LOOP. `until` runs the body until the level is won (capped); else `count` times. */
export interface RepeatBlock extends BaseBlock {
  type: 'repeat';
  count: number;
  until?: boolean;
  body: Block[];
}

/**
 * A CONDITIONAL with two arms.
 *  - 'if'     branches on "is the path ahead clear?"
 *  - 'iflow'  branches on "is my energy low?"
 *  - 'ifmode' branches on "is my memory switch blue?"
 */
export interface IfBlock extends BaseBlock {
  type: 'if' | 'iflow' | 'ifmode'
      | 'iftaller' | 'ifend' | 'ifmatch' | 'ifhigher' | 'iflower'
      | 'ifshorter' | 'iftallerleft' | 'ifmore' | 'iffrontier';
  body: Block[];
  elseBody: Block[];
}

export type Block = LeafBlock | RepeatBlock | IfBlock;

/** A complete block program: the main list plus the one reusable Combo. */
export interface Program {
  body: Block[];
  /** The named procedure a `combo` leaf calls. Empty when the level has no Combo. */
  combo: Block[];
}

/** The events an interactive level can wire handlers to. */
export type EventKey = 'up' | 'down' | 'left' | 'right' | 'charge';

/** Action a handler can run. Movement is absolute (screen-relative) in event mode. */
export type GoType = 'goU' | 'goD' | 'goL' | 'goR' | 'charge';

export interface GoBlock {
  id: string;
  type: GoType;
}

/** Event handlers for interactive levels: "WHEN key pressed, DO these actions." */
export type Handlers = Record<EventKey, GoBlock[]>;

// ---- Interpreter output ---------------------------------------------------

/** What just happened on a given frame, used by the renderer for cues. */
export type FrameEvent =
  | 'start' | 'move' | 'turn' | 'bonk' | 'noenergy' | 'charge' | 'mode';

/**
 * The fields every world's frame shares: which block produced it (for
 * highlighting) and what just happened (for render cues). Each world extends
 * this with its own state — the grid `Frame` below, the Array world's frame, etc.
 */
export interface FrameBase {
  id: string | null;
  ev: string;
}

/** An immutable snapshot of grid-world state — the unit of playback. */
export interface Frame extends FrameBase {
  x: number;
  y: number;
  dir: Dir;
  gems: string[];
  batt: string[];
  energy: number;
  mode: 0 | 1;
  moves: number;
  /** id of the block that produced this frame (for highlighting), or null. */
  id: string | null;
  ev: FrameEvent;
}

export type Outcome =
  | { win: true; moves: number }
  | { win: false; reason: 'bonk' | 'noenergy' | 'toolong' | 'end' | 'wrong' };

export interface RunResult {
  frames: Frame[];
  outcome: Outcome;
}
