import { Composition } from 'remotion';
import { Short } from './Short';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {(['moon', 'ocean', 'fern'] as const).map((id) => (
        <Composition
          key={id}
          id={id}
          component={Short}
          defaultProps={{ id }}
          durationInFrames={960}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
    </>
  );
};
