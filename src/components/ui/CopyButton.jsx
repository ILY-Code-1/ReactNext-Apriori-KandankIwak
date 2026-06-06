"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

export default function CopyButton({
  value,
  size = "sm",
  label = "Salin",
  copiedLabel = "Tersalin",
  className = "",
  style,
}) {
  const [copied, setCopied] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(String(value ?? ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const sm = size === "sm";

  return (
    <button
      type="button"
      onClick={handle}
      className={`row gap-6 ${className}`}
      style={{
        padding: sm ? "6px 12px" : "8px 14px",
        borderRadius: 999,
        fontSize: sm ? 12.5 : 13,
        fontWeight: 700,
        color: copied ? "#fff" : "var(--sky-600)",
        background: copied ? "var(--green)" : "var(--sky-50)",
        flex: "0 0 auto",
        transition: "background .15s, color .15s",
        ...style,
      }}
    >
      <Icon name={copied ? "check" : "copy"} size={sm ? 13 : 15} stroke={2.5} />
      {copied ? copiedLabel : label}
    </button>
  );
}
