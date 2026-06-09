export * from './types';
export * from './levels';
export * from './array-levels';
export * from './struct-levels';
export * from './graph-levels';
export * from './lesson3-challenge';

import { LMETA, BLACK } from './levels';
import { ARRAY_LESSONS } from './array-levels';
import { STRUCT_LESSONS } from './struct-levels';
import { GRAPH_LESSONS } from './graph-levels';
import { CHALLENGE3_LESSONS } from './lesson3-challenge';
import type { LessonMeta, LevelDef } from './types';

/** Look up a lesson (grid, black, Array, Structures, or Graph discipline) by id. */
export function metaOf(id: string): LessonMeta {
  if (id === 'black') return BLACK;
  return (LMETA.find((m) => m.id === id)
    || ARRAY_LESSONS.find((m) => m.id === id)
    || STRUCT_LESSONS.find((m) => m.id === id)
    || GRAPH_LESSONS.find((m) => m.id === id)
    || CHALLENGE3_LESSONS.find((m) => m.id === id)) as LessonMeta;
}

/** Every level in the curriculum, flattened, each tagged with where it lives. */
export interface LevelRef {
  lesson: LessonMeta;
  section: 'learn' | 'test';
  index: number;
  def: LevelDef;
}

export function allLevels(): LevelRef[] {
  const out: LevelRef[] = [];
  for (const lesson of [...LMETA, ...ARRAY_LESSONS, ...STRUCT_LESSONS, ...GRAPH_LESSONS, ...CHALLENGE3_LESSONS]) {
    (lesson.learn || []).forEach((def, index) => out.push({ lesson, section: 'learn', index, def }));
    lesson.test.forEach((def, index) => out.push({ lesson, section: 'test', index, def }));
  }
  BLACK.test.forEach((def, index) => out.push({ lesson: BLACK, section: 'test', index, def }));
  return out;
}
