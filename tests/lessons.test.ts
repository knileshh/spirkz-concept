import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chapterAt, lessons } from '../src/lessons.ts';

test('scrubbing to the exact end or outside the timeline keeps captions in bounds', () => {
  for (const lesson of lessons) {
    for (const time of [-1, 0, 7.99, 8, 16, 24, 31.99, 32, 33]) {
      assert.ok(
        lesson.chapters[
          chapterAt(time, lesson.duration, lesson.chapters.length)
        ],
      );
    }
    assert.equal(
      chapterAt(lesson.duration, lesson.duration, lesson.chapters.length),
      3,
    );
    assert.equal(chapterAt(8, lesson.duration, lesson.chapters.length), 1);
  }
});

test('each shipped lesson has a usable local image, source, and correct quiz answer', () => {
  for (const lesson of lessons) {
    const path = resolve('public', lesson.image.slice(1));
    assert.ok(existsSync(path), `Missing image for ${lesson.id}`);
    assert.equal(readFileSync(path).subarray(0, 2).toString('hex'), 'ffd8');
    assert.ok(lesson.answers[lesson.correct]);
    assert.equal(new URL(lesson.source).protocol, 'https:');
    assert.equal(lesson.chapters.length, 4);
  }
});

test('the static deployment includes its credits, fonts, and correct output directory', () => {
  assert.ok(existsSync('public/credits.html'));
  for (const weight of [400, 500, 600, 700, 800])
    assert.ok(existsSync(`public/fonts/manrope-${weight}.ttf`));
  assert.ok(existsSync('public/fonts/OFL.txt'));
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  assert.equal(config.framework, 'vite');
  assert.equal(config.outputDirectory, 'dist');
});
