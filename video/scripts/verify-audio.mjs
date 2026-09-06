import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const ffmpeg = './node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe';
for (const id of ['moon', 'ocean', 'fern']) {
  const file = `out/${id}-audio.wav`;
  execFileSync(ffmpeg, [
    '-y',
    '-v',
    'error',
    '-i',
    `../public/videos/${id}.mp4`,
    '-vn',
    '-c:a',
    'pcm_s16le',
    '-ac',
    '1',
    '-ar',
    '16000',
    file,
  ]);
  const wav = fs.readFileSync(file);
  let offset = 12,
    data;
  while (offset + 8 <= wav.length) {
    const size = wav.readUInt32LE(offset + 4);
    if (wav.toString('ascii', offset, offset + 4) === 'data') {
      data = wav.subarray(offset + 8, offset + 8 + size);
      break;
    }
    offset += 8 + size + (size % 2);
  }
  if (!data) throw Error('No PCM data');
  let peak = 0,
    clipped = 0,
    total = 0;
  const chapters = [0, 0, 0, 0];
  for (let i = 0; i < data.length / 2; i++) {
    const v = data.readInt16LE(i * 2) / 32768;
    peak = Math.max(peak, Math.abs(v));
    clipped += Math.abs(v) >= 0.9999 ? 1 : 0;
    total += v * v;
    chapters[Math.min(3, Math.floor(i / 16000 / 8))] += v * v;
  }
  if (peak < 0.05 || clipped || chapters.some((x) => x < 1))
    throw Error('Audio health check failed: ' + id);
  console.log(
    `${id}: ${(20 * Math.log10(Math.sqrt(total / (data.length / 2)))).toFixed(1)} dBFS RMS; ${(20 * Math.log10(peak)).toFixed(1)} dBFS peak; no clipped samples; all four chapters audible.`,
  );
}
