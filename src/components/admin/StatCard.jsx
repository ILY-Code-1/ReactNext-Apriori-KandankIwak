import Icon from "@/components/ui/Icon";

const TINT_BG = {
  sky: "var(--sky-50)",
  green: "var(--green-50)",
  navy: "var(--bg-2)",
};
const TINT_FG = {
  sky: "var(--sky-600)",
  green: "var(--green)",
  navy: "var(--navy)",
};

export default function StatCard({ icon, label, value, delta, tint = "navy" }) {
  return (
    <div
      className="card"
      style={{
        aspectRatio: "1 / 1",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div className="row">
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: TINT_BG[tint],
            color: TINT_FG[tint],
            display: "grid",
            placeItems: "center",
            flex: "0 0 auto",
          }}
        >
          <Icon name={icon} size={20} />
        </span>
        <div className="spacer" />
        {delta && (
          <span className="badge badge-green" style={{ flex: "0 0 auto" }}>
            <Icon name="chart" size={11} /> {delta}
          </span>
        )}
      </div>
      <div className="col" style={{ gap: 4, marginTop: "auto", minWidth: 0 }}>
        <span
          className="num"
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "var(--ink)",
            lineHeight: 1.15,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontSize: 12.5,
            color: "var(--muted)",
            fontWeight: 600,
            lineHeight: 1.35,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
