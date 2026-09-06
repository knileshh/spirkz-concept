import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lessons } from '../../src/lessons.ts';
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const voice = JSON.parse(
  fs
    .readFileSync(path.join(root, 'video/src/voice.json'), 'utf8')
    .replace(/^\uFEFF/, ''),
);
const time = (seconds) =>
  new Date(Math.round(seconds * 1000)).toISOString().slice(11, 23);
const catalogs = Object.fromEntries(
  ['en', 'es', 'de', 'fr', 'ru', 'mt', 'ka'].map((locale) => [
    locale,
    JSON.parse(
      fs.readFileSync(path.join(root, `src/locales/${locale}.json`), 'utf8'),
    ),
  ]),
);
const captions = {};
for (const lesson of lessons) {
  for (const [locale, strings] of Object.entries(catalogs)) {
    const cues = lesson.chapters.flatMap((chapter, i) => {
      const clip = voice[lesson.id][i];
      if (locale === 'en' && clip.alignment) {
        const a = clip.alignment;
        const alignedText = a.characters.join('');
        const words = [...alignedText.matchAll(/\S+/g)];
        const cues = [];
        for (let w = 0; w < words.length; w += 7) {
          const group = words.slice(w, w + 7);
          const first = group[0].index;
          const last = group.at(-1).index + group.at(-1)[0].length - 1;
          const offset = i * 8 + 5 / 30;
          const rate = clip.playbackRate ?? 1;
          cues.push({
            text: group.map((word) => word[0]).join(' '),
            startMs:
              (offset + a.character_start_times_seconds[first] / rate) * 1000,
            endMs: (offset + a.character_end_times_seconds[last] / rate) * 1000,
            timestampMs: null,
            confidence: null,
          });
        }
        return cues;
      }
      const words = (strings[chapter.text] ?? chapter.text).split(' ');
      const chunks = [];
      for (let w = 0; w < words.length; w += 7)
        chunks.push(words.slice(w, w + 7).join(' '));
      const chars = chunks.reduce((n, s) => n + s.length, 0);
      let used = 0;
      return chunks.map((text) => {
        const start =
          i * 8 + 5 / 30 + (voice[lesson.id][i].duration * used) / chars;
        used += text.length;
        return {
          text,
          startMs: start * 1000,
          endMs:
            (i * 8 + 5 / 30 + (voice[lesson.id][i].duration * used) / chars) *
            1000,
          timestampMs: null,
          confidence: null,
        };
      });
    });
    if (locale === 'en') captions[lesson.id] = cues;
    const vtt =
      'WEBVTT\n\n' +
      cues
        .map(
          (c, i) =>
            `${i + 1}\n${time(c.startMs / 1000)} --> ${time(c.endMs / 1000)} line:80% position:50% size:82% align:center\n${c.text}\n`,
        )
        .join('\n');
    fs.writeFileSync(
      path.join(root, `public/videos/${lesson.id}.${locale}.vtt`),
      vtt,
    );
  }
}
fs.writeFileSync(
  path.join(root, 'video/src/captions.json'),
  JSON.stringify(captions, null, 2) + '\n',
);
console.log(
  'Created 21 subtitle tracks. English uses provider alignment when available; translated phrase boundaries are estimated.',
);
