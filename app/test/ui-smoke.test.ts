// @vitest-environment jsdom
/**
 * UI boot smoke test. Loads the real index.html shell, boots the actual UI
 * controller (with canvas/audio/speech stubbed), and asserts the app renders
 * Lesson 1 exactly as the prototype does. This guards the DOM port: if wiring,
 * content, or navigation regresses, the initial screen changes and this fails.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { beforeEach, describe, it, expect } from 'vitest';

function loadBody() {
  const html = readFileSync(resolve(__dirname, '../index.html'), 'utf8');
  const body = html.split('<body>')[1].split('</body>')[0];
  document.body.innerHTML = body;
}

beforeEach(() => {
  loadBody();
  // Stub the 2D canvas context — drawing is exercised elsewhere; here we just
  // need it not to throw so the UI can boot.
  (HTMLCanvasElement.prototype as any).getContext = () =>
    new Proxy({}, { get: () => () => {} });
  (globalThis as any).Audio = class {
    preload = ''; src = '';
    addEventListener() {} setAttribute() {} getAttribute() { return null; }
    load() {} pause() {} play() { return Promise.resolve(); }
  };
  (globalThis as any).speechSynthesis = { cancel() {}, speak() {} };
  (globalThis as any).SpeechSynthesisUtterance = class { constructor(_t?: string) {} };
  localStorage.clear();
});

describe('UI boots and renders Lesson 1 at parity', () => {
  it('renders all belt tabs, the level list, and the first mission', async () => {
    const { init } = await import('../src/ui/app');
    init();

    // Three top-level lessons (courses).
    expect(document.querySelectorAll('#courses .course').length).toBe(3);
    // Lesson One is open: its six grid modules show as tabs.
    expect(document.querySelectorAll('#tabs .tab').length).toBe(6);
    // First module's Learn has six sub-levels.
    expect(document.querySelectorAll('#levels .lvl-btn').length).toBe(6);
    // First mission shown verbatim from content.
    expect(document.getElementById('missionTitle')!.textContent).toBe('First Steps');
    expect(document.getElementById('conceptTag')!.textContent).toContain('SEQUENCE');
    // The belt collection shows one belt per Lesson, greyed until earned.
    expect(document.querySelectorAll('#beltRack .belt-chip').length).toBe(3);
    expect(document.querySelectorAll('#beltRack .belt-chip.earned').length).toBe(0);
    // The test section is labelled "Lesson Test", not "Belt Test".
    expect(document.getElementById('segTest')!.textContent).toContain('Lesson Test');
    // Editor is in block mode (not the interactive handler panel).
    expect((document.getElementById('progEditor') as HTMLElement).style.display).not.toBe('none');
    expect((document.getElementById('handlersWrap') as HTMLElement).style.display).toBe('none');
  });

  it('opens Lesson Two and renders the first Array module', async () => {
    const { init } = await import('../src/ui/app');
    init();
    // Open Lesson Two — its module tabs replace Lesson One's.
    const lessonTwo = Array.from(document.querySelectorAll('#courses .course'))
      .find((c) => /Lesson Two/.test(c.textContent || '')) as HTMLButtonElement;
    expect(lessonTwo, 'Lesson Two course exists').toBeTruthy();
    lessonTwo.click();
    // First module of Lesson Two is Bubble Sort.
    expect(document.getElementById('missionTitle')!.textContent).toBe('The First Swap');
    expect(document.getElementById('conceptTag')!.textContent).toContain('ARRAY');
    // Lesson Two has six module tabs (sorts, search, race, challenge).
    expect(document.querySelectorAll('#tabs .tab').length).toBe(6);
    // Bubble Sort Learn has four sub-levels.
    expect(document.querySelectorAll('#levels .lvl-btn').length).toBe(4);
  });

  it('passing every Lesson One Test (Learn levels not required) awards the Yellow belt + certificate', async () => {
    const { LMETA } = await import('../src/content');
    // Pass every Lesson Test in all six Lesson One modules — and deliberately
    // leave the Learn (practice) levels unsolved, to prove they don't gate the belt.
    const results: Record<string, Record<number, { solved: boolean; stars: number }>> = {};
    for (const m of LMETA) {
      const testKey = m.id + ':test';
      results[testKey] = {};
      m.test.forEach((_, i) => { results[testKey][i] = { solved: true, stars: 3 }; });
    }
    localStorage.setItem('codeDojo.v1', JSON.stringify(results));

    const { init } = await import('../src/ui/app');
    init();

    const chips = Array.from(document.querySelectorAll('#beltRack .belt-chip'));
    const yellow = chips.find((c) => /Yellow Belt/.test(c.textContent || '')) as HTMLElement;
    expect(yellow, 'Yellow belt chip exists').toBeTruthy();
    expect(yellow.className, 'Yellow belt is earned').toContain('earned');

    // Clicking the earned belt opens its certificate.
    yellow.click();
    expect(document.getElementById('certScrim')!.className).toContain('show');
    expect(document.getElementById('certCard')!.innerHTML).toMatch(/Yellow Belt/);
  });
});
