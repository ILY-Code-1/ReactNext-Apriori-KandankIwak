"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/ui/Icon";
import CopyButton from "@/components/ui/CopyButton";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import { getOrderByCode } from "@/lib/firebase/orders";
import { rupiah, formatDateTime } from "@/lib/utils/format";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp/build-message";

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SuccessPage />
    </Suspense>
  );
}

function SuccessPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code) {
      setLoading(false);
      return;
    }
    getOrderByCode(code)
      .then(setOrder)
      .catch(() => setError("Gagal memuat pesanan."))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return <LoadingState />;

  if (!code || error || !order) {
    return (
      <div className="wrap" style={{ padding: "80px 28px", display: "grid", placeItems: "center" }}>
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
          <h2 style={{ fontSize: 22 }}>Pesanan tidak ditemukan</h2>
          <p className="mut" style={{ margin: 0 }}>
            {error || "Kode pesanan tidak valid atau sudah kedaluwarsa."}
          </p>
          <Link href="/products" className="btn btn-primary">
            Kembali Belanja
          </Link>
        </div>
      </div>
    );
  }

  const pm = order.payment_method;
  const address = order.address;

  const waMessage = buildOrderMessage({
    orderCode: order.code,
    customerName: order.customer_name,
    contact: order.contact,
    items: order.items || [],
    total: order.total,
    address,
    paymentMethod: pm,
    notes: order.notes,
  });
  const waUrl = buildWhatsAppUrl(waMessage);

  return (
    <div className="wrap" style={{ padding: "32px 28px 60px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 26,
          alignItems: "start",
        }}
        className="layout-main-aside"
      >
        <div className="col gap-18">
          {/* Header sukses */}
          <div
            className="card kiup"
            style={{
              padding: 28,
              display: "flex",
              gap: 18,
              alignItems: "center",
              background: "linear-gradient(100deg, var(--green-50), #fff)",
              border: "1px solid #c6ecdb",
            }}
          >
            <span
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                background: "var(--green)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                flex: "0 0 auto",
              }}
            >
              <Icon name="check" size={36} stroke={2.5} />
            </span>
            <div className="col" style={{ gap: 4 }}>
              <h1 style={{ fontSize: 24 }}>Pesanan Berhasil Dibuat</h1>
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--body)", lineHeight: 1.55 }}>
                Lakukan pembayaran sesuai instruksi, lalu klik tombol{" "}
                <b style={{ color: "var(--green)" }}>"Konfirmasi via WhatsApp"</b> untuk
                mengirim bukti transfer ke admin.
              </p>
            </div>
          </div>

          {/* Langkah */}
          <Section title="Langkah Pembayaran" icon="info">
            <ol style={{ margin: 0, paddingLeft: 22, color: "var(--body)", lineHeight: 1.7, fontSize: 14 }}>
              <li>
                Salin <b style={{ color: "var(--ink)" }}>Nomor Rekening</b> dan{" "}
                <b style={{ color: "var(--ink)" }}>Nominal Bayar</b> di bawah.
              </li>
              <li>Lakukan transfer ke rekening yang tertera.</li>
              <li>Simpan / foto bukti transfer.</li>
              <li>
                Klik tombol{" "}
                <b style={{ color: "var(--green)" }}>Konfirmasi via WhatsApp</b>, kemudian
                lampirkan bukti transfer di chat.
              </li>
              <li>
                Status pesanan kamu update sendiri di halaman{" "}
                <Link href={`/track?code=${order.code}`} style={{ color: "var(--sky-600)", fontWeight: 700 }}>
                  Lacak Pesanan
                </Link>
                .
              </li>
            </ol>
          </Section>

          {/* ID Transaksi + Total */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
            className="grid-cards-2"
          >
            <InfoCopyCard
              label="ID Transaksi"
              value={order.code}
              copyText={order.code}
              accent="navy"
            />
            <InfoCopyCard
              label="Nominal Bayar"
              value={rupiah(order.total)}
              copyText={String(Math.round(order.total || 0))}
              accent="sky"
            />
          </div>

          {/* Rekening tujuan */}
          <Section title="Rekening Tujuan Transfer" icon="card">
            {pm ? (
              <PaymentBlock method={pm} />
            ) : (
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
                Metode pembayaran tidak tercatat. Tanya admin via WhatsApp.
              </div>
            )}
          </Section>

          {/* Item pesanan */}
          <Section title="Detail Pesanan" icon="receipt">
            <div className="col gap-12">
              {(order.items || []).map((it) => (
                <div key={it.product_id} className="row gap-12">
                  <div className="col" style={{ gap: 0, flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14.5 }}>
                      {it.name}
                    </span>
                    <span style={{ fontSize: 12.5, color: "var(--muted)" }}>
                      {it.qty} × {rupiah(it.price)}
                    </span>
                  </div>
                  <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>
                    {rupiah((it.price || 0) * (it.qty || 0))}
                  </span>
                </div>
              ))}
              <div
                className="row"
                style={{ borderTop: "1px dashed var(--line)", paddingTop: 12 }}
              >
                <span style={{ fontWeight: 800, color: "var(--ink)" }}>Total</span>
                <div className="spacer" />
                <span
                  className="num"
                  style={{ fontWeight: 800, color: "var(--navy)", fontSize: 18 }}
                >
                  {rupiah(order.total)}
                </span>
              </div>
            </div>
          </Section>

          {/* Alamat pengiriman */}
          <Section title="Alamat Pengiriman" icon="map">
            <div className="col gap-4">
              <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                {order.customer_name}
              </span>
              <span className="num" style={{ color: "var(--body)" }}>
                {order.contact}
              </span>
              {address && (
                <span style={{ color: "var(--body)", marginTop: 6 }}>
                  {address.detail}
                  <br />
                  Kel. {address.kelurahan_name}, Kec. {address.kecamatan_name},
                  Kabupaten Tangerang
                </span>
              )}
              {order.notes && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 10,
                    borderRadius: 10,
                    background: "var(--bg)",
                    fontSize: 13,
                  }}
                >
                  <span className="mut" style={{ fontWeight: 700 }}>Catatan: </span>
                  {order.notes}
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* Aside aksi */}
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
          <div className="col" style={{ gap: 2 }}>
            <span className="mut" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>
              Dibuat
            </span>
            <span style={{ fontWeight: 700, color: "var(--ink)" }}>
              {formatDateTime(order.created_at)}
            </span>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-lg btn-block"
          >
            <WhatsappIcon size={20} /> Konfirmasi via WhatsApp
          </a>
          <Link
            href={`/track?code=${encodeURIComponent(order.code)}`}
            className="btn btn-outline btn-block"
          >
            Lacak Pesanan
          </Link>
          <Link href="/products" className="btn btn-ghost btn-block">
            Belanja Lagi
          </Link>

          <div
            className="row gap-8"
            style={{
              background: "var(--sky-50)",
              borderRadius: 12,
              padding: "10px 12px",
              color: "var(--navy)",
            }}
          >
            <Icon name="info" size={16} />
            <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.45 }}>
              Simpan ID transaksi <b className="num">{order.code}</b> untuk lacak status.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="wrap"
      style={{ padding: "120px 28px", display: "grid", placeItems: "center" }}
    >
      <div className="col" style={{ alignItems: "center", gap: 12 }}>
        <span className="ki-spin ki-spin-lg" />
        <span className="mut" style={{ fontWeight: 600 }}>Memuat detail pesanan…</span>
      </div>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="row gap-10" style={{ marginBottom: 14 }}>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "var(--sky-50)",
            color: "var(--sky-600)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name={icon} size={17} />
        </span>
        <h3 style={{ fontSize: 16 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoCopyCard({ label, value, copyText, accent }) {
  const isSky = accent === "sky";
  return (
    <div
      className="card"
      style={{
        padding: 18,
        background: isSky ? "var(--sky-50)" : "#fff",
        border: `2px dashed ${isSky ? "var(--sky)" : "var(--line)"}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
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
      <div className="row gap-10">
        <span
          className="num"
          style={{
            fontSize: 19,
            fontWeight: 800,
            color: isSky ? "var(--navy)" : "var(--ink)",
            flex: 1,
            wordBreak: "break-all",
            lineHeight: 1.2,
          }}
        >
          {value}
        </span>
        <CopyButton value={copyText} />
      </div>
    </div>
  );
}

function PaymentBlock({ method }) {
  const [imgError, setImgError] = useState(false);
  const label = (method.payment_method || "").toUpperCase();
  return (
    <div
      className="row gap-14"
      style={{
        padding: 16,
        borderRadius: 14,
        background: "var(--bg)",
        alignItems: "center",
      }}
    >
      <span
        style={{
          width: 60,
          height: 60,
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
      <div className="col" style={{ gap: 4, flex: 1, minWidth: 0 }}>
        <span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 16 }}>
          {label}
        </span>
        <span className="num" style={{ fontSize: 18, fontWeight: 800, color: "var(--navy)", wordBreak: "break-all" }}>
          {method.account_number}
        </span>
        <span className="mut" style={{ fontSize: 12.5 }}>
          a.n. {method.account_name}
        </span>
      </div>
      <CopyButton
        value={method.account_number}
        label="Salin Rekening"
        copiedLabel="Tersalin"
        size="lg"
      />
    </div>
  );
}
