import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lessons } from '../../src/lessons.ts';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const pub = path.join(root, 'video/public');
fs.mkdirSync(path.join(pub, 'voice'), { recursive: true });
fs.mkdirSync(path.join(root, 'public/videos'), { recursive: true });
for (const dir of ['images', 'fonts', 'brand'])
  fs.cpSync(path.join(root, 'public', dir), path.join(pub, dir), {
    recursive: true,
  });
fs.writeFileSync(
  path.join(pub, 'lessons.json'),
  JSON.stringify(lessons, null, 2),
);
fs.writeFileSync(
  path.join(root, 'video/src/lessons.json'),
  JSON.stringify(lessons, null, 2),
);
console.log('Prepared local photos, fonts, branding and lesson scripts.');
