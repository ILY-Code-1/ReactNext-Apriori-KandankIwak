"use client";

import Icon from "./Icon";

export default function Stepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <div
      className="row"
      style={{
        background: "#fff",
        borderRadius: 999,
        boxShadow: "inset 0 0 0 1.5px var(--line)",
        padding: 3,
        gap: 2,
      }}
    >
      <button
        type="button"
        className="row"
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          justifyContent: "center",
          color: "var(--navy)",
        }}
      >
        <Icon name="minus" size={16} />
      </button>
      <span
        className="num"
        style={{ minWidth: 26, textAlign: "center", fontWeight: 700, color: "var(--ink)" }}
      >
        {value}
      </span>
      <button
        type="button"
        className="row"
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          justifyContent: "center",
          color: "#fff",
          background: "var(--sky)",
        }}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
