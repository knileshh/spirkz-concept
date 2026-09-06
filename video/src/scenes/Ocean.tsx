import { CanvasImage, staticFile, useCurrentFrame } from 'remotion';
export const OceanScene = () => {
  const f = useCurrentFrame(),
    chapter = Math.floor(f / 240),
    p = (f % 240) / 240;
  const colors = ['#fa7666', '#f3a957', '#f8de78', '#8fca87', '#76b5fa'];
  if (chapter === 0 || chapter === 3)
    return (
      <>
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 598,
            width: 920,
            height: 720,
            borderRadius: 48,
            overflow: 'hidden',
          }}
        >
          <CanvasImage
            src={staticFile('images/ocean.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              scale: 1 + p * 0.08,
              translate: `${-p * 15}px 0`,
            }}
          />
        </div>
        {chapter === 3 && (
          <div
            style={{
              position: 'absolute',
              left: 140,
              top: 1140,
              display: 'flex',
              gap: 20,
            }}
          >
            {['#215587', '#147f8a', '#49baaa', '#89bba0'].map((c, i) => (
              <div
                key={c}
                style={{
                  background: c,
                  width: 180,
                  height: 180,
                  borderRadius: 90,
                  scale: Math.min(1, p * 5 - i * 0.15 + 0.2),
                  border: '8px solid #101f1b',
                }}
              />
            ))}
          </div>
        )}
      </>
    );
  return (
    <svg width="1080" height="1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="water" x2="0" y2="1">
          <stop stopColor="#1b727e" />
          <stop offset="1" stopColor="#132d49" />
        </linearGradient>
      </defs>
      <rect
        x="100"
        y="765"
        width="880"
        height="530"
        rx="28"
        fill="url(#water)"
      />
      <path
        d="M100 765 Q210 742 320 765 T540 765 T760 765 T980 765"
        fill="none"
        stroke="#8fdfd6"
        strokeWidth="5"
      />
      <text x="540" y="660" textAnchor="middle" fontSize="39" fill="#d7e8d9">
        SUNLIGHT CONTAINS MANY COLORS
      </text>
      {colors.map((c, i) => {
        const travel = (p * 1.9 + i * 0.11) % 1;
        const end = chapter === 1 ? 870 + i * 80 : 880 + i * 80;
        const y = 700 + (end - 700) * travel;
        return (
          <g key={c}>
            <line
              x1={265 + i * 125}
              y1="704"
              x2={265 + i * 125}
              y2={end}
              stroke={c}
              strokeWidth="8"
              opacity=".15"
            />
            <path
              d={`M${265 + i * 125} 710 L${265 + i * 125} ${y}`}
              stroke={c}
              strokeWidth="7"
              opacity={1 - travel * 0.7}
            />
            <circle
              cx={265 + i * 125}
              cy={y}
              r="12"
              fill={c}
              opacity={1 - travel}
            />
          </g>
        );
      })}
      {chapter === 2 && (
        <>
          <path
            d="M790 1190 Q920 1000 860 700"
            fill="none"
            stroke="#82bdff"
            strokeWidth="8"
            strokeDasharray="20 12"
            strokeDashoffset={-p * 500}
          />
          <path
            d="M840 731 L860 689 L885 725"
            stroke="#82bdff"
            fill="none"
            strokeWidth="7"
          />
        </>
      )}
      <text
        x="540"
        y="1370"
        textAnchor="middle"
        fontSize="42"
        fontWeight="700"
        fill="#a4d3ff"
      >
        {chapter === 1
          ? 'Red is absorbed more strongly.'
          : 'Blue light travels farther.'}
      </text>
    </svg>
  );
};
