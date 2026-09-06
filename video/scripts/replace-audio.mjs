import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const binaryRoot = path.dirname(
  require.resolve('@remotion/compositor-win32-x64-msvc/package.json'),
);
const run = (tool, args) =>
  execFileSync(path.join(binaryRoot, `${tool}.exe`), args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
const voice = JSON.parse(
  fs
    .readFileSync(path.join(cwd, 'src/voice.json'), 'utf8')
    .replace(/^\uFEFF/, ''),
);
const packets = (input) =>
  run('ffprobe', [
    '-v',
    'error',
    '-select_streams',
    'v',
    '-show_packets',
    '-show_data_hash',
    'sha256',
    '-show_entries',
    'packet=data_hash',
    '-of',
    'json',
    input,
  ]);
const pcmData = (wav) => {
  for (let offset = 12; offset + 8 <= wav.length; ) {
    const size = wav.readUInt32LE(offset + 4);
    if (wav.toString('ascii', offset, offset + 4) === 'data')
      return wav.subarray(offset + 8, offset + 8 + size);
    offset += 8 + size + (size % 2);
  }
  throw Error('Missing PCM');
};
fs.mkdirSync(path.join(cwd, 'out'), { recursive: true });
for (const id of ['moon', 'ocean', 'fern']) {
  const pcm = Buffer.alloc(32 * 44100 * 2);
  for (const [i, clip] of voice[id].entries()) {
    const decoded = path.join(cwd, `out/${id}-${i}-decoded.wav`);
    run('ffmpeg', [
      '-y',
      '-v',
      'error',
      '-i',
      path.join(cwd, 'public', clip.file),
      '-af',
      `atempo=${clip.playbackRate ?? 1}`,
      '-c:a',
      'pcm_s16le',
      '-ac',
      '1',
      '-ar',
      '44100',
      decoded,
    ]);
    const data = pcmData(fs.readFileSync(decoded));
    let peak = 0;
    for (let sample = 0; sample < data.length; sample += 2)
      peak = Math.max(peak, Math.abs(data.readInt16LE(sample)));
    if (peak < 1000) throw Error(`Silent source clip: ${id}/${i}`);
    const offset = Math.round((i * 8 + 5 / 30) * 44100) * 2;
    if (data.length > 7.8 * 44100 * 2)
      throw Error(`Clip exceeds scene: ${id}/${i}`);
    data.copy(pcm, offset);
  }
  const header = Buffer.alloc(44);
  header.write('RIFF');
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(44100, 24);
  header.writeUInt32LE(88200, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  const soundtrack = path.join(cwd, `out/${id}-soundtrack.wav`);
  fs.writeFileSync(soundtrack, Buffer.concat([header, pcm]));
  const input = path.join(cwd, `../public/videos/${id}.mp4`),
    output = path.join(cwd, `out/${id}-new-voice.mp4`);
  run('ffmpeg', [
    '-y',
    '-v',
    'error',
    '-i',
    input,
    '-i',
    soundtrack,
    '-map',
    '0:v:0',
    '-map',
    '1:a:0',
    '-c:v',
    'copy',
    '-c:a',
    'aac',
    '-b:a',
    '160k',
    '-t',
    '32',
    '-metadata',
    `title=Spirkz ${id} concept — elevenlabs.io`,
    '-movflags',
    '+faststart',
    output,
  ]);
  if (packets(input) !== packets(output))
    throw Error(`Video frames changed: ${id}`);
  const probe = JSON.parse(
    run('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'stream=codec_type,duration',
      '-of',
      'json',
      output,
    ]),
  );
  if (
    probe.streams.some(
      (s) =>
        !Number.isFinite(Number(s.duration)) ||
        Math.abs(Number(s.duration) - 32) > 0.15,
    )
  )
    throw Error(`Invalid stream duration: ${id}`);
  fs.copyFileSync(output, input);
  console.log(`${id}: narration embedded; all encoded video frames unchanged.`);
}
