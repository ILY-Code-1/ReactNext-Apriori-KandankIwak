"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Illo from "@/components/ui/Illo";
import StatCard from "@/components/admin/StatCard";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { getAllOrders } from "@/lib/firebase/orders";
import { getAllProducts } from "@/lib/firebase/products";
import { rupiah, rupiahShort } from "@/lib/utils/format";

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function toDate(v) {
  if (!v) return null;
  if (v.toDate) return v.toDate();
  if (v instanceof Date) return v;
  return new Date(v);
}

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getAllOrders(), getAllProducts()])
      .then(([o, p]) => {
        setOrders(o);
        setProducts(p);
      })
      .catch(() => setError("Gagal memuat data dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
    const activeProducts = products.filter((p) => p.active !== false);

    const now = new Date();
    const monthlyOrders = orders.filter((o) => {
      const d = toDate(o.created_at);
      return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthlyTotal = monthlyOrders.reduce((s, o) => s + (o.total || 0), 0);

    // top products by qty sold (across all orders)
    const qtyMap = new Map();
    orders.forEach((o) => {
      (o.items || []).forEach((it) => {
        qtyMap.set(it.product_id, (qtyMap.get(it.product_id) || 0) + (it.qty || 0));
      });
    });
    const maxSold = Math.max(1, ...qtyMap.values());
    const topProducts = Array.from(qtyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([id, sold]) => ({
        product: productMap[id] || { id, name: "(produk dihapus)" },
        sold,
        pct: Math.round((sold / maxSold) * 100),
      }));

    // 7-day sales series
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      d.setDate(now.getDate() - (6 - i));
      return d;
    });
    const series = days.map((day) => {
      const start = day.getTime();
      const end = start + 24 * 60 * 60 * 1000;
      const sum = orders.reduce((s, o) => {
        const d = toDate(o.created_at);
        const t = d ? d.getTime() : 0;
        return t >= start && t < end ? s + (o.total || 0) : s;
      }, 0);
      return { day: DAY_LABELS[day.getDay()], value: Math.round(sum / 1000) };
    });

    return {
      activeProducts: activeProducts.length,
      totalOrders: orders.length,
      monthlyTotal,
      monthlyCount: monthlyOrders.length,
      topProducts,
      topProductName: topProducts[0]?.product?.name || "—",
      series,
      recentOrders: orders.slice(0, 4),
    };
  }, [orders, products]);

  if (loading) {
    return (
      <div
        className="col"
        style={{ alignItems: "center", gap: 12, padding: "120px 0" }}
      >
        <span className="ki-spin ki-spin-lg" />
        <span className="mut" style={{ fontWeight: 600 }}>Memuat dashboard…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="card"
        style={{
          padding: "40px 20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
        }}
      >
        <span
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "var(--red-50)",
            color: "var(--red)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name="info" size={28} />
        </span>
        <span style={{ fontWeight: 700, color: "var(--ink)" }}>{error}</span>
      </div>
    );
  }

  const seriesMax = Math.max(1, ...stats.series.map((s) => s.value));

  return (
    <div className="col gap-22 kiup" style={{ minHeight: "calc(100vh - 130px)" }}>
      <div className="stat-cards-row">
        <StatCard
          icon="chart"
          label="Penjualan Bulan Ini"
          value={rupiahShort(stats.monthlyTotal)}
          delta={stats.monthlyCount > 0 ? `${stats.monthlyCount} pesanan` : null}
          tint="green"
        />
        <StatCard
          icon="receipt"
          label="Total Pesanan"
          value={stats.totalOrders}
          tint="sky"
        />
        <StatCard
          icon="pkg"
          label="Produk Aktif"
          value={stats.activeProducts}
          tint="navy"
        />
        <StatCard
          icon="spark"
          label="Produk Terlaris"
          value={stats.topProductName}
          tint="sky"
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}
        className="layout-2col-wide"
      >
        <div className="card" style={{ padding: 24 }}>
          <div className="row" style={{ marginBottom: 22 }}>
            <div className="col" style={{ gap: 2 }}>
              <h3 style={{ fontSize: 18 }}>Penjualan 7 Hari Terakhir</h3>
              <span className="mut" style={{ fontSize: 12.5, fontWeight: 600 }}>
                dalam ribuan Rupiah
              </span>
            </div>
            <div className="spacer" />
            <span className="chip">Minggu ini</span>
          </div>
          {stats.series.every((s) => s.value === 0) ? (
            <div
              className="col"
              style={{ alignItems: "center", gap: 8, padding: "40px 0", textAlign: "center" }}
            >
              <span className="mut" style={{ fontSize: 13 }}>
                Belum ada penjualan dalam 7 hari terakhir.
              </span>
            </div>
          ) : (
            <div
              className="row"
              style={{ alignItems: "flex-end", gap: 16, height: 200, paddingTop: 10 }}
            >
              {stats.series.map((s, i) => (
                <div
                  key={i}
                  className="col"
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: 8,
                    height: "100%",
                    justifyContent: "flex-end",
                  }}
                >
                  <span
                    className="num"
                    style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}
                  >
                    {s.value || ""}
                  </span>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 38,
                      height: `${(s.value / seriesMax) * 100}%`,
                      minHeight: s.value > 0 ? 4 : 0,
                      borderRadius: "8px 8px 4px 4px",
                      background:
                        i === stats.series.length - 1
                          ? "linear-gradient(180deg, var(--sky), var(--sky-600))"
                          : "linear-gradient(180deg, #cfe9f8, #b6ddf2)",
                      transition: "height .5s",
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--body)" }}>
                    {s.day}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 18 }}>Produk Terlaris</h3>
          {stats.topProducts.length === 0 ? (
            <div className="col" style={{ alignItems: "center", gap: 6, padding: "20px 0" }}>
              <span className="mut" style={{ fontSize: 13, textAlign: "center" }}>
                Belum ada data penjualan.
              </span>
            </div>
          ) : (
            <div className="col gap-16">
              {stats.topProducts.map(({ product, sold, pct }) => (
                <div key={product.id} className="col gap-6">
                  <div className="row gap-10">
                    <div
                      className={`illo illo-${product.tint || "sky"}`}
                      style={{
                        width: 38,
                        height: 32,
                        aspectRatio: "auto",
                        flex: "0 0 auto",
                        overflow: "hidden",
                        position: "relative",
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
                        <Illo type={product.illo || "whole"} size={34} />
                      )}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>
                      {product.name}
                    </span>
                    <div className="spacer" />
                    <span className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>
                      {sold}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 7,
                      borderRadius: 999,
                      background: "var(--bg-2)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: "linear-gradient(90deg, var(--sky), var(--navy))",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 18 }}
        className="layout-2col-narrow"
      >
        <div
          className="card"
          style={{
            padding: 24,
            background: "linear-gradient(150deg, var(--navy), var(--navy-900))",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.18,
              background: "radial-gradient(50% 50% at 90% 10%, var(--sky), transparent 60%)",
            }}
          />
          <div style={{ position: "relative" }}>
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: "rgba(255,255,255,.16)",
                display: "grid",
                placeItems: "center",
                marginBottom: 16,
              }}
            >
              <Icon name="spark" size={23} />
            </span>
            <h3 style={{ color: "#fff", fontSize: 19, marginBottom: 8 }}>Analisis Apriori</h3>
            <p style={{ color: "#c2c5ea", fontSize: 13.5, margin: "0 0 18px", lineHeight: 1.55 }}>
              Temukan pola "sering dibeli bersama" dari data transaksi dan tampilkan otomatis di toko.
            </p>
            <Link href="/admin/apriori" className="btn btn-sky">
              Buka Analisis <Icon name="arrowR" size={17} />
            </Link>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="row" style={{ padding: "18px 22px 12px" }}>
            <h3 style={{ fontSize: 18 }}>Pesanan Terbaru</h3>
            <div className="spacer" />
            <Link href="/admin/orders" className="btn btn-ghost btn-sm">
              Lihat semua
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <div
              className="col"
              style={{ alignItems: "center", gap: 8, padding: "40px 20px", textAlign: "center" }}
            >
              <span className="mut" style={{ fontSize: 13 }}>
                Belum ada pesanan. Pesanan dari pelanggan akan muncul di sini.
              </span>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="tbl">
                <tbody>
                  {stats.recentOrders.map((o) => (
                    <tr key={o.code}>
                      <td>
                        <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>
                          {o.code}
                        </span>
                      </td>
                      <td>{o.customer_name}</td>
                      <td className="num" style={{ fontWeight: 700, color: "var(--navy)" }}>
                        {rupiah(o.total)}
                      </td>
                      <td>
                        <OrderStatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
