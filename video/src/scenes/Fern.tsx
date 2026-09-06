import { useCurrentFrame } from 'remotion';
export const FernScene = () => {
  const f = useCurrentFrame(),
    chapter = Math.floor(f / 240),
    p = (f % 240) / 240;
  return (
    <svg width="1080" height="1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="leaf" x2="1" y2="1">
          <stop stopColor="#c4eb8c" />
          <stop offset="1" stopColor="#338669" />
        </linearGradient>
      </defs>
      <g transform={`translate(540 945) rotate(${Math.sin(p * 6.28) * 2})`}>
        <path
          d="M0 210 C-365 70-320-215 15-256 C360-95 270 143 0 210Z"
          fill="url(#leaf)"
        />
        <path
          d="M0 235 Q0-30 15-225"
          fill="none"
          stroke="#205841"
          strokeWidth="12"
        />
        {[-130, -35, 65].map((y, i) => (
          <g key={y} stroke="#367b4c" strokeWidth="5" opacity=".6">
            <path d={`M8 ${y} Q-80 ${y - 55} ${-110 - i * 20} ${y - 82}`} />
            <path d={`M8 ${y} Q90 ${y - 55} ${140 - i * 10} ${y - 100}`} />
          </g>
        ))}
        {chapter === 0 &&
          [-1, 1].flatMap((side) =>
            [0, 1, 2].map((i) => (
              <ellipse
                key={`${side}${i}`}
                cx={side * (80 + i * 14)}
                cy={-150 + i * 105}
                rx="25"
                ry="14"
                fill="#285a38"
                opacity={0.6 + Math.sin(p * 6.28 + i) * 0.2}
              />
            )),
          )}
      </g>
      <circle cx="770" cy="630" r="63" fill="#f5d780" />
      {[0, 1, 2].map((i) => {
        const q = (p * 2 + i / 3) % 1;
        return (
          <circle
            key={i}
            cx={760 - q * 165}
            cy={690 + q * 170}
            r="10"
            fill="#f5d780"
            opacity={1 - q}
          />
        );
      })}
      {chapter >= 1 && (
        <>
          <path
            d="M540 1180V1310 M540 1290l-55 44 M540 1260l60 60"
            stroke="#728b62"
            strokeWidth="9"
            fill="none"
          />
          <path
            d="M370 1310Q480 1280 490 1150"
            stroke="#81c9f0"
            strokeWidth="8"
            fill="none"
            strokeDasharray="14 12"
            strokeDashoffset={-p * 200}
          />
          <text x="300" y="1390" fontSize="42" fill="#81c9f0">
            WATER
          </text>
          <path
            d="M910 935H775"
            stroke="#bdd6c7"
            strokeWidth="7"
            strokeDasharray="12 10"
            strokeDashoffset={-p * 170}
          />
          <text x="837" y="893" fontSize="44" fill="#d7e8d9">
            CO₂
          </text>
        </>
      )}
      {chapter === 2 && (
        <g
          transform={`translate(305 700) scale(${0.85 + 0.15 * Math.sin(p * 6.28)})`}
        >
          <path d="M0-75L65-37V37L0 75-65 37V-37Z" fill="#ecc782" />
          <text
            x="0"
            y="8"
            fontSize="25"
            textAnchor="middle"
            fill="#3d3823"
            fontWeight="800"
          >
            SUGAR
          </text>
        </g>
      )}
      {chapter === 3 &&
        [0, 1, 2].map((i) => {
          const q = (p + i / 3) % 1;
          return (
            <g
              key={i}
              opacity={1 - q}
              transform={`translate(${320 + Math.sin(q * 5) * 45} ${850 - q * 230})`}
            >
              <circle r="44" fill="#caefcb" />
              <text
                x="0"
                y="12"
                fill="#28583b"
                fontSize="33"
                textAnchor="middle"
              >
                O₂
              </text>
            </g>
          );
        })}
      {chapter === 0 && (
        <text x="540" y="1335" textAnchor="middle" fill="#c9f58b" fontSize="38">
          CHLOROPHYLL CAPTURES LIGHT ENERGY
        </text>
      )}
    </svg>
  );
};
