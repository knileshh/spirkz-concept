import { useCurrentFrame } from 'remotion';
import type { Caption } from '@remotion/captions';

export function makeCaptions(
  text: string,
  start: number,
  duration: number,
): Caption[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += 7)
    chunks.push(words.slice(i, i + 7).join(' '));
  const total = chunks.reduce((n, s) => n + s.length, 0);
  let elapsed = 0;
  return chunks.map((text) => {
    const startMs = (start + (duration * elapsed) / total) * 1000;
    elapsed += text.length;
    return {
      text,
      startMs,
      endMs: (start + (duration * elapsed) / total) * 1000,
      timestampMs: null,
      confidence: null,
    };
  });
}

export const Captions = ({ captions }: { captions: Caption[] }) => {
  const ms = (useCurrentFrame() / 30) * 1000;
  const cue = captions.find((c) => ms >= c.startMs && ms < c.endMs);
  return (
    <div
      style={{
        position: 'absolute',
        top: 1484,
        left: 92,
        right: 92,
        minHeight: 155,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 53,
        lineHeight: 1.3,
        fontWeight: 700,
        color: '#fbfcf8',
      }}
    >
      {cue?.text}
    </div>
  );
};
