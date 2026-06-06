"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Illo from "@/components/ui/Illo";
import Stepper from "@/components/ui/Stepper";
import BoughtTogether from "@/components/store/BoughtTogether";
import { useCart } from "@/context/CartContext";
import { getAllProducts } from "@/lib/firebase/products";
import { rupiah } from "@/lib/utils/format";

const SHIPPING_FLAT = 12000;

export default function CartPage() {
  const { items, hydrated, setQty, remove } = useCart();
  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts({ onlyActive: true })
      .then((all) => {
        setProductMap(Object.fromEntries(all.map((p) => [p.id, p])));
      })
      .finally(() => setLoading(false));
  }, []);

  const cartItems = useMemo(() => {
    return Object.entries(items)
      .map(([id, qty]) => ({ product: productMap[id], qty }))
      .filter((x) => x.product);
  }, [items, productMap]);

  const subtotal = cartItems.reduce((s, x) => s + x.product.price * x.qty, 0);
  const shipping = cartItems.length > 0 ? SHIPPING_FLAT : 0;

  if (!hydrated || loading) {
    return (
      <div
        className="wrap"
        style={{ padding: "120px 28px", display: "grid", placeItems: "center" }}
      >
        <div className="col" style={{ alignItems: "center", gap: 12 }}>
          <span className="ki-spin ki-spin-lg" />
          <span className="mut" style={{ fontWeight: 600 }}>Memuat keranjang…</span>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="wrap" style={{ padding: "60px 28px", display: "grid", placeItems: "center" }}>
        <div className="col" style={{ alignItems: "center", gap: 16, textAlign: "center" }}>
          <span
            style={{
              width: 84,
              height: 84,
              borderRadius: 24,
              background: "var(--sky-50)",
              color: "var(--sky)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="cart" size={40} />
          </span>
          <h2 style={{ fontSize: 24 }}>Keranjang masih kosong</h2>
          <p className="mut" style={{ margin: 0 }}>
            Yuk pilih nila segar dan produk favorit Anda.
          </p>
          <Link href="/products" className="btn btn-primary btn-lg">
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ padding: "32px 28px 0" }}>
      <h1 style={{ fontSize: 32, marginBottom: 6 }}>Keranjang Belanja</h1>
      <p className="mut" style={{ marginTop: 0, marginBottom: 24 }}>
        {cartItems.length} jenis produk di keranjang Anda
      </p>

      <div
        className="layout-main-aside"
        style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 26, alignItems: "start" }}
      >
        <div className="col gap-16">
          <div className="card" style={{ overflow: "hidden" }}>
            {cartItems.map((x, i) => (
              <div
                key={x.product.id}
                className="row gap-16"
                style={{ padding: 18, borderTop: i ? "1px solid var(--line-soft)" : "none" }}
              >
                <div
                  className={`illo illo-${x.product.tint || "sky"}`}
                  style={{
                    width: 84,
                    height: 72,
                    aspectRatio: "auto",
                    flex: "0 0 auto",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {x.product.image_url ? (
                    <img
                      src={x.product.image_url}
                      alt={x.product.name}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Illo type={x.product.illo || "whole"} size={76} />
                  )}
                </div>
                <div className="col" style={{ gap: 4, flex: 1, minWidth: 0 }}>
                  <Link
                    href={`/products/${x.product.id}`}
                    style={{ fontWeight: 700, color: "var(--ink)", fontSize: 16 }}
                  >
                    {x.product.name}
                  </Link>
                  <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>
                    {x.product.category} · {x.product.unit}
                  </span>
                  <span
                    className="num"
                    style={{ fontWeight: 800, color: "var(--navy)", fontSize: 15.5 }}
                  >
                    {rupiah(x.product.price)}
                  </span>
                </div>
                <div className="col gap-10" style={{ alignItems: "flex-end" }}>
                  <Stepper
                    value={x.qty}
                    onChange={(v) => setQty(x.product.id, v)}
                    max={Math.max(1, x.product.stock || 1)}
                  />
                  <button
                    type="button"
                    className="row gap-4"
                    onClick={() => remove(x.product.id)}
                    style={{ fontSize: 12.5, color: "var(--red)", fontWeight: 600 }}
                  >
                    <Icon name="trash" size={14} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <BoughtTogether recs={[]} />
        </div>

        <aside
          className="card"
          style={{
            padding: 22,
            position: "sticky",
            top: 88,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h3 style={{ fontSize: 19 }}>Ringkasan Belanja</h3>
          <div className="col gap-10">
            <div className="row">
              <span className="mut" style={{ fontSize: 14 }}>Subtotal</span>
              <div className="spacer" />
              <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>
                {rupiah(subtotal)}
              </span>
            </div>
            <div className="row">
              <span className="mut" style={{ fontSize: 14 }}>Ongkos kirim</span>
              <div className="spacer" />
              <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>
                {rupiah(shipping)}
              </span>
            </div>
            <div className="row" style={{ borderTop: "1px dashed var(--line)", paddingTop: 12 }}>
              <span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 16 }}>Total</span>
              <div className="spacer" />
              <span
                className="num"
                style={{ fontWeight: 800, color: "var(--navy)", fontSize: 22 }}
              >
                {rupiah(subtotal + shipping)}
              </span>
            </div>
          </div>
          <Link href="/checkout" className="btn btn-sky btn-lg btn-block">
            Lanjut ke Checkout <Icon name="arrowR" size={18} />
          </Link>
          <Link href="/products" className="btn btn-ghost btn-block">
            Tambah produk lain
          </Link>
          <div
            className="row gap-8"
            style={{
              background: "var(--green-50)",
              borderRadius: 12,
              padding: "10px 12px",
              color: "var(--green)",
            }}
          >
            <Icon name="truck" size={18} />
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>
              Pengiriman dikoordinasi langsung dengan admin via WhatsApp.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
