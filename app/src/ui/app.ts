// @ts-nocheck
/**
 * ui/app — the application controller: navigation, the block editor, playback,
 * scoring, belts, audio and interactive play. This is a faithful behavioural
 * port of the prototype's runtime, now driving the typed, tested core
 * (engine / interpreter / program-model / content) instead of inline code.
 *
 * Type-checking is disabled for this DOM-heavy shell; the parts where types
 * matter (the program model the interpreter walks) are strictly typed and
 * covered by the solvability gate. No programming-language syntax is ever
 * produced or shown — the blocks and the world are the whole medium.
 */
import { LMETA, BLACK, ARRAY_LESSONS, STRUCT_LESSONS, GRAPH_LESSONS, CHALLENGE3_LESSONS, metaOf } from '../content';
import { nid, countList } from '../program-model';
import { parseLevel, drawFrame as gridDrawFrame, drawFloodUpto as gridFlood, floodMax as gridFloodMax, tileSize as gridTileSize, fitCanvas as gridFit } from '../engine/worlds/grid';
import { parseArray, drawArrayFrame, fitArrayCanvas, arrayInitialFrame } from '../engine/worlds/array';
import { parseStruct, drawStructFrame, fitStructCanvas, structInitialFrame } from '../engine/worlds/structures';
import { parseGraph, drawGraphFrame, fitGraphCanvas, graphInitialFrame } from '../engine/worlds/graph';
import { bfsDist } from '../engine/core';
import { run } from '../interpreter/interpreter';
import { runArray } from '../interpreter/array';
import { runStructures } from '../interpreter/structures';
import { runGraph } from '../interpreter/graph';
import { buildProgram, buildHandlers } from '../interpreter/dsl';
import { initLive, applyEvent } from '../interpreter/events';
import { searchGrowth, searchOnRow, sortCompare } from './race';
import { buildLanes, raceWinner, fitRaceCanvas, drawRace } from './parallel-race';

/**
 * Belts/certificates/Black-belt grading are switched OFF for now (more lessons
 * are coming and the belt framing doesn't scale yet). All the belt machinery
 * stays in the codebase, dormant, behind this one flag — flip it back to true to
 * restore belts, the belt rack, certificates, and the Black Belt grading tab.
 * The lesson TESTS and all content are unchanged either way.
 */
const BELTS_ACTIVE = false;

/** Active tabs. With belts off: grid lessons + Array disciplines (no Black belt). */
const ALL_LESSONS = () => BELTS_ACTIVE
  ? [...LMETA, BLACK, ...ARRAY_LESSONS]
  : [...LMETA, ...ARRAY_LESSONS];

/**
 * Two-tier navigation: top-level "Lesson One / Lesson Two", each expanding to
 * its modules (the per-topic tabs). Lesson One = the grid lessons; Lesson Two =
 * the Array-world lessons. The Black belt (when active) lives under Lesson One.
 */
const COURSES = () => [
  { id: 'lesson1', name: 'Lesson One', modules: BELTS_ACTIVE ? [...LMETA, BLACK] : [...LMETA] },
  { id: 'lesson2', name: 'Lesson Two', modules: [...ARRAY_LESSONS] },
  { id: 'lesson3', name: 'Lesson Three', modules: [...STRUCT_LESSONS, ...GRAPH_LESSONS, ...CHALLENGE3_LESSONS] },
];
const courseOf = (moduleId) => COURSES().find((c) => c.modules.some((m) => m.id === moduleId));

