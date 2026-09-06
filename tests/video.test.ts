import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lessons } from '../src/lessons.ts';
const seconds = (stamp: string) => {
  const [h, m, s] = stamp.split(':').map(Number);
  return h * 3600 + m * 60 + s;
};
test('every lesson ships a progressive MP4, poster and seven timed subtitle tracks', () => {
  for (const lesson of lessons) {
    const bytes = readFileSync(`public/videos/${lesson.id}.mp4`);
    assert.equal(bytes.toString('ascii', 4, 8), 'ftyp');
    assert.ok(bytes.indexOf('avc1') !== -1, `${lesson.id}: H.264 video`);
    assert.ok(
      bytes.indexOf('moov') < bytes.indexOf('mdat'),
      `${lesson.id}: metadata must precede video for progressive playback`,
    );
    assert.equal(
      readFileSync(`public/videos/${lesson.id}-poster.jpg`)
        .subarray(0, 2)
        .toString('hex'),
      'ffd8',
    );
    for (const locale of ['en', 'es', 'de', 'fr', 'ru', 'mt', 'ka']) {
      const vtt = readFileSync(
        `public/videos/${lesson.id}.${locale}.vtt`,
        'utf8',
      );
      assert.ok(/^WEBVTT\r?\n/.test(vtt));
      const cues = [
        ...vtt.matchAll(
          /(\d\d:\d\d:\d\d\.\d{3}) --> (\d\d:\d\d:\d\d\.\d{3})[^\n]*\n([^\n]+)/g,
        ),
      ];
      assert.ok(cues.length >= 4, `${lesson.id}/${locale}: missing cues`);
      let lastEnd = 0;
      const chapters = new Set<number>();
      for (const [, start, end, text] of cues) {
        const from = seconds(start),
          to = seconds(end);
        assert.ok(
          from >= lastEnd && to > from && to <= lesson.duration,
          `${lesson.id}/${locale}: overlapping or out-of-range subtitle`,
        );
        assert.ok(text.trim());
        lastEnd = to;
        chapters.add(Math.floor(from / 8));
      }
      assert.deepEqual(
        [...chapters],
        [0, 1, 2, 3],
        `${lesson.id}/${locale}: a chapter has no subtitles`,
      );
    }
  }
});
