"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import Illo from "@/components/ui/Illo";
import { useCart } from "@/context/CartContext";
import { getAllProducts } from "@/lib/firebase/products";
import { getAllPaymentMethods } from "@/lib/firebase/payment-methods";
import { addOrderAndTransaction } from "@/lib/firebase/orders";
import { generateOrderCode } from "@/lib/utils/order-code";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp/build-message";
import { rupiah } from "@/lib/utils/format";

const SHIPPING_FLAT = 12000;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, hydrated, clear } = useCart();
  const [productMap, setProductMap] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [form, setForm] = useState({ name: "", contact: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    Promise.all([getAllProducts({ onlyActive: true }), getAllPaymentMethods()])
      .then(([products, methods]) => {
        setProductMap(Object.fromEntries(products.map((p) => [p.id, p])));
        setPaymentMethods(methods);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  const cartItems = useMemo(() => {
    return Object.entries(items)
      .map(([id, qty]) => ({ product: productMap[id], qty }))
      .filter((x) => x.product);
  }, [items, productMap]);

  const subtotal = cartItems.reduce((s, x) => s + x.product.price * x.qty, 0);
  const shipping = cartItems.length > 0 ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!hydrated || loadingProducts) return;
    if (success) return;
    if (cartItems.length === 0) router.replace("/cart");
  }, [hydrated, loadingProducts, cartItems.length, success, router]);

  const valid =
    form.name.trim().length > 0 &&
    form.contact.trim().length > 0 &&
    cartItems.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const orderCode = await generateOrderCode();

      const orderItems = cartItems.map((x) => ({
        product_id: x.product.id,
        name: x.product.name,
        price: x.product.price,
        qty: x.qty,
      }));
      const transactionItems = Array.from(
        new Set(orderItems.map((it) => it.product_id)),
      );

      await addOrderAndTransaction(
        orderCode,
        {
          items: orderItems,
          total,
          customer_name: form.name.trim(),
          contact: form.contact.trim(),
          notes: form.notes.trim(),
        },
        { items: transactionItems },
      );

      const message = buildOrderMessage({
        orderCode,
        customerName: form.name.trim(),
        contact: form.contact.trim(),
        items: orderItems,
        total,
        notes: form.notes.trim(),
      });
      const waUrl = buildWhatsAppUrl(message);

      clear();
      setSuccess({ code: orderCode, total, waUrl });

      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      setError("Gagal membuat pesanan. Periksa koneksi dan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated || loadingProducts) {
    return (
      <div
        className="wrap"
        style={{ padding: "120px 28px", display: "grid", placeItems: "center" }}
      >
        <div className="col" style={{ alignItems: "center", gap: 12 }}>
          <span className="ki-spin ki-spin-lg" />
          <span className="mut" style={{ fontWeight: 600 }}>Menyiapkan checkout…</span>
        </div>
      </div>
    );
  }

  if (success) {
    return <SuccessCard success={success} paymentMethods={paymentMethods} />;
  }

  return (
    <div className="wrap" style={{ padding: "32px 28px 0" }}>
      <Link
        href="/cart"
        className="row gap-6"
        style={{ fontSize: 13.5, fontWeight: 600, color: "var(--muted)", marginBottom: 14 }}
      >
        <Icon name="chevL" size={16} /> Kembali ke keranjang
      </Link>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="layout-main-aside"
        style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 26, alignItems: "start" }}
      >
        <div className="col gap-18">
          <div className="card" style={{ padding: 24 }}>
            <div className="row gap-10" style={{ marginBottom: 18 }}>
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "var(--sky-50)",
                  color: "var(--sky-600)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name="user" size={19} />
              </span>
              <h3 style={{ fontSize: 18 }}>Data Pemesan</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field">
                <label>Nama Lengkap</label>
                <input
                  className="input"
                  placeholder="cth. Budi Santoso"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="field">
                <label>No. WhatsApp</label>
                <input
                  className="input"
                  placeholder="08xx xxxx xxxx"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="field" style={{ gridColumn: "1/3" }}>
                <label>Catatan (opsional)</label>
                <textarea
                  className="input"
                  rows="3"
                  style={{ resize: "vertical" }}
                  placeholder="cth. Alamat pengiriman, jam antar, atau permintaan khusus"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: 22,
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              background: "linear-gradient(100deg, var(--green-50), #fff)",
              border: "1px solid #c6ecdb",
            }}
          >
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "var(--green)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                flex: "0 0 auto",
              }}
            >
              <WhatsappIcon size={22} />
            </span>
            <div className="col" style={{ gap: 4 }}>
              <h3 style={{ fontSize: 16 }}>Konfirmasi via WhatsApp</h3>
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--body)", lineHeight: 1.55 }}>
                Setelah klik tombol di bawah, sistem mencatat pesanan dan membuka
                WhatsApp admin dengan rincian. Bukti transfer & alamat pengiriman
                final dikoordinasikan di chat.
              </p>
            </div>
          </div>
        </div>

        <aside
          className="card"
          style={{
            padding: 22,
            position: "sticky",
            top: 88,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <h3 style={{ fontSize: 18 }}>Ringkasan Pesanan</h3>
          <div className="col gap-12" style={{ maxHeight: 230, overflow: "auto" }}>
            {cartItems.map((x) => (
              <div key={x.product.id} className="row gap-10">
                <div
                  className={`illo illo-${x.product.tint || "sky"}`}
                  style={{
                    width: 46,
                    height: 40,
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
                    <Illo type={x.product.illo || "whole"} size={42} />
                  )}
                </div>
                <div className="col" style={{ gap: 0, flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "var(--ink)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {x.product.name}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                    {x.qty} × {rupiah(x.product.price)}
                  </span>
                </div>
                <span className="num" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>
                  {rupiah(x.product.price * x.qty)}
                </span>
              </div>
            ))}
          </div>
          <div
            className="col gap-8"
            style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 12 }}
          >
            <div className="row">
              <span className="mut" style={{ fontSize: 13.5 }}>Subtotal</span>
              <div className="spacer" />
              <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>
                {rupiah(subtotal)}
              </span>
            </div>
            <div className="row">
              <span className="mut" style={{ fontSize: 13.5 }}>Ongkir</span>
              <div className="spacer" />
              <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>
                {rupiah(shipping)}
              </span>
            </div>
            <div className="row" style={{ borderTop: "1px dashed var(--line)", paddingTop: 10 }}>
              <span style={{ fontWeight: 800, color: "var(--ink)" }}>Total</span>
              <div className="spacer" />
              <span className="num" style={{ fontWeight: 800, color: "var(--navy)", fontSize: 21 }}>
                {rupiah(total)}
              </span>
            </div>
          </div>

          {error && (
            <div
              className="row gap-8"
              style={{
                background: "var(--red-50)",
                color: "var(--red)",
                padding: "10px 12px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Icon name="info" size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success btn-lg btn-block"
            disabled={!valid || submitting}
          >
            {submitting ? (
              <>
                <span className="ki-spin" /> Memproses…
              </>
            ) : valid ? (
              <>
                <WhatsappIcon size={18} /> Pesan via WhatsApp
              </>
            ) : (
              "Lengkapi data dulu"
            )}
          </button>
          <span style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "center" }}>
            Dengan memesan, Anda menyetujui ketentuan Kandank Iwak.
          </span>
        </aside>
      </form>
    </div>
  );
}

function SuccessCard({ success, paymentMethods = [] }) {
  return (
    <div className="wrap" style={{ padding: "40px 28px 60px", display: "grid", placeItems: "center" }}>
      <div
        className="card kiup"
        style={{
          padding: 32,
          maxWidth: 560,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 18,
        }}
      >
        <div className="col" style={{ alignItems: "center", gap: 10, textAlign: "center" }}>
          <span
            style={{
              width: 76,
              height: 76,
              borderRadius: 999,
              background: "var(--green-50)",
              color: "var(--green)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="check" size={42} stroke={2.5} />
          </span>
          <h2 style={{ fontSize: 26 }}>Pesanan Dibuat!</h2>
          <p className="mut" style={{ margin: 0 }}>
            Lakukan pembayaran ke salah satu rekening di bawah, lalu kirim bukti
            transfer via WhatsApp.
          </p>
        </div>

        <CopyRow label="Kode Pesanan" value={success.code} mono />
        <CopyRow
          label="Total yang harus dibayar"
          value={rupiah(success.total)}
          copyText={String(Math.round(success.total))}
          accent
        />

        <div className="col gap-10">
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".04em",
              color: "var(--muted)",
            }}
          >
            Metode Pembayaran
          </span>
          {paymentMethods.length === 0 ? (
            <div
              className="row gap-8"
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                background: "var(--amber-50)",
                color: "#b9810a",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Icon name="info" size={16} />
              Admin belum menambah metode pembayaran. Tanya lewat WhatsApp.
            </div>
          ) : (
            paymentMethods.map((m) => <PaymentMethodRow key={m.id} method={m} />)
          )}
        </div>

        <a
          href={success.waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success btn-lg btn-block"
        >
          <WhatsappIcon size={20} /> Buka WhatsApp
        </a>
        <Link href={`/track?code=${success.code}`} className="btn btn-outline btn-block">
          Lacak Pesanan
        </Link>
        <Link href="/products" className="btn btn-ghost btn-block">
          Belanja Lagi
        </Link>
      </div>
    </div>
  );
}

function CopyRow({ label, value, copyText, mono, accent }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(copyText ?? value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={handle}
      className="card card-line"
      style={{
        padding: 14,
        boxShadow: "none",
        cursor: "pointer",
        border: `2px dashed ${accent ? "var(--sky)" : "var(--line)"}`,
        background: accent ? "var(--sky-50)" : "#fff",
        textAlign: "left",
        width: "100%",
      }}
    >
      <div className="row gap-10">
        <div className="col" style={{ gap: 2, flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".04em",
              color: "var(--muted)",
            }}
          >
            {label}
          </span>
          <span
            className={mono ? "num" : ""}
            style={{
              fontSize: accent ? 22 : 18,
              fontWeight: 800,
              color: accent ? "var(--navy)" : "var(--ink)",
              wordBreak: "break-all",
            }}
          >
            {value}
          </span>
        </div>
        <span
          className="row gap-6"
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: copied ? "var(--green)" : "var(--sky-600)",
            flex: "0 0 auto",
          }}
        >
          <Icon name={copied ? "check" : "copy"} size={15} stroke={2.5} />
          {copied ? "Tersalin" : "Salin"}
        </span>
      </div>
    </button>
  );
}

function PaymentMethodRow({ method }) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const label = (method.payment_method || "").toUpperCase();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(method.account_number || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div
      className="row gap-12"
      style={{
        padding: 12,
        borderRadius: 12,
        background: "var(--bg)",
        alignItems: "center",
      }}
    >
      <span
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          background: "#fff",
          display: "grid",
          placeItems: "center",
          flex: "0 0 auto",
          boxShadow: "inset 0 0 0 1px var(--line)",
          overflow: "hidden",
        }}
      >
        {imgError ? (
          <Icon name="card" size={26} style={{ color: "var(--muted)" }} />
        ) : (
          <img
            src={`/payment-icon/${method.payment_method}.webp`}
            alt={label}
            onError={() => setImgError(true)}
            style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }}
          />
        )}
      </span>
      <div className="col" style={{ gap: 2, flex: 1, minWidth: 0 }}>
        <div className="row gap-8">
          <span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 14.5 }}>
            {label}
          </span>
          <span className="mut" style={{ fontSize: 12.5 }}>
            a.n. {method.account_name}
          </span>
        </div>
        <span
          className="num"
          style={{ fontSize: 17, fontWeight: 800, color: "var(--navy)", wordBreak: "break-all" }}
        >
          {method.account_number}
        </span>
      </div>
      <button
        type="button"
        onClick={copy}
        className="row gap-6"
        style={{
          padding: "8px 12px",
          borderRadius: 999,
          fontSize: 12.5,
          fontWeight: 700,
          color: copied ? "#fff" : "var(--sky-600)",
          background: copied ? "var(--green)" : "var(--sky-50)",
          flex: "0 0 auto",
        }}
      >
        <Icon name={copied ? "check" : "copy"} size={14} stroke={2.5} />
        {copied ? "Tersalin" : "Salin"}
      </button>
    </div>
  );
}
