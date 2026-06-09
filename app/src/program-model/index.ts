export * from './types';
export { nid } from './id';

import type { Block } from './types';

/** Count every block in a list, recursing into container bodies. */
export function countList(list: Block[]): number {
  let n = 0;
  for (const b of list) {
    n++;
    if ('body' in b && b.body) n += countList(b.body);
    if ('elseBody' in b && b.elseBody) n += countList(b.elseBody);
  }
  return n;
}
