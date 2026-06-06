/* ===========================================================
   Kandank Iwak — Shared UI: icons, logo, illustrations, atoms
   =========================================================== */

const { useState, useEffect, useMemo, useRef } = React;

const money = (n) => window.KI.rupiah(n);

/* ---------------- Icons ---------------- */
function Icon({ name, size = 20, stroke = 2, style }) {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round",
    strokeLinejoin: "round", style,
  };
  const paths = {
    cart: <><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3.5h2.2l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2l1.6-7.3H6" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <><path d="M5 12h14" /></>,
    trash: <><path d="M3 6h18M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6m2 0-.7 13a1.5 1.5 0 0 1-1.5 1.4H8.2a1.5 1.5 0 0 1-1.5-1.4L6 6" /></>,
    chevR: <path d="m9 6 6 6-6 6" />,
    chevD: <path d="m6 9 6 6 6-6" />,
    chevL: <path d="m15 6-6 6 6 6" />,
    arrowR: <path d="M5 12h14M13 6l6 6-6 6" />,
    check: <path d="M20 6 9 17l-5-5" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" /></>,
    lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
    star: <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />,
    pkg: <><path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5z" /><path d="M3 8.5 12 14l9-5.5M12 14v7" /></>,
    chart: <><path d="M4 4v16h16" /><path d="M8 14l3-3 3 2 4-5" /></>,
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
    receipt: <><path d="M5 3.5h14v17l-2.3-1.4-2.3 1.4-2.4-1.4-2.4 1.4L5 20.5z" /><path d="M9 8h6M9 12h6" /></>,
    spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
    truck: <><rect x="2.5" y="6.5" width="11" height="9" rx="1.5" /><path d="M13.5 9.5h4l3 3v3h-7z" /><circle cx="6.5" cy="17.5" r="1.6" /><circle cx="17" cy="17.5" r="1.6" /></>,
    wa: <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3z" />,
    logout: <><path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" /><path d="M16 17l5-5-5-5M21 12H9" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1l-.3-2.5H9.5l-.3 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L5 11a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.3 2.5h4.9l.3-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6a7 7 0 0 0 .1-1z" /></>,
    filter: <path d="M3 5h18l-7 8v6l-4-2v-4z" />,
    box: <><path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5z" /><path d="M3 8.5 12 14l9-5.5" /></>,
    play: <path d="M7 4.5v15l12-7.5z" />,
    download: <><path d="M12 3v12M7 11l5 4 5-4" /><path d="M4 20h16" /></>,
    edit: <><path d="M14 5l5 5M4 20l1-4L16 5l3 3L8 19z" /></>,
    bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 19a2 2 0 0 0 4 0" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    map: <><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
    x: <path d="M6 6l12 12M18 6L6 18" />,
  };
  return <svg {...p}>{paths[name] || null}</svg>;
}

/* ---------------- Logo ---------------- */
function Logo({ height = 34, mono = false }) {
  return (
    <img
      src={(window.__resources && window.__resources.logo) || "assets/kandank-iwak-logo.png"}
      alt="Kandank Iwak"
      style={{
        height, width: "auto",
        filter: mono ? "brightness(0) invert(1)" : "none",
      }}
    />
  );
}

