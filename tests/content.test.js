import { test } from 'node:test';
import assert from 'node:assert/strict';
import { profile } from '../src/content.js';

const allText = JSON.stringify(profile);

test('never mentions GPA', () => {
  assert.ok(!allText.includes('4.41'));
  assert.ok(!allText.includes('معدل'));
});

test('learning hours are +500', () => {
  assert.ok(profile.stages.some((s) => s.info.some((i) => i.includes('+500'))));
});

test('contacts match spec', () => {
  assert.deepEqual(profile.contacts, {
    email: 'mubarak_almalki@outlook.com',
    whatsapp: 'https://wa.me/966580231353',
    instagram: 'https://instagram.com/guum',
    cv: './cv.pdf',
  });
});

test('stages are in story order', () => {
  assert.deepEqual(profile.stages.map((s) => s.id), ['ram', 'storage', 'network', 'cpu']);
});

test('no home address', () => {
  assert.ok(!allText.includes('المخيم'));
  assert.ok(!allText.includes('NJMA'));
});
