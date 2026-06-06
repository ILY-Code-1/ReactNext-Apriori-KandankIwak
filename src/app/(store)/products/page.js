"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import ProductCard from "@/components/store/ProductCard";
import { getAllProducts } from "@/lib/firebase/products";
import { rupiah } from "@/lib/utils/format";

const DEFAULT_MAX_PRICE = 200000;

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cat, setCat] = useState("Semua");
  const [sort, setSort] = useState("rec");
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);

  useEffect(() => {
    getAllProducts({ onlyActive: true })
      .then(setProducts)
      .catch(() => setError("Gagal memuat produk."))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products],
  );

  const priceCap = useMemo(
    () => Math.max(DEFAULT_MAX_PRICE, ...products.map((p) => p.price || 0)),
    [products],
  );

  const list = useMemo(() => {
    let l = products.filter(
      (p) => (cat === "Semua" || p.category === cat) && (p.price || 0) <= maxPrice,
    );
    if (sort === "low") l = [...l].sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "high") l = [...l].sort((a, b) => (b.price || 0) - (a.price || 0));
    return l;
  }, [products, cat, maxPrice, sort]);

  return (
    <div className="wrap" style={{ padding: "32px 28px 0" }}>
      <div className="col gap-6" style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>Beranda / Katalog</span>
        <h1 style={{ fontSize: 32 }}>Katalog Produk</h1>
      </div>

      <div
        className="layout-aside-main"
        style={{ display: "grid", gridTemplateColumns: "248px 1fr", gap: 26, alignItems: "start" }}
      >
        <aside
          className="card"
          style={{
            padding: 20,
            position: "sticky",
            top: 88,
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div className="row gap-8">
            <Icon name="filter" size={18} style={{ color: "var(--navy)" }} />
            <span style={{ fontWeight: 800, color: "var(--ink)" }}>Filter</span>
          </div>

          <div className="col gap-10">
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Kategori</span>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className="row gap-8"
                style={{
                  justifyContent: "flex-start",
                  fontSize: 14,
                  fontWeight: 600,
                  color: cat === c ? "var(--navy)" : "var(--body)",
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 5,
                    border: `2px solid ${cat === c ? "var(--sky)" : "var(--line)"}`,
                    background: cat === c ? "var(--sky)" : "#fff",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {cat === c && <Icon name="check" size={11} stroke={3} style={{ color: "#fff" }} />}
                </span>
                {c}
              </button>
            ))}
          </div>

          <div className="col gap-10">
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Harga maksimum</span>
            <input
              type="range"
              min="0"
              max={priceCap}
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)}
              style={{ accentColor: "var(--sky)" }}
            />
            <span className="num" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--navy)" }}>
              ≤ {rupiah(maxPrice)}
            </span>
          </div>
        </aside>

        <div>
          <div className="row" style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 600 }}>
              {loading ? "Memuat…" : `${list.length} produk`}
            </span>
            <div className="spacer" />
            <select
              className="select"
              style={{ width: "auto", padding: "9px 14px", fontWeight: 600 }}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="rec">Rekomendasi</option>
              <option value="low">Harga terendah</option>
              <option value="high">Harga tertinggi</option>
            </select>
          </div>

          {loading ? (
            <div className="grid-cards-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: 16 }}>
                  <div className="illo illo-sky" style={{ opacity: 0.4 }} />
                  <div
                    style={{
                      height: 16,
                      width: "70%",
                      background: "var(--bg-2)",
                      borderRadius: 6,
                      marginTop: 14,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : error ? (
            <EmptyState icon="info" title={error} />
          ) : list.length === 0 ? (
            <EmptyState
              icon="search"
              title="Tidak ada produk"
              hint="Coba ubah filter atau naikkan batas harga."
            />
          ) : (
            <div className="grid-cards-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, hint }) {
  return (
    <div
      className="card"
      style={{
        padding: "48px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "var(--sky-50)",
          color: "var(--sky-600)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon name={icon} size={28} />
      </span>
      <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 16 }}>{title}</span>
      {hint && (
        <span className="mut" style={{ fontSize: 13.5, maxWidth: 320 }}>
          {hint}
        </span>
      )}
    </div>
  );
}
