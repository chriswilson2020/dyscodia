/**
 * Course-belt mapping guard: Lesson One earns Yellow, Lesson Two earns Orange.
 * (The certificate module touches no DOM at import time, so this runs in node.)
 */
import { describe, it, expect } from 'vitest';
import { COURSE_BELT } from '../src/ui/certificate';

describe('course belts', () => {
  it('maps lessons to the right belt colours', () => {
    expect(COURSE_BELT.lesson1.name).toBe('Yellow Belt');
    expect(COURSE_BELT.lesson2.name).toBe('Orange Belt');
    expect(COURSE_BELT.lesson1.hex).toBe('#f3c200');
  });
});
