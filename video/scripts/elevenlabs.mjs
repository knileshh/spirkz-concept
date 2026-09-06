import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { lessons } from '../../src/lessons.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const cli = path.join(
  path.dirname(require.resolve('@remotion/cli/package.json')),
  'remotion-cli.js',
);
const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw Error('Set ELEVENLABS_API_KEY in this process environment.');
const voiceId = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
const model = 'eleven_multilingual_v2';
async function request(route, body) {
  const response = await fetch(`https://api.elevenlabs.io${route}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(90000),
  });
  if (!response.ok) {
    let status = 'request_failed';
    try {
      status = (await response.json()).detail?.status || status;
    } catch {}
    throw Error(`ElevenLabs HTTP ${response.status}: ${status}`);
  }
  return response.json();
}
const subscription = await request('/v1/user/subscription');
console.log(
  JSON.stringify({
    tier: subscription.tier,
    used: subscription.character_count,
    limit: subscription.character_limit,
  }),
);
const selected = await request(`/v1/voices/${voiceId}`);
console.log(
  JSON.stringify({ voice: selected.name, category: selected.category, model }),
);
if (process.argv.includes('--probe')) process.exit(0);
const characterCount = lessons.reduce(
  (n, l) => n + l.chapters.reduce((m, c) => m + c.text.length, 0),
  0,
);
if (
  subscription.character_limit - subscription.character_count <
  characterCount
)
  throw Error('Insufficient included credits; no generation started.');
const cache = path.join(root, 'out/elevenlabs');
const audioDir = path.join(root, 'public/voice-elevenlabs');
fs.mkdirSync(cache, { recursive: true });
fs.mkdirSync(audioDir, { recursive: true });
const manifest = {};
for (const lesson of lessons) {
  manifest[lesson.id] = [];
  for (const [index, chapter] of lesson.chapters.entries()) {
    const body = {
      text: chapter.text,
      model_id: model,
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.75,
        style: 0.15,
        use_speaker_boost: true,
        speed: 1.05,
      },
      previous_text: index ? lesson.chapters[index - 1].text : undefined,
      next_text: lesson.chapters[index + 1]?.text,
    };
    const hash = createHash('sha256')
      .update(JSON.stringify({ voiceId, body }))
      .digest('hex')
      .slice(0, 16);
    const cached = path.join(cache, `${lesson.id}-${index}-${hash}.json`);
    const result = fs.existsSync(cached)
      ? JSON.parse(fs.readFileSync(cached, 'utf8'))
      : await request(
          `/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,
          body,
        );
    if (!result.audio_base64 || !result.alignment)
      throw Error('Audio or alignment missing.');
    fs.writeFileSync(cached, JSON.stringify(result));
    const file = `voice-elevenlabs/${lesson.id}-${index}.mp3`;
    fs.writeFileSync(
      path.join(root, 'public', file),
      Buffer.from(result.audio_base64, 'base64'),
    );
    const info = JSON.parse(
      execFileSync(
        process.execPath,
        [
          cli,
          'ffprobe',
          '-v',
          'error',
          '-show_entries',
          'format=duration',
          '-of',
          'json',
          path.join(root, 'public', file),
        ],
        { cwd: root, encoding: 'utf8' },
      ),
    );
    const rawDuration = Number(info.format.duration);
    const playbackRate = Math.max(1, rawDuration / 7.55);
    if (playbackRate > 1.25)
      throw Error(
        `Narration too long to fit naturally: ${lesson.id} chapter ${index + 1}.`,
      );
    manifest[lesson.id].push({
      file,
      duration: rawDuration / playbackRate,
      rawDuration,
      playbackRate,
      provider: 'ElevenLabs',
      voice: selected.name,
      model,
      alignment: result.normalized_alignment || result.alignment,
    });
    console.log(
      `${lesson.id} ${index + 1}/4: ${rawDuration.toFixed(2)}s, fit ${playbackRate.toFixed(3)}x`,
    );
  }
}
fs.writeFileSync(
  path.join(root, 'src/voice.json'),
  JSON.stringify(manifest, null, 2) + '\n',
);
const after = await request('/v1/user/subscription');
console.log(
  JSON.stringify({
    creditsUsed: after.character_count - subscription.character_count,
    creditsRemaining: after.character_limit - after.character_count,
    tier: after.tier,
  }),
);
