/**
 * editor/blocks — presentation metadata for each block type: the icon, label
 * and colour class used when a block is rendered in the editor, and the palette
 * button styling. Verbatim from the prototype. Meaning is conveyed by icon +
 * colour + label together (never colour alone) for colourblind accessibility.
 */
import type { PaletteType } from '../content/types';

export interface BlockMeta { cls: string; ico: string; label: string; }
export interface PalMeta { pi: string; label: string; bg: string; }

export const META: Record<string, BlockMeta> = {
  move: { cls: 'b-move', ico: '👣', label: 'Step' },
  left: { cls: 'b-left', ico: '↰', label: 'Turn Left' },
  right: { cls: 'b-right', ico: '↱', label: 'Turn Right' },
  repeat: { cls: 'b-repeat', ico: '🔁', label: 'Repeat' },
  if: { cls: 'b-if', ico: '❓', label: 'If Path' },
  combo: { cls: 'b-combo', ico: '⭐', label: 'Combo' },
  charge: { cls: 'b-charge', ico: '⚡', label: 'Charge' },
  iflow: { cls: 'b-iflow', ico: '🪫', label: 'If Low' },
  goU: { cls: 'b-go', ico: '▲', label: 'Go Up' },
  goD: { cls: 'b-go', ico: '▼', label: 'Go Down' },
  goL: { cls: 'b-go', ico: '◀', label: 'Go Left' },
  goR: { cls: 'b-go', ico: '▶', label: 'Go Right' },
  setBlue: { cls: 'b-mode', ico: '🔵', label: 'Set 🔵' },
  setOrange: { cls: 'b-mode', ico: '🟠', label: 'Set 🟠' },
  ifmode: { cls: 'b-ifmode', ico: '🔵', label: 'If 🔵' },
  // Array world
  swap: { cls: 'b-swap', ico: '⇄', label: 'Swap' },
  next: { cls: 'b-next', ico: '▶', label: 'Next' },
  rewind: { cls: 'b-rewind', ico: '⏮', label: 'Rewind' },
  iftaller: { cls: 'b-iftaller', ico: '📏', label: 'If Taller' },
  ifend: { cls: 'b-ifend', ico: '🏁', label: 'If At End' },
  ifmatch: { cls: 'b-ifmatch', ico: '🎯', label: 'If Match' },
  pick: { cls: 'b-pick', ico: '✋', label: 'Pick' },
  goLeft: { cls: 'b-goleft', ico: '⏪', label: 'Go Left' },
  goRight: { cls: 'b-goright', ico: '⏩', label: 'Go Right' },
  ifhigher: { cls: 'b-ifhigher', ico: '⬆️', label: 'If Higher' },
  iflower: { cls: 'b-iflower', ico: '⬇️', label: 'If Lower' },
  mark: { cls: 'b-mark', ico: '🔖', label: 'Mark' },
  place: { cls: 'b-place', ico: '⤓', label: 'Place' },
  swapLeft: { cls: 'b-swapleft', ico: '⇄', label: 'Swap Left' },
  stepLeft: { cls: 'b-stepleft', ico: '◀', label: 'Step Left' },
  ifshorter: { cls: 'b-ifshorter', ico: '📏', label: 'If Shorter' },
  iftallerleft: { cls: 'b-iftallerleft', ico: '📏', label: 'If Taller Left' },
  // Structures world
  push: { cls: 'b-push', ico: '⤵️', label: 'Push' },
  pop: { cls: 'b-pop', ico: '⤴️', label: 'Pop' },
  enqueue: { cls: 'b-enq', ico: '➡️', label: 'Enqueue' },
  dequeue: { cls: 'b-deq', ico: '⬅️', label: 'Dequeue' },
  ifmore: { cls: 'b-ifmore', ico: '📥', label: 'If More' },
  // Graph world
  takeFront: { cls: 'b-take', ico: '⏮', label: 'Take Front' },
  takeTop: { cls: 'b-taketop', ico: '⏫', label: 'Take Top' },
  expand: { cls: 'b-expand', ico: '🌱', label: 'Expand' },
  iffrontier: { cls: 'b-iffrontier', ico: '📥', label: 'If Frontier' },
};

