"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Illo from "@/components/ui/Illo";
import { useCart } from "@/context/CartContext";
import { rupiah } from "@/lib/utils/format";

export default function BoughtTogether({ recs = [] }) {
  const { add } = useCart();

  if (!recs.length) return null;

  return (
    <section
      className="card kiup"
      style={{
        overflow: "hidden",
        boxShadow: "var(--shadow)",
        border: "1.5px solid var(--sky-100)",
      }}
    >
      <div
        style={{
          padding: "16px 22px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "linear-gradient(100deg, var(--sky-50), #fff)",
          borderBottom: "1px solid var(--line-soft)",
        }}
      >
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "var(--sky)",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            boxShadow: "var(--shadow-sky)",
          }}
        >
          <Icon name="spark" size={21} />
        </span>
        <div className="col" style={{ gap: 1 }}>
          <h3 style={{ fontSize: 18 }}>Sering Dibeli Bersama</h3>
          <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>
            Rekomendasi cerdas dari pola belanja pelanggan Kandank Iwak
          </span>
        </div>
      </div>
      <div
        style={{
          padding: 18,
          display: "grid",
          gap: 14,
          gridTemplateColumns: `repeat(${Math.min(recs.length, 3)}, 1fr)`,
        }}
      >
        {recs.map(({ product, confidence }) => (
          <div
            key={product.id}
            className="row gap-12"
            style={{
              background: "var(--bg)",
              borderRadius: "var(--r)",
              padding: 12,
              alignItems: "center",
            }}
          >
            <Link
              href={`/products/${product.id}`}
              className={`illo illo-${product.tint || "sky"}`}
              style={{
                width: 70,
                height: 60,
                aspectRatio: "auto",
                flex: "0 0 auto",
                borderRadius: 12,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {product.image_url ? (
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
                <Illo type={product.illo || "whole"} size={64} />
              )}
            </Link>
            <div className="col" style={{ gap: 3, flex: 1, minWidth: 0 }}>
              <span className="badge badge-navy" style={{ alignSelf: "flex-start" }}>
                {Math.round(confidence * 100)}% cocok
              </span>
              <Link
                href={`/products/${product.id}`}
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--ink)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.name}
              </Link>
              <span
                className="num"
                style={{ fontSize: 14.5, fontWeight: 800, color: "var(--navy)" }}
              >
                {rupiah(product.price)}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ flex: "0 0 auto" }}
              onClick={() => add(product.id, 1)}
            >
              <Icon name="plus" size={15} stroke={2.5} /> Tambah
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
