const NAVY = "#31318B";
const SKY = "#01A2EA";
const LSKY = "#7fd2f4";
const DEEP = "#272373";
const WHITE = "#fff";

function fish(cx, cy, s, body = NAVY, accent = SKY) {
  return (
    <g transform={`translate(${cx},${cy}) scale(${s})`}>
      <path d="M-58 0 C-58 -26 -20 -34 12 -34 C44 -34 60 -16 60 0 C60 16 44 34 12 34 C-20 34 -58 26 -58 0 Z" fill={body} />
      <path d="M52 0 C62 -14 78 -22 92 -26 C86 -10 86 10 92 26 C78 22 62 14 52 0 Z" fill={accent} />
      <path d="M-58 0 C-58 -26 -20 -34 12 -34 C28 -34 40 -28 48 -18 C20 -12 -8 -2 -30 14 C-46 8 -58 2 -58 0 Z" fill={accent} opacity="0.45" />
      <circle cx="-34" cy="-4" r="7.5" fill={WHITE} />
      <circle cx="-34" cy="-4" r="3.6" fill={DEEP} />
      <path d="M6 -30 C18 -40 30 -40 40 -34 C30 -30 18 -28 8 -26 Z" fill={accent} />
    </g>
  );
}

const VARIANTS = {
  whole: () => <>{fish(74, 78, 1.0)}</>,
  fillet: () => (
    <g>
      <path d="M38 96 C40 58 86 40 132 48 C150 51 158 66 150 84 C140 106 96 112 58 108 C44 106 37 104 38 96 Z" fill={NAVY} />
      <path d="M48 92 C56 70 92 60 126 64" stroke={SKY} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M58 100 C70 84 100 76 128 80" stroke={LSKY} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
    </g>
  ),
  fry: () => (
    <>
      {fish(52, 56, 0.42, NAVY, SKY)}
      {fish(104, 74, 0.42, SKY, NAVY)}
      {fish(64, 104, 0.42, NAVY, SKY)}
    </>
  ),
  feed: () => (
    <g>
      <path d="M52 56 L122 56 L132 116 a8 8 0 0 1-8 9 L60 125 a8 8 0 0 1-8-9 Z" fill={NAVY} />
      <path d="M52 56 q35 -16 70 0 l-4 -16 q-31 -12 -62 0 Z" fill={SKY} />
      {[[72, 78], [92, 74], [108, 86], [78, 98], [100, 96], [88, 110]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4.6" fill={LSKY} opacity="0.95" />
      ))}
    </g>
  ),
  spice: () => (
    <g>
      <path d="M36 84 a38 24 0 0 0 76 0 Z" fill={NAVY} />
      <ellipse cx="74" cy="84" rx="38" ry="11" fill={SKY} />
      <path d="M70 36 c-8 12 -2 22 4 26 c8 -8 8 -18 0 -26 Z" fill={SKY} />
      {[[60, 80], [74, 86], [88, 80], [67, 88], [81, 88]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.8" fill="#e0556a" />
      ))}
    </g>
  ),
  bundle: () => (
    <g>
      <rect x="40" y="58" width="68" height="62" rx="8" fill={NAVY} />
      <rect x="40" y="58" width="68" height="20" rx="8" fill={SKY} />
      <path d="M40 78 H108" stroke="#fff" strokeWidth="2" opacity="0.5" />
      {fish(78, 96, 0.42, "#fff", LSKY)}
      <circle cx="118" cy="60" r="15" fill={SKY} />
      <path d="M114 56 c-3 5 -1 9 2 11 c3 -3 3 -7 0 -11 Z" fill="#fff" />
    </g>
  ),
};

export default function Illo({ type, size = 150 }) {
  const render = VARIANTS[type] || VARIANTS.whole;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 150 150" style={{ overflow: "visible" }}>
      {render()}
    </svg>
  );
}
