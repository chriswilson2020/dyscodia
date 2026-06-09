/** Monotonic block-id generator, shared by the editor and the demo/DSL expander. */
let uid = 1;
export const nid = (): string => 'b' + uid++;