export const PAL: Record<PaletteType, PalMeta> = {
  move: { pi: '👣', label: 'Step', bg: 'var(--move)' },
  left: { pi: '↰', label: 'Turn Left', bg: 'var(--turn)' },
  right: { pi: '↱', label: 'Turn Right', bg: 'var(--turn)' },
  repeat: { pi: '🔁', label: 'Repeat', bg: 'var(--loop)' },
  if: { pi: '❓', label: 'If Path', bg: 'var(--if)' },
  combo: { pi: '⭐', label: 'Combo', bg: 'var(--combo)' },
  charge: { pi: '⚡', label: 'Charge', bg: 'var(--energy)' },
  iflow: { pi: '🪫', label: 'If Low', bg: 'var(--iflow)' },
  goU: { pi: '▲', label: 'Go Up', bg: 'var(--move)' },
  goD: { pi: '▼', label: 'Go Down', bg: 'var(--move)' },
  goL: { pi: '◀', label: 'Go Left', bg: 'var(--move)' },
  goR: { pi: '▶', label: 'Go Right', bg: 'var(--move)' },
  setBlue: { pi: '🔵', label: 'Set Blue', bg: 'var(--mode)' },
  setOrange: { pi: '🟠', label: 'Set Orange', bg: 'var(--mode)' },
  ifmode: { pi: '🔵', label: 'If Blue', bg: 'var(--mode)' },
  // Array world
  swap: { pi: '⇄', label: 'Swap', bg: 'var(--combo)' },
  next: { pi: '▶', label: 'Next', bg: 'var(--move)' },
  rewind: { pi: '⏮', label: 'Rewind', bg: 'var(--turn)' },
  iftaller: { pi: '📏', label: 'If Taller', bg: 'var(--if)' },
  ifend: { pi: '🏁', label: 'If At End', bg: 'var(--iflow)' },
  ifmatch: { pi: '🎯', label: 'If Match', bg: 'var(--mode)' },
  pick: { pi: '✋', label: 'Pick', bg: 'var(--combo)' },
  goLeft: { pi: '⏪', label: 'Go Left', bg: 'var(--move)' },
  goRight: { pi: '⏩', label: 'Go Right', bg: 'var(--move)' },
  ifhigher: { pi: '⬆️', label: 'If Higher', bg: 'var(--if)' },
  iflower: { pi: '⬇️', label: 'If Lower', bg: 'var(--iflow)' },
  mark: { pi: '🔖', label: 'Mark', bg: 'var(--mode)' },
  place: { pi: '⤓', label: 'Place', bg: 'var(--combo)' },
  swapLeft: { pi: '⇄', label: 'Swap Left', bg: 'var(--combo)' },
  stepLeft: { pi: '◀', label: 'Step Left', bg: 'var(--move)' },
  ifshorter: { pi: '📏', label: 'If Shorter', bg: 'var(--if)' },
  iftallerleft: { pi: '📏', label: 'If Taller Left', bg: 'var(--if)' },
  // Structures world
  push: { pi: '⤵️', label: 'Push', bg: 'var(--combo)' },
  pop: { pi: '⤴️', label: 'Pop', bg: 'var(--turn)' },
  enqueue: { pi: '➡️', label: 'Enqueue', bg: 'var(--move)' },
  dequeue: { pi: '⬅️', label: 'Dequeue', bg: 'var(--energy)' },
  ifmore: { pi: '📥', label: 'If More', bg: 'var(--if)' },
  // Graph world
  takeFront: { pi: '⏮', label: 'Take Front', bg: 'var(--move)' },
  takeTop: { pi: '⏫', label: 'Take Top', bg: 'var(--iflow)' },
  expand: { pi: '🌱', label: 'Expand', bg: 'var(--combo)' },
  iffrontier: { pi: '📥', label: 'If Frontier', bg: 'var(--if)' },
};
