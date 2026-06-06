"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Illo from "@/components/ui/Illo";
import StockPill from "@/components/ui/StockPill";
import { useCart } from "@/context/CartContext";
import { rupiah } from "@/lib/utils/format";

export default function ProductCard({ product, compact = false }) {
  const { add } = useCart();
  const tint = product.tint || "sky";
  const hasImage = !!product.image_url;

  return (
    <div
      className="card kiup"
      style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      <Link
        href={`/products/${product.id}`}
        style={{ padding: compact ? 12 : 16, paddingBottom: 0 }}
      >
        <div className={`illo illo-${tint}`} style={{ position: "relative" }}>
          {hasImage ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Illo type={product.illo || "whole"} size={compact ? 124 : 158} />
          )}
          <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
            <StockPill stock={product.stock} />
          </div>
        </div>
      </Link>
      <div
        style={{
          padding: compact ? "12px 14px 16px" : "14px 18px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
        }}
      >
        <span className="chip" style={{ alignSelf: "flex-start" }}>
          {product.category}
        </span>
        <Link href={`/products/${product.id}`}>
          <h4 style={{ fontSize: compact ? 15.5 : 17, lineHeight: 1.2 }}>{product.name}</h4>
        </Link>
        <div className="row gap-6" style={{ marginTop: "auto", paddingTop: 6 }}>
          <div className="col" style={{ gap: 0 }}>
            <span
              className="num"
              style={{
                fontSize: compact ? 17 : 19,
                fontWeight: 800,
                color: "var(--navy)",
              }}
            >
              {rupiah(product.price)}
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
              {product.unit}
            </span>
          </div>
          <div className="spacer" />
          <button
            type="button"
            className="btn btn-sky btn-sm"
            onClick={() => add(product.id, 1)}
            disabled={(product.stock || 0) <= 0}
            aria-label="Tambah ke keranjang"
          >
            <Icon name="plus" size={16} stroke={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