/* ---------------- Product illustration (flat) ---------------- */
function Illo({ type, size = 150 }) {
  const NAVY = "#31318B", SKY = "#01A2EA", LSKY = "#7fd2f4", DEEP = "#272373", WHITE = "#fff";
  const fish = (cx, cy, s, body = NAVY, accent = SKY) => (
    <g transform={`translate(${cx},${cy}) scale(${s})`}>
      <path d="M-58 0 C-58 -26 -20 -34 12 -34 C44 -34 60 -16 60 0 C60 16 44 34 12 34 C-20 34 -58 26 -58 0 Z" fill={body} />
      <path d="M52 0 C62 -14 78 -22 92 -26 C86 -10 86 10 92 26 C78 22 62 14 52 0 Z" fill={accent} />
      <path d="M-58 0 C-58 -26 -20 -34 12 -34 C28 -34 40 -28 48 -18 C20 -12 -8 -2 -30 14 C-46 8 -58 2 -58 0 Z" fill={accent} opacity="0.45" />
      <circle cx="-34" cy="-4" r="7.5" fill={WHITE} />
      <circle cx="-34" cy="-4" r="3.6" fill={DEEP} />
      <path d="M6 -30 C18 -40 30 -40 40 -34 C30 -30 18 -28 8 -26 Z" fill={accent} />
    </g>
  );
  const inner = {
    whole: <>{fish(74, 78, 1.0)}</>,
    fillet: (
      <g>
        <path d="M38 96 C40 58 86 40 132 48 C150 51 158 66 150 84 C140 106 96 112 58 108 C44 106 37 104 38 96 Z" fill={NAVY} />
        <path d="M48 92 C56 70 92 60 126 64" stroke={SKY} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M58 100 C70 84 100 76 128 80" stroke={LSKY} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
      </g>
    ),
    fry: <>{fish(52, 56, 0.42, NAVY, SKY)}{fish(104, 74, 0.42, SKY, NAVY)}{fish(64, 104, 0.42, NAVY, SKY)}</>,
    feed: (
      <g>
        <path d="M52 56 L122 56 L132 116 a8 8 0 0 1-8 9 L60 125 a8 8 0 0 1-8-9 Z" fill={NAVY} />
        <path d="M52 56 q35 -16 70 0 l-4 -16 q-31 -12 -62 0 Z" fill={SKY} />
        {[[72,78],[92,74],[108,86],[78,98],[100,96],[88,110]].map((d,i)=>(
          <circle key={i} cx={d[0]} cy={d[1]} r="4.6" fill={LSKY} opacity="0.95" />
        ))}
      </g>
    ),
    spice: (
      <g>
        <path d="M36 84 a38 24 0 0 0 76 0 Z" fill={NAVY} />
        <ellipse cx="74" cy="84" rx="38" ry="11" fill={SKY} />
        <path d="M70 36 c-8 12 -2 22 4 26 c8 -8 8 -18 0 -26 Z" fill={SKY} />
        {[[60,80],[74,86],[88,80],[67,88],[81,88]].map((d,i)=>(
          <circle key={i} cx={d[0]} cy={d[1]} r="3.8" fill="#e0556a" />
        ))}
      </g>
    ),
    bundle: (
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
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 150 150" style={{ overflow: "visible" }}>
      {inner[type] || inner.whole}
    </svg>
  );
}

/* ---------------- Stock indicator ---------------- */
function StockPill({ stock }) {
  if (stock <= 0) return <span className="badge badge-red"><span className="dot" />Stok habis</span>;
  if (stock < 20) return <span className="badge badge-amber"><span className="dot" />Sisa {stock}</span>;
  return <span className="badge badge-green"><span className="dot" />Stok {stock}</span>;
}

/* ---------------- Wave divider ---------------- */
function Wave({ color = "#fff", flip = false, height = 60 }) {
  return (
    <svg className="wave" viewBox="0 0 1440 120" preserveAspectRatio="none"
      style={{ height, transform: flip ? "scaleY(-1)" : "none" }}>
      <path fill={color} d="M0 60 C 240 110 480 110 720 70 C 960 30 1200 30 1440 70 L1440 120 L0 120 Z" />
    </svg>
  );
}

/* ---------------- Quantity stepper ---------------- */
function Stepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="row" style={{ background: "#fff", borderRadius: 999, boxShadow: "inset 0 0 0 1.5px var(--line)", padding: 3, gap: 2 }}>
      <button className="row" onClick={() => onChange(Math.max(min, value - 1))}
        style={{ width: 32, height: 32, borderRadius: 999, justifyContent: "center", color: "var(--navy)" }}>
        <Icon name="minus" size={16} />
      </button>
      <span className="num" style={{ minWidth: 26, textAlign: "center", fontWeight: 700, color: "var(--ink)" }}>{value}</span>
      <button className="row" onClick={() => onChange(Math.min(max, value + 1))}
        style={{ width: 32, height: 32, borderRadius: 999, justifyContent: "center", color: "#fff", background: "var(--sky)" }}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

/* ---------------- Toast ---------------- */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)",
      background: "var(--navy)", color: "#fff", padding: "13px 20px", borderRadius: 999,
      boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 10,
      fontWeight: 600, fontSize: 14, zIndex: 200,
    }} className="kiup">
      <span style={{ width: 22, height: 22, borderRadius: 999, background: "var(--sky)", display: "grid", placeItems: "center" }}>
        <Icon name="check" size={14} stroke={3} />
      </span>
      {toast}
    </div>
  );
}

Object.assign(window, { Icon, Logo, Illo, StockPill, Wave, Stepper, Toast, money,
  useState, useEffect, useMemo, useRef });
