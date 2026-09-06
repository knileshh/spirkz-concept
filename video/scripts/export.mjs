import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const require = createRequire(import.meta.url);
const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(
  path.dirname(require.resolve('@remotion/cli/package.json')),
  'remotion-cli.js',
);
const requested = process.argv[2];
const ids = requested ? [requested] : ['moon', 'ocean', 'fern'];
if (ids.some((id) => !['moon', 'ocean', 'fern'].includes(id)))
  throw Error('Use moon, ocean or fern.');
function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd,
    stdio: 'inherit',
  });
  if (result.status !== 0) throw Error(`Remotion ${args[0]} failed`);
}
for (const id of ids) {
  run([
    'render',
    'src/index.ts',
    id,
    `../public/videos/${id}.mp4`,
    '--codec=h264',
    '--crf=21',
    '--concurrency=2',
    '--log=error',
  ]);
  run([
    'ffmpeg',
    '-y',
    '-ss',
    '2',
    '-i',
    `../public/videos/${id}.mp4`,
    '-frames:v',
    '1',
    '-q:v',
    '2',
    `../public/videos/${id}-poster.jpg`,
    '-loglevel',
    'error',
  ]);
  console.log(`Exported ${id}: 1080×1920, 30fps, 32 seconds.`);
}
