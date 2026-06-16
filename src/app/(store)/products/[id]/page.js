"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Illo from "@/components/ui/Illo";
import StockPill from "@/components/ui/StockPill";
import Stepper from "@/components/ui/Stepper";
import BoughtTogether from "@/components/store/BoughtTogether";
import RelatedProducts from "@/components/store/RelatedProducts";
import { useCart } from "@/context/CartContext";
import { getProductById, getAllProducts } from "@/lib/firebase/products";
import { getAllRules } from "@/lib/firebase/rules";
import { rupiah } from "@/lib/utils/format";

const TRUST = [
  ["truck", "Antar cepat & segar", "Dikirim di hari yang sama untuk area sekitar."],
  ["check", "Kualitas terjamin", "Dipanen langsung dari kolam, tanpa bau lumpur."],
  ["spark", "Rekomendasi cerdas", "Saran produk dari pola belanja pelanggan."],
];

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    Promise.all([getAllRules(), getAllProducts({ onlyActive: true })])
      .then(([rules, products]) => {
        const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
        const matched = rules
          .filter((r) =>
            Array.isArray(r.antecedent) && r.antecedent.includes(product.id)
          )
          .flatMap((r) =>
            (Array.isArray(r.consequent) ? r.consequent : [r.consequent]).map(
              (cid) => ({
                product: productMap[cid],
                confidence: r.confidence,
              })
            )
          )
          .filter((r) => r.product && r.product.id !== product.id);

        const seen = new Set();
        const unique = matched.filter((r) => {
          if (seen.has(r.product.id)) return false;
          seen.add(r.product.id);
          return true;
        });

        setRecs(unique.slice(0, 3));
      })
      .catch(() => {});
  }, [product]);

  if (loading) {
    return (
      <div
        className="wrap"
        style={{ padding: "120px 28px", display: "grid", placeItems: "center" }}
      >
        <div className="col" style={{ alignItems: "center", gap: 12 }}>
          <span className="ki-spin ki-spin-lg" />
          <span className="mut" style={{ fontWeight: 600 }}>Memuat produk…</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="wrap"
        style={{ padding: "80px 28px", display: "grid", placeItems: "center" }}
      >
        <div
          className="card"
          style={{
            padding: 40,
            maxWidth: 480,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "var(--red-50)",
              color: "var(--red)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="info" size={32} />
          </span>
          <h2 style={{ fontSize: 22 }}>Produk tidak ditemukan</h2>
          <p className="mut" style={{ margin: 0 }}>
            Produk ini mungkin sudah dinonaktifkan atau ID salah.
          </p>
          <Link href="/products" className="btn btn-primary">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const tint = product.tint || "sky";
  const hasImage = !!product.image_url;
  const tags = product.tags || [];

  const addToCart = () => add(product.id, qty);
  const buyNow = () => {
    add(product.id, qty);
    router.push("/cart");
  };

  return (
    <div className="wrap" style={{ padding: "26px 28px 0" }}>
      <div
        className="row gap-6"
        style={{ fontSize: 13.5, fontWeight: 600, color: "var(--muted)", marginBottom: 18, flexWrap: "wrap" }}
      >
        <Link href="/" style={{ color: "var(--muted)" }}>Beranda</Link>
        <span>/</span>
        <Link href="/products" style={{ color: "var(--muted)" }}>Katalog</Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>{product.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "start" }}>
        <div className="col gap-14">
          <div
            className={`illo illo-${tint}`}
            style={{ aspectRatio: "1/.86", boxShadow: "var(--shadow)", position: "relative" }}
          >
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
              <Illo type={product.illo || "whole"} size={320} />
            )}
          </div>

          <div className="row gap-12" style={{ flexWrap: "wrap" }}>
            {TRUST.map(([ic, title, desc]) => (
              <div
                key={title}
                className="card"
                style={{
                  flex: "1 1 0",
                  minWidth: 140,
                  padding: "12px 14px",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    flex: "0 0 auto",
                    borderRadius: 10,
                    background: "var(--sky-50)",
                    color: "var(--sky-600)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon name={ic} size={18} />
                </span>
                <div className="col" style={{ gap: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: 12.5, color: "var(--ink)" }}>{title}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col gap-16">
          <div className="row gap-8">
            <span className="chip">{product.category}</span>
            <StockPill stock={product.stock} />
          </div>
          <h1 style={{ fontSize: 34 }}>{product.name}</h1>
          <div className="row gap-8" style={{ alignItems: "baseline" }}>
            <span className="num" style={{ fontSize: 36, fontWeight: 800, color: "var(--navy)" }}>
              {rupiah(product.price)}
            </span>
            <span style={{ fontSize: 15, color: "var(--muted)", fontWeight: 600 }}>
              {product.unit}
            </span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--body)", margin: 0 }}>
            {product.description}
          </p>
          {tags.length > 0 && (
            <div className="row gap-8" style={{ flexWrap: "wrap" }}>
              {tags.map((t) => (
                <span key={t} className="chip chip-ink">
                  <Icon name="check" size={13} stroke={3} style={{ color: "var(--green)" }} /> {t}
                </span>
              ))}
            </div>
          )}

          <div
            className="card card-line"
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              boxShadow: "none",
            }}
          >
            <div className="row gap-12">
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>Jumlah</span>
              <div className="spacer" />
              <Stepper value={qty} onChange={setQty} max={Math.max(1, product.stock)} />
            </div>
            <div
              className="row gap-12"
              style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 14 }}
            >
              <span style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 600 }}>
                Subtotal
              </span>
              <div className="spacer" />
              <span className="num" style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)" }}>
                {rupiah(product.price * qty)}
              </span>
            </div>
          </div>

          <div className="row gap-12">
            <button
              type="button"
              className="btn btn-sky btn-lg"
              style={{ flex: 1 }}
              onClick={addToCart}
              disabled={(product.stock || 0) <= 0}
            >
              <Icon name="cart" size={19} /> Tambah ke Keranjang
            </button>
            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={buyNow}
              disabled={(product.stock || 0) <= 0}
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <BoughtTogether recs={recs} />
      </div>

      <RelatedProducts currentProduct={product} />

      <div className="card" style={{ marginTop: 24, padding: 28 }}>
        <h3 style={{ fontSize: 20, marginBottom: 16 }}>Spesifikasi Produk</h3>
        <div className="col gap-12">
          {[
            ["Kategori", product.category],
            ["Satuan", product.unit],
            ["Stok tersedia", product.stock > 0 ? `${product.stock} ${product.unit.replace("per ", "")}` : "Habis"],
            ...(tags.length > 0 ? [["Keunggulan", tags.join(", ")]] : []),
          ].map(([label, value]) => (
            <div
              key={label}
              className="row"
              style={{
                padding: "10px 0",
                borderBottom: "1px solid var(--line-soft)",
                fontSize: 14.5,
              }}
            >
              <span style={{ fontWeight: 600, color: "var(--muted)", minWidth: 160 }}>{label}</span>
              <span style={{ fontWeight: 700, color: "var(--ink)" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
