import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(
  path.dirname(require.resolve('@remotion/cli/package.json')),
  'remotion-cli.js',
);
const out = path.join(cwd, 'out');
fs.mkdirSync(out, { recursive: true });
for (const id of ['moon', 'ocean', 'fern']) {
  const input = `../public/videos/${id}.mp4`;
  const report = JSON.parse(
    execFileSync(
      process.execPath,
      [
        cli,
        'ffprobe',
        '-v',
        'error',
        '-show_entries',
        'stream=codec_name,codec_type,width,height,r_frame_rate,duration',
        '-show_entries',
        'format=duration,size',
        '-of',
        'json',
        input,
      ],
      { cwd, encoding: 'utf8' },
    ),
  );
  const video = report.streams.find((s) => s.codec_type === 'video');
  const audio = report.streams.find((s) => s.codec_type === 'audio');
  if (
    video?.width !== 1080 ||
    video?.height !== 1920 ||
    video?.codec_name !== 'h264' ||
    video?.r_frame_rate !== '30/1' ||
    audio?.codec_name !== 'aac' ||
    !Number.isFinite(Number(audio?.duration)) ||
    Math.abs(Number(audio?.duration) - 32) > 0.15 ||
    Math.abs(Number(report.format.duration) - 32) > 0.15
  )
    throw Error(`Invalid encoding: ${id}`);
  execFileSync(
    process.execPath,
    [
      cli,
      'ffmpeg',
      '-v',
      'error',
      '-i',
      input,
      '-c:v',
      'rawvideo',
      '-c:a',
      'pcm_s16le',
      '-f',
      'null',
      '-',
    ],
    { cwd, stdio: 'pipe' },
  );
  execFileSync(
    process.execPath,
    [
      cli,
      'ffmpeg',
      '-y',
      '-ss',
      '2',
      '-i',
      input,
      '-frames:v',
      '1',
      '-q:v',
      '2',
      `../public/videos/${id}-poster.jpg`,
      '-loglevel',
      'error',
    ],
    { cwd, stdio: 'pipe' },
  );
  for (const second of [2, 10, 18, 26])
    execFileSync(
      process.execPath,
      [
        cli,
        'ffmpeg',
        '-y',
        '-ss',
        String(second),
        '-i',
        input,
        '-frames:v',
        '1',
        '-vf',
        'scale=270:480',
        `out/${id}-${second}.png`,
        '-loglevel',
        'error',
      ],
      { cwd, stdio: 'pipe' },
    );
  fs.writeFileSync(
    path.join(out, `${id}-probe.json`),
    JSON.stringify(report, null, 2),
  );
  console.log(
    `${id}: complete decode, H.264 + AAC, 1080×1920, 30 fps, ${report.format.duration}s, ${(Number(report.format.size) / 1e6).toFixed(1)} MB`,
  );
}
