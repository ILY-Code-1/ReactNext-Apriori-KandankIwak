"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Illo from "@/components/ui/Illo";
import Wave from "@/components/ui/Wave";
import ProductCard from "@/components/store/ProductCard";
import { getAllProducts } from "@/lib/firebase/products";
import { rupiah } from "@/lib/utils/format";

const CATEGORIES = [
  { label: "Ikan Segar", illo: "whole", tint: "sky" },
  { label: "Paket Anti Ribed", illo: "bundle", tint: "navy" },
  { label: "Budidaya", illo: "feed", tint: "sky" },
];

const STATS = [
  ["100%", "Air tawar bersih"],
  ["6", "Produk pilihan"],
  ["4.9★", "Rating pelanggan"],
];

const TRUST = [
  ["truck", "Antar cepat & segar", "Pesanan dikirim di hari yang sama untuk area sekitar."],
  ["check", "Kualitas terjamin", "Dipanen langsung dari kolam, tanpa bau lumpur."],
  ["spark", "Rekomendasi cerdas", "Saran produk dari pola belanja, ditenagai Apriori."],
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllProducts({ onlyActive: true })
      .then(setProducts)
      .catch(() => setError("Gagal memuat produk."))
      .finally(() => setLoading(false));
  }, []);

  const featured = products.slice(0, 4);

  return (
    <div>
      <section
        style={{
          position: "relative",
          background: "linear-gradient(150deg, #f4f9ff 0%, #e6f4fc 48%, #d6edfa 100%)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.5,
            background:
              "radial-gradient(50% 60% at 85% 10%, rgba(1,162,234,.20), transparent 60%)",
          }}
        />
        <div
          className="wrap"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1.05fr .95fr",
            gap: 30,
            alignItems: "center",
            padding: "54px 28px 64px",
          }}
        >
          <div className="col gap-20 kiup">
            <span
              className="chip"
              style={{
                alignSelf: "flex-start",
                background: "#fff",
                color: "var(--sky-600)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Icon name="spark" size={15} /> Panen harian dari kolam sendiri
            </span>
            <h1 style={{ fontSize: 52, lineHeight: 1.04 }}>
              Ikan Nila <span style={{ color: "var(--sky)" }}>Segar</span>
              <br />
              langsung dari Kandank Iwak
            </h1>
            <p style={{ fontSize: 17, color: "var(--body)", maxWidth: 440, margin: 0, lineHeight: 1.6 }}>
              Dari kolam budidaya ke meja makan Anda. Nila segar, paket anti ribed praktis, bibit unggul, dan pakan berkualitas.
            </p>
            <div className="row gap-12">
              <Link href="/products" className="btn btn-primary btn-lg">
                Belanja Sekarang <Icon name="arrowR" size={18} />
              </Link>
              <Link href="/products" className="btn btn-outline btn-lg">
                Lihat Katalog
              </Link>
            </div>
            <div className="row gap-24" style={{ marginTop: 6 }}>
              {STATS.map(([a, b]) => (
                <div key={b} className="col" style={{ gap: 2 }}>
                  <span className="num" style={{ fontSize: 24, fontWeight: 800, color: "var(--navy)" }}>
                    {a}
                  </span>
                  <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="kiup" style={{ position: "relative" }}>
            <div
              style={{
                position: "relative",
                background: "#fff",
                borderRadius: "var(--r-xl)",
                padding: 28,
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div className="illo illo-sky" style={{ aspectRatio: "1/.82" }}>
                <Illo type="whole" size={300} />
              </div>
              <div
                className="card"
                style={{
                  position: "absolute",
                  bottom: -18,
                  left: -18,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "var(--green-50)",
                    color: "var(--green)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon name="truck" size={19} />
                </span>
                <div className="col" style={{ gap: 0 }}>
                  <span style={{ fontWeight: 800, fontSize: 13.5, color: "var(--ink)" }}>
                    Pengiriman hari ini
                  </span>
                  <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Area Sukabumi & sekitar</span>
                </div>
              </div>
              <div
                className="card"
                style={{
                  position: "absolute",
                  top: -16,
                  right: -14,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <span className="num" style={{ fontSize: 19, fontWeight: 800, color: "var(--navy)" }}>
                  {rupiah(35000)}
                </span>
                <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600 }}>/kg</span>
              </div>
            </div>
          </div>
        </div>
        <Wave color="var(--bg)" height={56} />
      </section>

      <div className="wrap" style={{ padding: "10px 28px 0" }}>
        <div className="row" style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 26 }}>Kategori Produk</h2>
        </div>
        <div className="grid-cards-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 44 }}>
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href="/products"
              className="card kiup"
              style={{
                padding: 16,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div className={`illo illo-${c.tint}`} style={{ aspectRatio: "16/10" }}>
                <Illo type={c.illo} size={120} />
              </div>
              <div className="row">
                <span style={{ fontWeight: 700, fontSize: 15.5, color: "var(--ink)" }}>{c.label}</span>
                <div className="spacer" />
                <span style={{ color: "var(--sky)" }}>
                  <Icon name="arrowR" size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="row" style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 26 }}>Produk Unggulan</h2>
          <div className="spacer" />
          <Link href="/products" className="btn btn-ghost btn-sm">
            Lihat semua <Icon name="arrowR" size={15} />
          </Link>
        </div>

        {loading ? (
          <FeaturedSkeleton />
        ) : error ? (
          <EmptyState icon="info" title={error} />
        ) : featured.length === 0 ? (
          <EmptyState
            icon="pkg"
            title="Belum ada produk"
            hint="Tambah produk lewat panel admin untuk mulai berjualan."
          />
        ) : (
          <div className="grid-cards-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="grid-cards-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, margin: "44px 0 8px" }}>
          {TRUST.map(([ic, t, d]) => (
            <div key={t} className="card" style={{ padding: 22, display: "flex", gap: 14 }}>
              <span
                style={{
                  width: 44,
                  height: 44,
                  flex: "0 0 auto",
                  borderRadius: 13,
                  background: "var(--sky-50)",
                  color: "var(--sky-600)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name={ic} size={23} />
              </span>
              <div className="col" style={{ gap: 4 }}>
                <span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15.5 }}>{t}</span>
                <span style={{ fontSize: 13.5, color: "var(--body)", lineHeight: 1.5 }}>{d}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
      {Array.from({ length: 4 }).map((_, i) => (
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
          <div
            style={{
              height: 12,
              width: "40%",
              background: "var(--bg-2)",
              borderRadius: 6,
              marginTop: 10,
            }}
          />
        </div>
      ))}
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
