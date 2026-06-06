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
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="row">
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            background: TINT_BG[tint],
            color: TINT_FG[tint],
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name={icon} size={23} />
        </span>
        <div className="spacer" />
        {delta && (
          <span className="badge badge-green">
            <Icon name="chart" size={12} /> {delta}
          </span>
        )}
      </div>
      <div className="col" style={{ gap: 2 }}>
        <span className="num" style={{ fontSize: 27, fontWeight: 800, color: "var(--ink)" }}>
          {value}
        </span>
        <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{label}</span>
      </div>
    </div>
  );
}
