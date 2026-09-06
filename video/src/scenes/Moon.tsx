import {
  CanvasImage,
  staticFile,
  useCurrentFrame,
  interpolate,
} from 'remotion';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const MoonScene = () => {
  const f = useCurrentFrame();
  const chapter = Math.floor(f / 240);
  const p = (f % 240) / 240;
  const angle = p * Math.PI * 2 - Math.PI / 2;
  const x = 540 + 270 * Math.cos(angle),
    y = 938 + 270 * Math.sin(angle);
  if (chapter === 0 || chapter === 3)
    return (
      <>
        <div
          style={{
            position: 'absolute',
            left: 210,
            top: 616,
            width: 660,
            height: 660,
            scale: interpolate(f % 240, [0, 239], [0.96, 1.04], clamp),
            rotate:
              chapter === 3 ? `${Math.sin(p * Math.PI * 2) * 7}deg` : '0deg',
          }}
        >
          <CanvasImage
            src={staticFile('images/moon.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        </div>
        {chapter === 3 && (
          <div
            style={{
              position: 'absolute',
              top: 1060,
              left: 120,
              right: 120,
              textAlign: 'center',
              fontSize: 142,
              fontWeight: 800,
              color: '#c9f58b',
              textShadow: '0 4px 40px #101f1b',
            }}
          >
            59%
            <div style={{ fontSize: 38, color: '#e3ecdf' }}>
              visible over time
            </div>
          </div>
        )}
      </>
    );
  return (
    <svg width="1080" height="1920" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id="earth">
          <stop stopColor="#7fceb0" />
          <stop offset="1" stopColor="#226c72" />
        </radialGradient>
        <radialGradient id="moon">
          <stop stopColor="#e5e6dd" />
          <stop offset="1" stopColor="#7b8980" />
        </radialGradient>
      </defs>
      <circle
        cx="540"
        cy="938"
        r="270"
        fill="none"
        stroke="#38554a"
        strokeWidth="3"
        strokeDasharray="7 13"
      />
      <path
        d={`M540 668 A270 270 0 ${p > 0.5 ? 1 : 0} 1 ${x} ${y}`}
        fill="none"
        stroke="#c9f58b"
        strokeWidth="5"
      />
      <line
        x1="540"
        y1="938"
        x2={x}
        y2={y}
        stroke="#c9f58b"
        strokeWidth="2"
        strokeDasharray="6 10"
        opacity=".6"
      />
      <circle cx="540" cy="938" r="86" fill="url(#earth)" />
      <path
        d="M502 881l40-12 31 25-9 31 25 27-17 28-20-19-8-37-40-2-15-19z"
        fill="#afcb83"
        opacity=".7"
      />
      <text x="540" y="1060" fill="#b5c8bd" fontSize="28" textAnchor="middle">
        EARTH
      </text>
      <g
        transform={`translate(${x} ${y}) rotate(${(angle * 180) / Math.PI + 180})`}
      >
        <circle r="61" fill="url(#moon)" />
        <circle cx="-19" cy="-20" r="13" fill="#627567" opacity=".5" />
        <circle cx="-25" cy="19" r="8" fill="#627567" opacity=".5" />
        <line x1="0" y1="0" x2="46" y2="0" stroke="#172b21" strokeWidth="6" />
        <circle
          cx="47"
          r="13"
          fill="#c9f58b"
          stroke="#172b21"
          strokeWidth="4"
        />
      </g>
      <text
        x="540"
        y="1310"
        fill="#c9f58b"
        fontSize="42"
        fontWeight="700"
        textAnchor="middle"
      >
        {chapter === 1
          ? 'One orbit. One rotation.'
          : 'The marked side faces Earth.'}
      </text>
      <text x="540" y="1368" fill="#9aafa2" fontSize="26" textAnchor="middle">
        TOP VIEW · DISTANCES AND SIZES NOT TO SCALE
      </text>
    </svg>
  );
};
