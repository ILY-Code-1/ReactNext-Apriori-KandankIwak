import Illo from "@/components/ui/Illo";
import { SAMPLE_PRODUCT_MAP } from "@/lib/sample-data";

export default function RuleChips({ ids = [] }) {
  return (
    <div className="row gap-6" style={{ flexWrap: "wrap" }}>
      {ids.map((id, i) => {
        const p = SAMPLE_PRODUCT_MAP[id];
        return (
          <span
            key={i}
            className="row gap-6"
            style={{
              background: "#fff",
              padding: "5px 10px 5px 6px",
              borderRadius: 999,
              boxShadow: "inset 0 0 0 1.5px var(--line)",
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            <span
              className={`illo illo-${p?.tint || "sky"}`}
              style={{
                width: 24,
                height: 24,
                aspectRatio: "auto",
                borderRadius: 7,
                flex: "0 0 auto",
              }}
            >
              <Illo type={p?.illo || "whole"} size={22} />
            </span>
            {p?.name || id}
          </span>
        );
      })}
    </div>
  );
}
