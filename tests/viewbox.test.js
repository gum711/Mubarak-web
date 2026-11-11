import { test } from 'node:test';
import assert from 'node:assert/strict';
import { focusBox, coverBox, containBox, isPortrait } from '../src/viewbox.js';

const close = (a, b) => assert.ok(Math.abs(a - b) < 0.01, `${a} ≈ ${b}`);

test('every box keeps the screen aspect ratio', () => {
  for (const a of [16 / 9, 1, 0.5]) {
    for (const b of [
      focusBox({ cx: 800, cy: 300, size: 280 }, a),
      coverBox({ x: 0, y: 0, w: 1600, h: 900 }, a),
      containBox({ x: 300, y: 80, w: 1000, h: 740 }, a, 1.1),
    ]) close(b.w / b.h, a);
  }
});

test('landscape focus puts the part on the right, leaving room for the card', () => {
  const b = focusBox({ cx: 800, cy: 300, size: 280 }, 16 / 9);
  close(b.h, 350);
  close((800 - b.x) / b.w, 0.66);
  close(300 - b.y, b.h / 2);
});

test('portrait focus puts the part near the top, leaving room for the card below', () => {
  const b = focusBox({ cx: 800, cy: 300, size: 280 }, 0.5);
  close(b.w, 280 * 1.15);
  close(800 - b.x, b.w / 2);
  close((300 - b.y) / b.h, 0.3);
});

test('cover fully covers the rect; contain fully shows it', () => {
  const r = { x: 574, y: 314, w: 452, h: 242 };
  for (const a of [16 / 9, 0.5, 3]) {
    const c = coverBox(r, a);
    assert.ok(c.w <= r.w + 1e-6 && c.h <= r.h + 1e-6);
    const k = containBox(r, a, 1);
    assert.ok(k.w >= r.w - 1e-6 && k.h >= r.h - 1e-6);
  }
});

test('portrait threshold', () => {
  assert.equal(isPortrait(0.5), true);
  assert.equal(isPortrait(16 / 9), false);
});