/** A module is fully done when every Learn level AND every Test level is solved. */
/** Every Lesson Test in a module passed. (Learn levels are practice, not graded.) */
function moduleTestsPassed(m) {
  return (m.test || []).every((_, i) => results[m.id + ':test'] && results[m.id + ':test'][i] && results[m.id + ':test'][i].solved);
}
/** A course's belt is earned once every module's Lesson Test is passed. */
function courseEarned(course) { return course.modules.every(moduleTestsPassed); }
/** Progress toward a belt: how many of the course's test levels are passed. */
function courseProgress(course) {
  let passed = 0, total = 0;
  course.modules.forEach((m) => {
    (m.test || []).forEach((_, i) => {
      total++;
      if (results[m.id + ':test'] && results[m.id + ':test'][i] && results[m.id + ':test'][i].solved) passed++;
    });
  });
  return { passed, total };
}
/** Belts that have a printable certificate (grid colour belts + black). */
const CERT_BELTS = new Set(['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'black']);
const isArray = () => !!(level && level.def && level.def.world === 'array');
const isStruct = () => !!(level && level.def && level.def.world === 'structures');
const isGraph = () => !!(level && level.def && level.def.world === 'graph');
const isRace = () => !!(level && level.def && (level.def.race === 'parallelSort' || level.def.race === 'parallelSearch'));
import { META, PAL } from '../editor/blocks';
import {
  openCertificate, closeCertificate, openCourseCertificate, COURSE_BELT,
  saveName, loadName, saveDates, loadDates, beltDates,
  setPlayerName, getPlayerName,
} from './certificate';

const $ = (id) => document.getElementById(id);

/* ===== state ===== */
let curCourse = 'lesson1', curLesson = 'l1', curSection = 'learn', curIdx = 0;
let program = [], comboBody = [], level = null, locked = false;
let frames = [], playTimer = null, running = false, pendingArr = null, allowCombo = false;
let handlers = { up: [], down: [], left: [], right: [], charge: [] }, playing = false, live = null;
let floodTimer = null, floodActive = false;
let demoMode = false;
let demoChainData = null, demoChainIdx = 0;
let beltScrimLesson = 'l1';
const results = {};
let raceLanes = null, raceTick = 0, raceTimer = null;

let stage, ctx;

/* ===== navigation helpers ===== */
function isBlack() { return curLesson === 'black'; }
function isTest() { return isBlack() || curSection === 'test'; }
function currentDefs() { const m = metaOf(curLesson); return isBlack() ? m.test : (curSection === 'learn' ? m.learn : m.test); }
function setId() { return isBlack() ? 'black:test' : (curLesson + ':' + curSection); }
function res(sid) { return results[sid] || (results[sid] = {}); }
function rec(sid, i) { const r = res(sid); return r[i] || (r[i] = { solved: false, stars: 0, hintUsed: false }); }
function testAllSolved(id) { const m = metaOf(id); const r = results[id + ':test']; return m.test.every((_, i) => r && r[i] && r[i].solved); }
function allColourBelts() { return LMETA.every((m) => testAllSolved(m.id)); }
function beltEarned(id) { if (id === 'black') return allColourBelts() && testAllSolved('black'); return testAllSolved(id); }

/* ===== scoring ===== */
function totalBlocks() { return countList(program) + (allowCombo ? countList(comboBody) : 0); }
function starsFor(used, par, hintUsed) {
  if (par == null) return 3;
  let r = used <= par ? 3 : (used <= par + Math.max(3, Math.round(par * 0.6)) ? 2 : 1);
  if (hintUsed) r = Math.min(r, 2);
  return r;
}
function starify(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }

/* ===== complexity race panel ===== */
function raceRow(lab, cls, frac, num) {
  const pct = Math.max(2, Math.round(frac * 100));
  return `<div class="race-row"><span class="lab">${lab}</span><span class="race-bar ${cls}"><span style="width:${pct}%"></span></span><span class="num">${num}</span></div>`;
}
function renderRace(mine) {
  const panel = $('racePanel'); const def = level.def;
  if (def.race === 'searchGrowth') {
    const here = searchOnRow(def.bars, def.target);
    const rows = searchGrowth([8, 16, 32, 64]);
    const maxLin = Math.max(...rows.map((r) => r.linear), 1);
    let html = '<h3>🏁 Linear vs Binary</h3>';
    html += `<p class="sub">You found it in <b>${mine}</b> checks. A linear scan of this row needs <b>${here.linear}</b>. Watch the gap grow as the row gets bigger:</p>`;
    rows.forEach((r) => {
      html += raceRow('n=' + r.n + ' · linear', 'lin', r.linear / maxLin, r.linear);
      html += raceRow('n=' + r.n + ' · binary', 'bin', r.binary / maxLin, r.binary);
    });
    html += '<p class="race-win">Binary roughly doubles its reach for one extra check — O(log n) beating O(n).</p>';
    panel.innerHTML = html;
  } else if (def.race === 'sortCompare') {
    const c = sortCompare(def.bars);
    const max = Math.max(c.bubble, c.selection, c.insertion, 1);
    const best = Math.min(c.bubble, c.selection, c.insertion);
    const name = c.insertion === best ? 'Insertion' : (c.selection === best ? 'Selection' : 'Bubble');
    let html = '<h3>🏁 Same row, three sorts</h3>';
    html += '<p class="sub">Operations each algorithm takes on this exact row:</p>';
    html += raceRow('Bubble', 's0', c.bubble / max, c.bubble);
    html += raceRow('Selection', 's1', c.selection / max, c.selection);
    html += raceRow('Insertion', 's2', c.insertion / max, c.insertion);
    html += `<p class="race-win">Fewest here: <b>${name}</b> — the best sort depends on the data.</p>`;
    panel.innerHTML = html;
  }
  panel.style.display = '';
}

/* ===== top chrome ===== */
/**
 * The belt collection: one belt per Lesson (Yellow → Orange → Green …). Each
 * chip is greyed until every level in that Lesson is cleared, then it lights up
 * in colour and becomes clickable to view / print its certificate.
 */
function renderBeltRack() {
  const rack = $('beltRack'); rack.innerHTML = ''; rack.style.display = '';
  COURSES().forEach((course) => {
    const belt = COURSE_BELT[course.id];
    if (!belt) return;
    const earned = courseEarned(course);
    const chip = document.createElement('div');
    chip.className = 'belt-chip' + (earned ? ' earned' : '');
    chip.style.setProperty('--belt', belt.hex);
    const prog = courseProgress(course);
    const count = earned ? '' : ` · ${prog.passed}/${prog.total}`;
    chip.innerHTML = `<span class="bb">${belt.badge}</span><span class="nm">${belt.name}${count}</span>`;
    if (earned) {
      chip.style.cursor = 'pointer';
      chip.title = 'View / print your ' + belt.name + ' certificate';
      (function (id) { chip.onclick = function () { openCourseCertificate(id); }; })(course.id);
    } else {
      chip.title = `${prog.passed}/${prog.total} Lesson Tests passed — pass them all to earn the ${belt.name}`;
    }
    rack.appendChild(chip);
  });
}
function renderCourses() {
  const wrap = $('courses'); wrap.innerHTML = '';
  COURSES().forEach((c) => {
    const earned = courseEarned(c);
    const belt = COURSE_BELT[c.id];
    const b = document.createElement('button');
    b.className = 'course' + (curCourse === c.id ? ' active' : '') + (earned ? ' earned' : '');
    b.innerHTML = (belt ? `<span class="cbelt">${belt.badge}</span>` : '') + c.name;
    if (earned && belt) { b.title = belt.name + ' earned — view certificate'; }
    b.onclick = () => switchCourse(c.id);
    wrap.appendChild(b);
  });
}
function renderTabs() {
  const t = $('tabs'); t.innerHTML = '';
  const course = COURSES().find((c) => c.id === curCourse) || COURSES()[0];
  course.modules.forEach((m) => {
    const b = document.createElement('button');
    const lockedTab = m.id === 'black' && !allColourBelts();
    b.className = 'tab' + (curLesson === m.id ? ' active' : '') + (lockedTab ? ' locked' : '');
    b.textContent = m.tab + (lockedTab ? ' 🔒' : '');
    b.onclick = () => switchLesson(m.id);
    t.appendChild(b);
  });
}
function switchCourse(id) {
  curCourse = id;
  const c = COURSES().find((x) => x.id === id) || COURSES()[0];
  renderCourses();
  switchLesson(c.modules[0].id);
}
function renderSectionToggle() {
  const seg = $('sectionToggle');
  seg.style.display = isBlack() ? 'none' : 'flex';
  $('segLearn').classList.toggle('on', curSection === 'learn');
  $('segTest').classList.toggle('on', curSection === 'test');
}
function renderLevels() {
  const defs = currentDefs(); const wrap = $('levels'); wrap.innerHTML = '';
  if (locked) { return; }
  const sid = setId();
  defs.forEach((lv, i) => {
    const b = document.createElement('button');
    b.className = 'lvl-btn' + (i === curIdx ? ' active' : '');
    const r = results[sid] && results[sid][i];
    const stars = r && r.solved ? '★'.repeat(r.stars) : '';
    b.innerHTML = `<span>${lv.icon}</span><span>${lv.name}</span>` + (stars ? `<span class="star">${stars}</span>` : '');
    b.onclick = () => loadLevel(i);
    wrap.appendChild(b);
  });
}
function renderExamStrip() {
  const strip = $('examStrip');
  if (!isTest() || locked) { strip.className = 'exam-strip'; return; }
  const defs = currentDefs(); const sid = setId();
  strip.className = 'exam-strip show'; strip.innerHTML = '';
  defs.forEach((t, i) => {
    const r = results[sid] && results[sid][i];
    const done = r && r.solved;
    const p = document.createElement('div');
    p.className = 'pip' + (i === curIdx ? ' cur' : '') + (done ? ' done' : '');
    p.textContent = done ? '★'.repeat(r.stars) : (i + 1);
    p.onclick = () => loadLevel(i); strip.appendChild(p);
  });
}

/* ===== program panel ===== */
function renderAll() {
  $('programList').innerHTML = '';
  program.forEach((b, i) => $('programList').appendChild(renderBlock(b, program, i)));
  if (allowCombo) {
    $('comboCard').style.display = ''; $('comboList').innerHTML = '';
    comboBody.forEach((b, i) => $('comboList').appendChild(renderBlock(b, comboBody, i)));
  } else $('comboCard').style.display = 'none';
  if (level && level.def && level.def.interactive) renderHandlers();
}
function renderBlock(b, parentArr, idx) {
  const m = META[b.type]; const el = document.createElement('div');
  el.className = 'block ' + m.cls; el.dataset.bid = b.id;
  const ico = document.createElement('span'); ico.className = 'ico'; ico.textContent = m.ico; el.appendChild(ico);
  const lbl = document.createElement('span'); lbl.textContent = m.label; el.appendChild(lbl);
  if (b.type === 'repeat') {
    const st = document.createElement('span'); st.className = 'stepper';
    const minus = document.createElement('button'); minus.textContent = '–';
    const n = document.createElement('span'); n.className = 'n'; n.textContent = b.until ? (isArray() ? 'until ✓' : 'until ⛩️') : b.count;
    if (b.until) n.style.fontSize = '13px';
    const plus = document.createElement('button'); plus.textContent = '+';
    minus.onclick = () => { if (b.until) { b.until = false; b.count = 10; } else if (b.count > 1) { b.count--; } renderAll(); };
    plus.onclick = () => { if (b.until) { /* max */ } else if (b.count < 10) { b.count++; } else { b.until = true; } renderAll(); };
    st.append(minus, n, plus); el.appendChild(st);
  }
  const x = document.createElement('button'); x.className = 'x'; x.textContent = '✕';
  x.onclick = (e) => { e.stopPropagation(); parentArr.splice(idx, 1); renderAll(); }; el.appendChild(x);
  if (b.type === 'repeat') el.appendChild(nestZone('do this', b.body));
  if (b.type === 'if') { el.appendChild(nestZone('IF PATH', b.body, '✓')); el.appendChild(nestZone('ELSE', b.elseBody, '✗')); }
  if (b.type === 'iflow') { el.appendChild(nestZone('IF LOW', b.body, '✓')); el.appendChild(nestZone('ELSE', b.elseBody, '✗')); }
  if (b.type === 'ifmode') { el.appendChild(nestZone('IF 🔵', b.body, '🔵')); el.appendChild(nestZone('ELSE 🟠', b.elseBody, '🟠')); }
  if (b.type === 'iftaller') { el.appendChild(nestZone('IF TALLER', b.body, '📏')); el.appendChild(nestZone('ELSE', b.elseBody, '✗')); }
  if (b.type === 'ifend') { el.appendChild(nestZone('IF AT END', b.body, '🏁')); el.appendChild(nestZone('ELSE', b.elseBody, '✗')); }
  if (b.type === 'ifmatch') { el.appendChild(nestZone('IF MATCH', b.body, '🎯')); el.appendChild(nestZone('ELSE', b.elseBody, '✗')); }
  if (b.type === 'ifhigher') { el.appendChild(nestZone('IF HIGHER', b.body, '⬆️')); el.appendChild(nestZone('ELSE', b.elseBody, '✗')); }
  if (b.type === 'iflower') { el.appendChild(nestZone('IF LOWER', b.body, '⬇️')); el.appendChild(nestZone('ELSE', b.elseBody, '✗')); }
  if (b.type === 'ifshorter') { el.appendChild(nestZone('IF SHORTER', b.body, '📏')); el.appendChild(nestZone('ELSE', b.elseBody, '✗')); }
  if (b.type === 'iftallerleft') { el.appendChild(nestZone('IF TALLER LEFT', b.body, '📏')); el.appendChild(nestZone('ELSE', b.elseBody, '✗')); }
  if (b.type === 'ifmore') { el.appendChild(nestZone('IF MORE', b.body, '📥')); el.appendChild(nestZone('ELSE', b.elseBody, '✗')); }
  if (b.type === 'iffrontier') { el.appendChild(nestZone('IF FRONTIER', b.body, '📥')); el.appendChild(nestZone('ELSE', b.elseBody, '✗')); }
  return el;
}
function nestZone(label, arr, tag) {
  const nest = document.createElement('div'); nest.className = 'nest ifzone';
  const zl = document.createElement('p'); zl.className = 'zone-label';
  if (tag) zl.innerHTML = `<span class="tag">${tag}</span>${label}`; else zl.textContent = label;
  nest.appendChild(zl);
  arr.forEach((b, i) => nest.appendChild(renderBlock(b, arr, i)));
  const add = document.createElement('button'); add.className = 'add-btn add-mini'; add.textContent = '➕ add inside';
  add.onclick = () => openPalette(arr, true); nest.appendChild(add); return nest;
}
let palInside = false;
function openPalette(arr, inside) {
  if (running || locked || playing) return; pendingArr = arr; palInside = !!inside;
  const grid = $('palGrid'); grid.innerHTML = '';
  level.def.palette.forEach((type) => {
    if (type === 'combo' && palInside && arr === comboBody) return;
    const p = PAL[type]; const btn = document.createElement('button'); btn.className = 'pal-btn';
    btn.style.background = p.bg; btn.innerHTML = `<span class="pi">${p.pi}</span><span>${p.label}</span>`;
    btn.onclick = () => { addBlock(type); closePalette(); }; grid.appendChild(btn);
  });
  $('scrim').classList.add('show');
}
function closePalette() { $('scrim').classList.remove('show'); pendingArr = null; }
const COND_TYPES = ['if', 'iflow', 'ifmode', 'iftaller', 'ifend', 'ifmatch', 'ifhigher', 'iflower', 'ifshorter', 'iftallerleft', 'ifmore', 'iffrontier'];
function addBlock(type) {
  const b = { id: nid(), type };
  if (type === 'repeat') { b.count = 3; b.body = []; }
  if (COND_TYPES.indexOf(type) >= 0) { b.body = []; b.elseBody = []; }
  pendingArr.push(b); renderAll();
}

/* ===== canvas wrappers (engine draws; UI owns the HUD text) ===== */
function tileSize() { return gridTileSize(level); }
function fitCanvas() {
  if (isGraph()) { fitGraphCanvas(stage, level); }
  else if (isStruct()) { fitStructCanvas(stage, level); }
  else if (isArray()) { fitArrayCanvas(stage, level); }
  else { gridFit(stage, level); }
}
function updateHud(f) {
  if (level.hasEnergy) { const h = $('hud'); h.style.display = ''; h.textContent = '🔋 Energy ' + f.energy; h.classList.toggle('low', f.energy <= 2); }
  if (level.def.shortest) { $('steps').style.display = ''; $('steps').textContent = '👣 ' + (f.moves || 0) + '   best ' + level.optimal; }
}
function drawFrame(f) {
  if (isGraph()) {
    drawGraphFrame(ctx, level, f);
    $('steps').textContent = '👣 visited: ' + (f.order ? f.order.length : 0) + '/' + level.n;
    return;
  }
  if (isStruct()) {
    drawStructFrame(ctx, level, f);
    $('steps').textContent = '🪙 moves: ' + (f.ops || 0);
    return;
  }
  if (isArray()) {
    drawArrayFrame(ctx, level, f);
    $('steps').textContent = (level.goal === 'sort' ? '⇄ swaps: ' : '🔍 checks: ') + (f.ops || 0);
    return;
  }
  gridDrawFrame(ctx, level, f); updateHud(f);
}
function floodMax() { return gridFloodMax(level); }
function drawFloodUpto(layer) { gridFlood(ctx, level, layer); }
function clearFlood() { floodActive = false; if (floodTimer) { clearInterval(floodTimer); floodTimer = null; } }
function toggleFlood() {
  if (running || playing) return;
  if (floodActive) { clearFlood(); drawFrame(frames[0]); $('floodBtn').textContent = '🌊 Show the flood'; return; }
  floodActive = true; $('floodBtn').textContent = '🌊 Hide the flood';
  const maxD = floodMax(); let layer = 0; drawFloodUpto(0);
  floodTimer = setInterval(() => { layer++; drawFloodUpto(layer); if (layer >= maxD) { clearInterval(floodTimer); floodTimer = null; } }, 170);
}

/* ===== run / playback ===== */
function setRunning(on) {
  running = on; $('runBtn').disabled = on; $('clearBtn').disabled = on;
  document.querySelectorAll('.add-btn,.block .x,.stepper button').forEach((b) => b.style.pointerEvents = on ? 'none' : '');
}
function highlight(id) {
  document.querySelectorAll('.block.active').forEach((e) => e.classList.remove('active'));
  if (id) { const el = document.querySelector(`[data-bid="${id}"]`); if (el) el.classList.add('active'); }
}
function runProgram() {
  if (running || locked) return;
  clearFlood(); if ($('floodBtn')) $('floodBtn').textContent = '🌊 Show the flood';
  if (countList(program) === 0) { showResult('Add some steps first 🦊', null, false); return; }
  const sim = isGraph() ? runGraph(program, comboBody, level) : isStruct() ? runStructures(program, comboBody, level) : isArray() ? runArray(program, comboBody, level) : run(program, comboBody, level); frames = sim.frames; setRunning(true); $('result').textContent = '';
  let i = 0; drawFrame(frames[0]);
  playTimer = setInterval(() => {
    i++;
    if (i >= frames.length) { clearInterval(playTimer); setRunning(false); highlight(null); finish(sim.outcome); return; }
    drawFrame(frames[i]); highlight(frames[i].id);
  }, 360);
}
function finish(outcome) {
  if (demoMode) {
    highlight(null);
    if (demoChainData && demoChainIdx < demoChainData.length - 1) {
      const step = demoChainData[demoChainIdx];
      const r = $('result'); r.className = 'result ' + (outcome.win ? 'ok' : 'bad');
      r.innerHTML = '<span>' + (step.after || '') + '</span>';
      demoChainIdx++;
      setTimeout(function () { if (!demoMode) return; frames = [initialFrame()]; drawFrame(frames[0]); runDemoStep(); }, 2000);
      return;
    }
    const last = demoChainData ? demoChainData[demoChainIdx] : null;
    const msg = (last && last.after) || level.def.demoMsg ||
      'That’s the idea — look at the steps and the path. When you’re ready, clear it and try yourself. 🦊';
    demoMode = false; demoChainData = null;
    const r = $('result'); r.className = 'result';
    r.innerHTML = '<span>' + msg + '</span>';
    const btn = document.createElement('button'); btn.className = 'btn clear'; btn.textContent = '🗑 Let me try';
    btn.onclick = () => { clearCode(); frames = [initialFrame()]; drawFrame(frames[0]); $('result').innerHTML = ''; };
    r.appendChild(btn);
    return;
  }
  if (!outcome.win) {
    if (outcome.reason === 'bonk') showResult('Ouch — your fox hit a wall. Check that step. 💥', null, false);
    else if (outcome.reason === 'noenergy') showResult('Out of energy! 😵 Grab a battery sooner, or use fewer steps.', null, false);
    else if (outcome.reason === 'toolong') showResult('That ran forever. Try fewer repeats. 🔁', null, false);
    else if (outcome.reason === 'wrong') showResult('That’s not the one — check it matches before you Pick. ✋', null, false);
    else if (isArray()) showResult('Not done yet — keep going until it’s solved.', null, false);
    else showResult('Not there yet — reach the gate and grab every gem.', null, false);
    return;
  }
  if (level.def.shortest) {
    const moves = outcome.moves, opt = level.optimal, sid = setId();
    if (moves > opt) { showResult(`Reached the gate in ${moves} steps — but the shortest is ${opt}. Find a shorter way!`, null, false); return; }
    const r = rec(sid, curIdx); r.solved = true; r.stars = 3;
    if (isTest()) { renderLevels(); renderExamStrip(); renderBeltRack(); renderTabs(); showResult('Shortest path! ', starify(3), true, 3, true); }
    else { renderLevels(); showResult('Shortest path! ', starify(3), true, 3); }
    checkCourseBelt();
    return;
  }
  // Budget challenge: it sorted, but did it pick the right sort for this data?
  if (isArray() && level.def.maxOps && level.goal === 'sort' && outcome.moves > level.def.maxOps) {
    showResult(`Sorted — but in ${outcome.moves} moves, and the budget is ${level.def.maxOps}. That sort does too much work on THIS row. Look at the order and pick a leaner one. 🧠`, null, false);
    return;
  }
  if (level.def.race) renderRace(outcome.moves);
  const used = totalBlocks(), par = level.def.par, sid = setId();
  if (isTest()) {
    const r = rec(sid, curIdx);
    const stars = starsFor(used, par, r.hintUsed);
    r.solved = true; r.stars = Math.max(r.stars, stars);
    renderLevels(); renderExamStrip(); renderBeltRack(); renderTabs();
    showResult('Test passed! ', starify(stars), true, stars, true);
  } else {
    const r = rec(sid, curIdx);
    const stars = starsFor(used, par, !!r.shown);
    r.solved = true; r.stars = Math.max(r.stars, stars);
    renderLevels();
    showResult('Solved! ', starify(stars), true, stars);
  }
  checkCourseBelt();
}
function showResult(text, stars, ok, starCount, examMode) {
  const r = $('result'); r.className = 'result pop ' + (ok ? 'ok' : 'bad');
  r.innerHTML = (stars ? `<span class="stars">${stars}</span>` : '') + `<span>${text}</span>`;
  if (ok && examMode) {
    const defs = currentDefs(), sid = setId();
    const allSolved = defs.every((_, i) => results[sid] && results[sid][i] && results[sid][i].solved);
    const isLast = curIdx === defs.length - 1;
    const btn = document.createElement('button'); btn.className = 'btn ' + (allSolved ? 'belt' : 'next');
    const finishLabel = BELTS_ACTIVE ? '🥋 Get your belt' : '🎉 Finish lesson';
    btn.textContent = allSolved ? finishLabel : (isLast ? finishLabel : 'Next test ▶');
    btn.onclick = () => { if (allSolved || isLast) showBelt(curLesson); else loadLevel(curIdx + 1); };
    r.appendChild(btn);
  }
  if (ok) saveProgress();
  speak(ok ? (text.replace(/[🦊]/g, '') + (starCount ? ` ${starCount} ${starCount === 1 ? 'star' : 'stars'}.` : '')) : text.replace(/[💥🔁🦊😵]/g, ''));
  setTimeout(() => r.classList.remove('pop'), 500);
}

/* ===== belt award ===== */
function showBelt(lessonId) {
  const m = metaOf(lessonId); const sid = lessonId + ':test';
  let total = 0, solved = 0;
  m.test.forEach((_, i) => { const rr = results[sid] && results[sid][i]; if (rr && rr.solved) { total += rr.stars; solved++; } });

  // Belts off: a plain "lesson complete" panel — no belt badge, no certificate.
  if (!BELTS_ACTIVE) {
    beltScrimLesson = lessonId;
    $('certBtn').style.display = 'none';
    $('beltBadge').textContent = '🎉';
    $('beltBadge').style.filter = 'none';
    $('beltName').textContent = 'Lesson complete!';
    $('beltSub').textContent = `${solved}/${m.test.length} tests passed · ${total}/${m.test.length * 3} stars`;
    const rows = $('beltRows'); rows.innerHTML = '';
    m.test.forEach((t, i) => { const rr = results[sid] && results[sid][i]; const div = document.createElement('div'); div.className = 'belt-row'; div.innerHTML = `<span>${t.title}</span><span class="s">${rr && rr.solved ? starify(rr.stars) : '—'}</span>`; rows.appendChild(div); });
    $('beltUnlock').style.display = 'none';
    $('continueBtn').textContent = 'Continue ▶';
    $('beltScrim').classList.add('show');
    speak('Lesson complete. ' + solved + ' of ' + m.test.length + ' tests passed.');
    return;
  }

  const got = beltEarned(lessonId);
  if (got && !beltDates[lessonId]) { beltDates[lessonId] = new Date().toISOString().slice(0, 10); saveDates(); }
  $('certBtn').style.display = (got && CERT_BELTS.has(lessonId)) ? '' : 'none';
  $('beltBadge').textContent = m.belt.badge;
  $('beltBadge').style.filter = got ? 'none' : 'grayscale(1) opacity(.5)';
  $('beltName').textContent = got ? (m.belt.name + ' earned!') : m.belt.name;
  $('beltSub').textContent = `${solved}/${m.test.length} tests passed · ${total}/${m.test.length * 3} stars`;
  const rows = $('beltRows'); rows.innerHTML = '';
  m.test.forEach((t, i) => { const rr = results[sid] && results[sid][i]; const div = document.createElement('div'); div.className = 'belt-row'; div.innerHTML = `<span>${t.title}</span><span class="s">${rr && rr.solved ? starify(rr.stars) : '—'}</span>`; rows.appendChild(div); });
  const un = $('beltUnlock');
  if (lessonId !== 'black' && allColourBelts() && !beltEarned('black')) { un.style.display = ''; un.textContent = '🥋 Black Belt grading unlocked!'; }
  else un.style.display = 'none';
  $('continueBtn').textContent = lessonId === 'black' ? '📚 Back to start' : 'Continue ▶';
  beltScrimLesson = lessonId;
  $('beltScrim').classList.add('show');
  speak((got ? 'Belt earned! ' : '') + m.belt.name + '. ' + solved + ' of ' + m.test.length + ' tests passed.');
}

/* ===== course belts ===== */
let courseBeltShown = '';
/** After any solve, if the current course just got fully completed, award its belt. */
function checkCourseBelt() {
  const course = COURSES().find((c) => c.id === curCourse);
  if (!course || !COURSE_BELT[course.id]) return;
  if (!courseEarned(course)) return;
  renderCourses(); renderBeltRack();
  if (beltDates[course.id]) return; // already awarded in a previous session
  showCourseBelt(course.id);
}
function showCourseBelt(courseId) {
  const course = COURSES().find((c) => c.id === courseId);
  const belt = COURSE_BELT[courseId];
  if (!beltDates[courseId]) { beltDates[courseId] = new Date().toISOString().slice(0, 10); saveDates(); }
  beltScrimLesson = courseId;
  $('beltBadge').textContent = belt.badge;
  $('beltBadge').style.filter = 'none';
  $('beltName').textContent = belt.name + ' earned!';
  $('beltSub').textContent = course.name + ' complete — every level cleared.';
  const rows = $('beltRows'); rows.innerHTML = '';
  course.modules.forEach((m) => { const div = document.createElement('div'); div.className = 'belt-row'; div.innerHTML = `<span>${m.tab}</span><span class="s">✓</span>`; rows.appendChild(div); });
  $('beltUnlock').style.display = 'none';
  $('retakeBtn').style.display = 'none';
  $('certBtn').style.display = ''; $('certBtn').onclick = () => { openCourseCertificate(courseId); };
  $('continueBtn').textContent = 'Continue ▶'; $('continueBtn').onclick = () => { $('beltScrim').classList.remove('show'); };
  $('beltScrim').classList.add('show');
  speak(belt.name + ' earned! ' + course.name + ' complete.');
}

/* ===== misc ===== */
function speak(t) { try { if (!('speechSynthesis' in window)) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.rate = 0.96; u.pitch = 1; speechSynthesis.speak(u); } catch (e) {} }
function initialFrame() {
  if (isGraph()) return graphInitialFrame(level);
  if (isStruct()) return structInitialFrame(level);
  if (isArray()) return arrayInitialFrame(level);
  return { x: level.sx, y: level.sy, dir: level.sdir, gems: [], batt: [...level.batteries.keys()], energy: level.startEnergy, mode: 0, id: null, ev: 'start' };
}
function resetStage() {
  if (locked) return;
  stopAudio(); demoMode = false;
  if (isRace()) { stopRace(); raceTick = 0; drawRace(ctx, level.def, raceLanes, 0); $('result').innerHTML = ''; return; }
  if (level.def.interactive) { stopPlay(); return; }
  if (running) return; clearInterval(playTimer); setRunning(false); highlight(null);
  clearFlood(); if ($('floodBtn')) $('floodBtn').textContent = '🌊 Show the flood';
  $('result').innerHTML = ''; drawFrame(frames[0]);
}
function clearCode() {
  if (locked || running || playing) return;
  if (level.def.interactive) { handlers = { up: [], down: [], left: [], right: [], charge: [] }; renderHandlers(); $('result').innerHTML = ''; return; }
  program = []; renderAll(); $('result').innerHTML = '';
}

/* ===== interactive play (Lesson 4) ===== */
const EV_LABEL = { up: 'WHEN ⬆️ pressed', down: 'WHEN ⬇️ pressed', left: 'WHEN ⬅️ pressed', right: 'WHEN ➡️ pressed', charge: 'WHEN ⚡ pressed' };
const EV_KEY = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️', charge: '⚡' };
function renderHandlers() {
  const wrap = $('handlersWrap'); wrap.innerHTML = '';
  const evs = ['up', 'down', 'left', 'right']; if (level.hasEnergy) evs.push('charge');
  evs.forEach((ev) => {
    const card = document.createElement('div'); card.className = 'handler-card';
    const head = document.createElement('div'); head.className = 'ev';
    head.innerHTML = `<span class="key">${EV_KEY[ev]}</span><span>${EV_LABEL[ev]}</span>`;
    card.appendChild(head);
    handlers[ev].forEach((b, i) => card.appendChild(renderBlock(b, handlers[ev], i)));
    if (!playing) {
      const add = document.createElement('button'); add.className = 'add-btn'; add.textContent = '➕ add action';
      add.onclick = () => openPalette(handlers[ev], false); card.appendChild(add);
    }
    wrap.appendChild(card);
  });
}
function drawLive() { drawFrame({ x: live.x, y: live.y, dir: live.dir, gems: [...live.gems], batt: [], energy: live.energy, mode: 0, moves: 0, id: null, ev: null }); }
function fireEvent(ev) {
  if (!playing || !level || !level.def.interactive) return;
  applyEvent(level, handlers, live, ev);
  drawLive(); if (live.won) finishInteractive();
}
function autoDrive(seq) {
  let i = 0;
  const t = setInterval(() => {
    if (i >= seq.length || !playing) { clearInterval(t); return; }
    fireEvent(seq[i]); i++;
    if (live && live.won) clearInterval(t);
  }, 480);
}
function startPlay() {
  if (playing) return; playing = true;
  live = initLive(level);
  $('runBtn').textContent = '⏹ Stop'; $('dpad').style.display = 'flex'; renderHandlers(); drawLive();
  $('result').className = 'result'; $('result').innerHTML = '<span>Drive! Use the arrow keys or the pad below.</span>';
}
function stopPlay() {
  playing = false; demoMode = false; $('runBtn').textContent = '▶ Play'; $('dpad').style.display = 'none';
  live = initLive(level);
  renderHandlers(); drawLive(); $('result').innerHTML = '';
}
function finishInteractive() {
  if (demoMode) {
    demoMode = false; playing = false; $('dpad').style.display = 'none'; $('runBtn').textContent = '▶ Play';
    renderHandlers();
    const r = $('result'); r.className = 'result';
    r.innerHTML = '<span>That’s the idea — see how the keys were wired and how the fox got there. When you’re ready, clear it and try yourself. 🦊</span>';
    const btn = document.createElement('button'); btn.className = 'btn clear'; btn.textContent = '🗑 Let me try';
    btn.onclick = () => { clearCode(); live = initLive(level); drawLive(); $('result').innerHTML = ''; };
    r.appendChild(btn);
    return;
  }
  playing = false; $('dpad').style.display = 'none'; $('runBtn').textContent = '▶ Play'; renderHandlers();
  const par = level.def.par, sid = setId(); const r = rec(sid, curIdx);
  let stars = starsFor(0, par, r.hintUsed); if (r.shown) stars = Math.min(stars, 2);
  r.solved = true; r.stars = Math.max(r.stars, stars);
  if (isTest()) { renderLevels(); renderExamStrip(); renderBeltRack(); renderTabs(); showResult('Level complete! ', starify(stars), true, stars, true); }
  else { renderLevels(); showResult('Level complete! ', starify(stars), true, stars); }
  checkCourseBelt();
}
function mainAction() {
  if (locked) return;
  if (isRace()) { raceTimer ? stopRace() : playRace(); return; }
  if (level.def.interactive) { playing ? stopPlay() : startPlay(); } else runProgram();
}

/* ===== live parallel race ===== */
function setupRace() {
  $('progEditor').style.display = 'none'; $('handlersWrap').style.display = 'none';
  $('codeHead').textContent = 'The race'; $('runBtn').textContent = '🏁 Race'; $('runBtn').disabled = false;
  $('par').textContent = 'Press Race — same row, every algorithm at once';
  $('demoBtn').style.display = 'none'; $('floodBtn').style.display = 'none';
  $('steps').style.display = 'none'; $('hud').style.display = 'none';
  raceLanes = buildLanes(level.def); raceTick = 0; stopRace();
  fitRaceCanvas(stage, level.def, raceLanes);
  drawRace(ctx, level.def, raceLanes, 0);
}
function stopRace() { if (raceTimer) { clearInterval(raceTimer); raceTimer = null; } if (level && isRace()) $('runBtn').textContent = '🏁 Race'; }
function playRace() {
  if (raceTimer) return;
  raceTick = 0; $('runBtn').textContent = '⏹ Stop';
  raceTimer = setInterval(() => {
    raceTick++;
    const st = drawRace(ctx, level.def, raceLanes, raceTick);
    if (st.allDone) { stopRace(); raceFinish(); }
  }, 150);
}
function raceFinish() {
  const winner = raceWinner(raceLanes);
  const summary = raceLanes.map((l) => `${l.name} ${l.frames[l.frames.length - 1].ops}`).join(' · ');
  const r = rec(setId(), curIdx); r.solved = true; r.stars = Math.max(r.stars || 0, 3);
  renderLevels(); if (isTest()) renderExamStrip();
  showResult(`🏁 ${winner} finished first! (ops: ${summary})`, '★★★', true, 3, isTest());
  checkCourseBelt();
}

/* ===== Show me — auto demo + recorded audio ===== */
function stopAudio() { try { if (lessonAudio) { lessonAudio.pause(); } } catch (e) {} try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {} }
function showMe() {
  if (running || locked) return;
  const def = level.def;
  stopAudio();
  if (def.shortest) { if (!floodActive) toggleFlood(); return; }
  if (!def.demoFail) rec(setId(), curIdx).shown = true;
  if (def.interactive) {
    if (playing) stopPlay();
    handlers = { up: [], down: [], left: [], right: [], charge: [] };
    if (def.demoHandlers) { const h = buildHandlers(def.demoHandlers); for (const key in h) handlers[key] = h[key]; }
    renderHandlers(); demoMode = true; startPlay();
    if (def.demoSeq) autoDrive(def.demoSeq.slice());
    return;
  }
  if (def.demoChain) { demoChainData = def.demoChain; demoChainIdx = 0; demoMode = true; runDemoStep(); return; }
  if (def.demo) {
    demoMode = true; demoChainData = null;
    program = buildProgram(def.demo);
    comboBody = def.demoCombo ? buildProgram(def.demoCombo) : [];
    renderAll(); runProgram();
  }
}
function runDemoStep() {
  const step = demoChainData[demoChainIdx];
  program = buildProgram(step.spec);
  comboBody = step.combo ? buildProgram(step.combo) : [];
  renderAll(); runProgram();
}

/* ===== lesson audio player (play / pause / progress) ===== */
const lessonAudio = new Audio(); lessonAudio.preload = 'metadata'; let audioReady = false;
function fmtTime(t) { if (!isFinite(t) || t < 0) t = 0; t = Math.floor(t); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); }
function audioOnThisLevel() { return !isBlack() && !isTest(); }
function refreshAudioBar() {
  const show = audioOnThisLevel();
  $('audioBar').style.display = show ? '' : 'none';
  if (!show) return;
  $('audioPlay').disabled = !audioReady;
  $('audioBar').classList.toggle('audio-off', !audioReady);
  $('audioLabel').textContent = audioReady ? '🎧 Lesson' : '🎧 add ' + audioName(curLesson) + '.mp3';
}
/** The audio filename for a module — a readable slug, falling back to the id. */
function audioName(lessonId) { const m = metaOf(lessonId); return (m && m.audio) || lessonId; }
function setupAudioFor(lessonId) {
  const name = audioName(lessonId);
  if (lessonAudio.getAttribute('data-lesson') === name) return;
  try { lessonAudio.pause(); } catch (e) {}
  audioReady = false;
  $('audioPlay').textContent = '▶'; $('audioFill').style.width = '0%'; $('audioTime').textContent = '0:00';
  lessonAudio.setAttribute('data-lesson', name);
  lessonAudio.src = 'dojo-audio/' + name + '.mp3';
  lessonAudio.load();
}

/* ===== load / switch ===== */
function loadLevel(i) {
  stopAudio(); demoMode = false; demoChainData = null; stopRace();
  if (running) { clearInterval(playTimer); setRunning(false); }
  playing = false; $('dpad').style.display = 'none';
  locked = false;
  curIdx = i; const def = currentDefs()[i];
  level = (def.world === 'graph') ? parseGraph(def)
    : (def.world === 'structures') ? parseStruct(def)
    : (def.world === 'array') ? parseArray(def) : parseLevel(def);
  program = []; comboBody = []; allowCombo = !!def.combo;
  handlers = { up: [], down: [], left: [], right: [], charge: [] };
  $('missionTitle').textContent = def.title;
  $('missionText').textContent = def.text;
  if (isBlack()) $('conceptTag').textContent = '🥋 Black Belt Grading — everything you’ve learned';
  else if (isTest()) $('conceptTag').textContent = BELTS_ACTIVE
    ? '🎓 ' + metaOf(curLesson).belt.name + ' Test — pick your own tools'
    : '🎓 Lesson Test — pick your own tools';
  else $('conceptTag').textContent = def.concept;
  $('sandboxHint').style.display = def.sandbox ? '' : 'none';
  { const ld = $('lessonDiagram'); if (def.diagram) { ld.innerHTML = def.diagram; ld.style.display = ''; } else { ld.innerHTML = ''; ld.style.display = 'none'; } }
  if (isBlack() || isTest()) { try { lessonAudio.pause(); } catch (e) {} $('audioPlay').textContent = '▶'; $('audioBar').style.display = 'none'; }
  else { setupAudioFor(curLesson); refreshAudioBar(); }
  $('hud').style.display = def.energy != null ? '' : 'none';
  const hb = $('hintBtn'), ht = $('hintText');
  if (def.hint) { hb.style.display = ''; ht.className = 'hint-text'; ht.textContent = ''; rec(setId(), i); hb.disabled = false; hb.textContent = '💡 Hint'; }
  else { hb.style.display = 'none'; ht.className = 'hint-text'; }
  if (def.interactive) {
    $('progEditor').style.display = 'none'; $('handlersWrap').style.display = '';
    $('codeHead').textContent = 'Your controls'; $('runBtn').textContent = '▶ Play';
    $('par').textContent = 'Wire the controls, then Play';
    renderHandlers();
  } else {
    $('progEditor').style.display = ''; $('handlersWrap').style.display = 'none';
    $('codeHead').textContent = 'Your code'; $('runBtn').textContent = '▶ Run';
    $('par').textContent = def.par != null ? `Target: ${def.par} blocks for ★★★` : 'Free build';
    renderAll();
  }
  clearFlood();
  if (def.shortest) {
    level.dist = bfsDist(level); level.optimal = level.dist[level.gy][level.gx];
    $('par').textContent = 'Best possible: ' + level.optimal + ' steps';
    $('floodBtn').style.display = isTest() ? 'none' : ''; $('floodBtn').textContent = '🌊 Show the flood';
    $('steps').style.display = '';
  } else { $('floodBtn').style.display = 'none'; $('steps').style.display = 'none'; }
  if (isArray()) { $('steps').style.display = ''; $('steps').textContent = (level.goal === 'sort' ? '⇄ swaps: 0' : '🔍 checks: 0'); }
  if (isStruct()) { $('steps').style.display = ''; $('steps').textContent = '🪙 moves: 0'; }
  if (isGraph()) { $('steps').style.display = ''; $('steps').textContent = '👣 visited: 0/' + level.n; }
  if (isArray() && def.maxOps) { $('par').textContent = 'Budget: ≤ ' + def.maxOps + ' moves'; }
  const hasDemo = !!(def.demo || def.demoChain || def.demoHandlers || def.shortest);
  $('demoBtn').style.display = (hasDemo && !isBlack() && !isTest() && !def.sandbox) ? '' : 'none';
  renderExamStrip(); fitCanvas();
  frames = [initialFrame()]; drawFrame(frames[0]);
  $('result').innerHTML = '';
  $('racePanel').style.display = 'none'; $('racePanel').innerHTML = '';
  $('runBtn').disabled = false; $('clearBtn').disabled = false;
  renderLevels();
  if (isRace()) setupRace();
}
function loadLocked() {
  locked = true; playing = false;
  $('progEditor').style.display = ''; $('handlersWrap').style.display = 'none'; $('dpad').style.display = 'none';
  $('missionTitle').textContent = 'Black Belt — locked';
  $('missionText').textContent = 'Earn the Yellow Belt (Lesson 1) and the Orange Belt (Lesson 2) first. Pass every belt test, then come back for the final grading.';
  $('conceptTag').textContent = '🔒 Locked';
  $('hintBtn').style.display = 'none'; $('hintText').className = 'hint-text';
  $('hud').style.display = 'none'; $('sandboxHint').style.display = 'none';
  $('examStrip').className = 'exam-strip';
  $('levels').innerHTML = ''; $('programList').innerHTML = ''; $('comboCard').style.display = 'none';
  $('par').textContent = ''; $('result').innerHTML = '';
  $('runBtn').disabled = true; $('clearBtn').disabled = true;
  stage.width = 300; stage.height = 140; ctx.clearRect(0, 0, stage.width, stage.height);
  ctx.fillStyle = '#7c6a4a'; ctx.font = '64px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🔒', 150, 70);
}
function switchLesson(id) {
  if (running) { clearInterval(playTimer); setRunning(false); }
  const c = courseOf(id); if (c) curCourse = c.id;
  curLesson = id; curSection = (id === 'black') ? 'test' : 'learn';
  renderCourses(); renderTabs(); renderSectionToggle(); renderBeltRack();
  if (isBlack() && !allColourBelts()) { loadLocked(); renderLevels(); }
  else loadLevel(0);
}
function switchSection(sec) {
  if (isBlack()) return;
  curSection = sec; renderSectionToggle(); loadLevel(0);
}

