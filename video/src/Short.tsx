import {
  AbsoluteFill,
  CanvasImage,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import { Audio } from '@remotion/media';
import { loadFont } from '@remotion/fonts';
import lessons from './lessons.json';
import voice from './voice.json';
import { Captions } from './Captions';
import captionsByLesson from './captions.json';
import { MoonScene } from './scenes/Moon';
import { OceanScene } from './scenes/Ocean';
import { FernScene } from './scenes/Fern';

loadFont({
  family: 'Manrope',
  url: staticFile('fonts/manrope-700.ttf'),
  weight: '700',
});
loadFont({
  family: 'Manrope',
  url: staticFile('fonts/manrope-800.ttf'),
  weight: '800',
});

export const Short = ({
  id,
  burnCaptions = false,
}: {
  id: 'moon' | 'ocean' | 'fern';
  burnCaptions?: boolean;
}) => {
  const frame = useCurrentFrame(),
    chapter = Math.min(3, Math.floor(frame / 240));
  const lesson = lessons.find((l) => l.id === id)!;
  const clips = voice[id];
  const captions = captionsByLesson[id];
  const Scene =
    id === 'moon' ? MoonScene : id === 'ocean' ? OceanScene : FernScene;
  const headlines = {
    moon: [
      'Same Moon.\nSame face.\nBut why?',
      'Yes, the Moon\nreally does\nrotate.',
      'Perfectly\nin step.',
      'There’s a\nlittle more\nto see.',
    ],
    ocean: [
      'Why is the\nocean blue?',
      'Follow\nthe light.',
      'Blue goes\nthe distance.',
      'One ocean.\nMany colors.',
    ],
    fern: [
      'A leaf.\nA tiny solar\nkitchen.',
      'Just add\nwater and air.',
      'Sunlight in.\nSugar made.',
      'And a little\nsomething\nfor us.',
    ],
  };
  return (
    <AbsoluteFill
      style={{
        background: '#101f1b',
        color: '#fbfcf8',
        fontFamily: 'Manrope',
        fontWeight: 700,
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 60% 48%, #2b4b39 0%, transparent 65%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 95,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <CanvasImage
          src={staticFile('brand/spirkz-app-icon.png')}
          style={{ width: 76, height: 76, borderRadius: 20 }}
        />
        <span style={{ fontSize: 49, fontWeight: 800 }}>spirkz</span>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 90,
          top: 122,
          fontSize: 24,
          letterSpacing: 4,
          color: '#acc1b0',
        }}
      >
        {lesson.category}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 236,
          left: 90,
          right: 80,
          fontSize: 94,
          lineHeight: 1.06,
          letterSpacing: -4,
          fontWeight: 800,
          whiteSpace: 'pre-line',
          opacity: interpolate(
            frame % 240,
            [0, 12, 225, 239],
            [0.35, 1, 1, 0.35],
            { extrapolateRight: 'clamp' },
          ),
          translate: `0 ${interpolate(frame % 240, [0, 14], [16, 0], { extrapolateRight: 'clamp' })}px`,
        }}
      >
        {headlines[id][chapter]}
      </div>
      <Scene />
      <div
        style={{
          position: 'absolute',
          top: 1415,
          left: 92,
          right: 92,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 27,
          color: '#a6bda9',
        }}
      >
        <span>{lesson.chapters[chapter].title}</span>
        <span>0{chapter + 1} / 04</span>
      </div>
      {burnCaptions && <Captions captions={captions} />}
      <div
        style={{
          position: 'absolute',
          left: 92,
          right: 92,
          top: 1705,
          height: 3,
          background: '#3c5043',
        }}
      >
        <div
          style={{
            height: 3,
            width: `${(frame / 959) * 100}%`,
            background: '#c9f58b',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 92,
          right: 92,
          top: 1750,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 23,
          color: '#9daf9e',
        }}
      >
        <span>ONE SMALL LESSON</span>
        <span>
          {id === 'moon'
            ? 'NASA'
            : id === 'ocean'
              ? 'NOAA'
              : 'NATIONAL GEOGRAPHIC'}{' '}
          · CONCEPT
        </span>
      </div>
      {clips.map((clip, i) => (
        <Sequence key={clip.file} from={i * 240 + 5} durationInFrames={235}>
          <Audio src={staticFile(clip.file)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