/* ===== progress persistence ===== */
function saveProgress() { try { localStorage.setItem('codeDojo.v1', JSON.stringify(results)); } catch (e) {} }
function loadProgress() { try { const s = localStorage.getItem('codeDojo.v1'); if (s) { const o = JSON.parse(s); Object.keys(o).forEach((k) => { results[k] = o[k]; }); } } catch (e) {} }
function resetProgress() {
  try { localStorage.removeItem('codeDojo.v1'); } catch (e) {}
  Object.keys(results).forEach((k) => delete results[k]);
  renderBeltRack(); renderTabs(); switchLesson('l1');
}

/* ===== bootstrap ===== */
export function init() {
  stage = $('stage'); ctx = stage.getContext('2d');

  // sandbox tile editing
  stage.addEventListener('click', (e) => {
    if (locked || !level.def.sandbox || running) return;
    const T = tileSize(), rect = stage.getBoundingClientRect(), sc = stage.width / rect.width;
    const x = Math.floor((e.clientX - rect.left) * sc / T), y = Math.floor((e.clientY - rect.top) * sc / T);
    if (x < 0 || y < 0 || x >= level.W || y >= level.H) return;
    if ((x === level.sx && y === level.sy) || (x === level.gx && y === level.gy) || level.gems.has(x + ',' + y)) return;
    level.walls[y][x] = !level.walls[y][x]; frames = [initialFrame()]; drawFrame(frames[0]);
  });

  // lesson audio events
  lessonAudio.addEventListener('loadedmetadata', () => { audioReady = true; $('audioTime').textContent = '0:00 / ' + fmtTime(lessonAudio.duration); refreshAudioBar(); });
  lessonAudio.addEventListener('error', () => { audioReady = false; refreshAudioBar(); });
  lessonAudio.addEventListener('timeupdate', () => { const d = lessonAudio.duration || 0, c = lessonAudio.currentTime || 0; $('audioFill').style.width = (d ? (c / d * 100) : 0) + '%'; $('audioTime').textContent = fmtTime(c) + ' / ' + fmtTime(d); });
  lessonAudio.addEventListener('ended', () => { $('audioPlay').textContent = '▶'; });
  $('audioPlay').onclick = () => { if (!audioReady) return; if (lessonAudio.paused) { lessonAudio.play().then(() => { $('audioPlay').textContent = '⏸'; }).catch(() => {}); } else { lessonAudio.pause(); $('audioPlay').textContent = '▶'; } };
  $('audioTrack').onclick = (e) => { if (!audioReady) return; const r = $('audioTrack').getBoundingClientRect(); const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); if (isFinite(lessonAudio.duration)) lessonAudio.currentTime = ratio * lessonAudio.duration; };

  // controls
  $('segLearn').onclick = () => switchSection('learn');
  $('segTest').onclick = () => switchSection('test');
  $('addMain').onclick = () => openPalette(program, false);
  $('addCombo').onclick = () => openPalette(comboBody, true);
  $('runBtn').onclick = mainAction;
  $('resetBtn').onclick = resetStage;
  $('clearBtn').onclick = clearCode;
  $('floodBtn').onclick = toggleFlood;
  $('demoBtn').onclick = showMe;
  document.addEventListener('keydown', (e) => {
    if (!playing || !level || !level.def.interactive) return;
    const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', ' ': 'charge' };
    const ev = map[e.key]; if (ev) { e.preventDefault(); fireEvent(ev); }
  });
  document.querySelectorAll('.dpad button').forEach((b) => b.onclick = () => fireEvent(b.dataset.ev));
  $('palCancel').onclick = closePalette;
  $('scrim').onclick = (e) => { if (e.target === $('scrim')) closePalette(); };
  $('readBtn').onclick = () => { if (locked) { speak('Black belt locked. Earn the other belts first.'); return; } speak(level.def.title + '. ' + level.def.text + (!isTest() ? (' ' + level.def.concept) : '')); };
  $('hintBtn').onclick = () => {
    if (!level.def.hint) return;
    if (isTest()) rec(setId(), curIdx).hintUsed = true;
    $('hintText').textContent = '💡 ' + level.def.hint + (isTest() ? '  (using a hint caps this test at ★★)' : '');
    $('hintText').className = 'hint-text show'; $('hintBtn').disabled = true; speak(level.def.hint);
  };
  $('retakeBtn').onclick = () => {
    const id = beltScrimLesson; results[id + ':test'] = {}; saveProgress();
    $('beltScrim').classList.remove('show'); renderBeltRack(); renderTabs();
    curLesson = id; curSection = 'test'; renderSectionToggle();
    if (isBlack() && !allColourBelts()) { loadLocked(); renderLevels(); } else loadLevel(0);
  };
  $('continueBtn').onclick = () => {
    const id = beltScrimLesson; $('beltScrim').classList.remove('show');
    if (BELTS_ACTIVE) {
      if (id === 'black') { switchLesson('l1'); return; }
      const ai = ARRAY_LESSONS.findIndex((m) => m.id === id);
      if (ai >= 0) { switchLesson(ai + 1 < ARRAY_LESSONS.length ? ARRAY_LESSONS[ai + 1].id : id); return; }
      const idx = LMETA.findIndex((m) => m.id === id);
      if (allColourBelts()) { switchLesson('black'); }
      else if (idx + 1 < LMETA.length) { switchLesson(LMETA[idx + 1].id); }
      else { switchLesson(id); }
      return;
    }
    // Belts off: just advance through the visible lesson order.
    const order = ALL_LESSONS();
    const idx = order.findIndex((m) => m.id === id);
    switchLesson(idx >= 0 && idx + 1 < order.length ? order[idx + 1].id : order[0].id);
  };
  $('beltScrim').onclick = (e) => { if (e.target === $('beltScrim')) $('beltScrim').classList.remove('show'); };
  $('resetAllBtn').onclick = () => { if (confirm('Reset all belts and stars? This cannot be undone.')) resetProgress(); };

  // certificate wiring
  $('certPrintBtn').onclick = () => { window.print(); };
  $('certCloseBtn').onclick = closeCertificate;
  $('certScrim').onclick = (e) => { if (e.target === $('certScrim')) closeCertificate(); };
  $('certNameInput').oninput = function () { setPlayerName(this.value); saveName(); const el = $('certCard').querySelector('.cert-name'); if (el) el.textContent = (getPlayerName().trim() || 'Your Name'); };
  $('certBtn').onclick = () => { openCertificate(beltScrimLesson); };

  loadProgress(); loadName(); loadDates();
  // Stamp a date on any belt already earned in a previous session, so its
  // certificate has the right date and the chip shows as earned on load.
  COURSES().forEach((c) => {
    if (COURSE_BELT[c.id] && courseEarned(c) && !beltDates[c.id]) {
      beltDates[c.id] = new Date().toISOString().slice(0, 10); saveDates();
    }
  });
  renderBeltRack(); renderCourses(); renderTabs(); renderSectionToggle();
  loadLevel(0);
}
