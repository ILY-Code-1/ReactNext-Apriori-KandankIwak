"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import { getOrderByCode } from "@/lib/firebase/orders";
import { ORDER_STATUS_FLOW } from "@/lib/firebase/collections";
import { rupiah, formatDateTime } from "@/lib/utils/format";

const STATUS_LABELS = {
  ordered: "Dipesan",
  paid: "Dibayar",
  shipped: "Dikirim",
  completed: "Selesai",
};

const STATUS_DESC = {
  ordered: "Pesanan sudah kami terima dan menunggu konfirmasi pembayaran.",
  paid: "Pembayaran terkonfirmasi. Pesanan sedang kami siapkan.",
  shipped: "Pesanan sedang dalam perjalanan ke alamat kamu.",
  completed: "Pesanan sudah sampai. Terima kasih sudah belanja!",
};

const STATUS_ICONS = {
  ordered: "receipt",
  paid: "check",
  shipped: "truck",
  completed: "spark",
};

export default function TrackPage() {
  const searchParams = useSearchParams();
  const initialCode = (searchParams.get("code") || "").toUpperCase();
  const [code, setCode] = useState(initialCode);
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialCode) {
      lookup(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function lookup(rawCode) {
    const clean = rawCode.trim().toUpperCase();
    if (!clean) return;
    setSearched(clean);
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const result = await getOrderByCode(clean);
      setOrder(result);
    } catch {
      setError("Gagal mengambil data. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    lookup(code);
  };

  const currentStep = order ? ORDER_STATUS_FLOW.indexOf(order.status) : -1;

  return (
    <div className="wrap" style={{ padding: "32px 28px 60px" }}>
      <div className="col gap-6" style={{ marginBottom: 22 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>
          Beranda / Lacak Pesanan
        </span>
        <h1 style={{ fontSize: 32 }}>Lacak Pesanan</h1>
        <p style={{ margin: 0, color: "var(--body)", maxWidth: 520 }}>
          Masukkan kode pesanan yang kamu terima saat checkout untuk melihat status terkini.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="card"
        style={{
          padding: 24,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 14,
          alignItems: "end",
          maxWidth: 720,
        }}
      >
        <div className="field">
          <label>Kode Pesanan</label>
          <input
            className="input num"
            placeholder="cth. KI-20260606-001"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading || !code.trim()}
        >
          {loading ? (
            <>
              <span className="ki-spin" /> Mencari…
            </>
          ) : (
            <>
              <Icon name="search" size={18} /> Lacak
            </>
          )}
        </button>
      </form>

      {error && (
        <div
          className="row gap-8"
          style={{
            marginTop: 22,
            maxWidth: 720,
            background: "var(--red-50)",
            color: "var(--red)",
            padding: "12px 16px",
            borderRadius: 12,
            fontSize: 13.5,
            fontWeight: 600,
          }}
        >
          <Icon name="info" size={16} /> {error}
        </div>
      )}

      {searched && !loading && !order && !error && (
        <div
          className="card kiup"
          style={{
            marginTop: 22,
            padding: 32,
            maxWidth: 720,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
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
          <h3 style={{ fontSize: 19 }}>Kode tidak ditemukan</h3>
          <p className="mut" style={{ margin: 0 }}>
            Periksa kembali kode{" "}
            <span className="num" style={{ color: "var(--ink)", fontWeight: 700 }}>
              {searched}
            </span>
            . Pastikan penulisan sesuai dengan kode yang kamu terima saat checkout.
          </p>
        </div>
      )}

      {order && (
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 22,
            alignItems: "start",
          }}
          className="layout-main-aside"
        >
          <div className="col gap-18">
            <div className="card kiup" style={{ padding: 26 }}>
              <div className="row" style={{ marginBottom: 18 }}>
                <div className="col" style={{ gap: 4 }}>
                  <span className="mut" style={{ fontSize: 12.5, fontWeight: 600 }}>
                    Kode Pesanan
                  </span>
                  <span className="num" style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)" }}>
                    {order.code}
                  </span>
                </div>
                <div className="spacer" />
                <span className="chip">{formatDateTime(order.created_at)}</span>
              </div>

              <div
                className="col gap-14"
                style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 18 }}
              >
                {ORDER_STATUS_FLOW.map((s, i) => {
                  const reached = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={s} className="row gap-14" style={{ alignItems: "flex-start" }}>
                      <div
                        className="col"
                        style={{ alignItems: "center", gap: 4, flex: "0 0 auto" }}
                      >
                        <span
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 999,
                            background: reached ? "var(--sky)" : "var(--bg-2)",
                            color: reached ? "#fff" : "var(--muted)",
                            display: "grid",
                            placeItems: "center",
                            boxShadow: active ? "0 0 0 4px var(--sky-100)" : "none",
                          }}
                        >
                          <Icon name={STATUS_ICONS[s]} size={18} stroke={2.5} />
                        </span>
                        {i < ORDER_STATUS_FLOW.length - 1 && (
                          <span
                            style={{
                              width: 2,
                              flex: 1,
                              minHeight: 24,
                              background: i < currentStep ? "var(--sky)" : "var(--line)",
                            }}
                          />
                        )}
                      </div>
                      <div className="col" style={{ gap: 2, paddingTop: 4 }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: reached ? "var(--ink)" : "var(--muted)",
                            fontSize: 15,
                          }}
                        >
                          {STATUS_LABELS[s]}
                        </span>
                        <span style={{ fontSize: 13, color: "var(--body)" }}>
                          {STATUS_DESC[s]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 17, marginBottom: 14 }}>Item Pesanan</h3>
              <div className="col gap-12">
                {(order.items || []).map((it) => (
                  <div key={it.product_id} className="row gap-12">
                    <div className="col" style={{ gap: 0, flex: 1 }}>
                      <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14.5 }}>
                        {it.name}
                      </span>
                      <span style={{ fontSize: 12.5, color: "var(--muted)" }}>
                        {it.qty} × {rupiah(it.price)}
                      </span>
                    </div>
                    <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>
                      {rupiah(it.price * it.qty)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside
            className="card"
            style={{
              padding: 24,
              position: "sticky",
              top: 88,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <h3 style={{ fontSize: 17 }}>Ringkasan</h3>
            <div className="col gap-10">
              <div className="row">
                <span className="mut" style={{ fontSize: 13.5 }}>Pemesan</span>
                <div className="spacer" />
                <span style={{ fontWeight: 700, color: "var(--ink)", textAlign: "right" }}>
                  {order.customer_name}
                </span>
              </div>
              <div className="row">
                <span className="mut" style={{ fontSize: 13.5 }}>Kontak</span>
                <div className="spacer" />
                <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>
                  {order.contact}
                </span>
              </div>
              {order.notes && (
                <div className="row" style={{ alignItems: "flex-start" }}>
                  <span className="mut" style={{ fontSize: 13.5 }}>Catatan</span>
                  <div className="spacer" />
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--ink)",
                      textAlign: "right",
                      maxWidth: 200,
                    }}
                  >
                    {order.notes}
                  </span>
                </div>
              )}
              <div className="row" style={{ borderTop: "1px dashed var(--line)", paddingTop: 12 }}>
                <span style={{ fontWeight: 800, color: "var(--ink)" }}>Total</span>
                <div className="spacer" />
                <span className="num" style={{ fontWeight: 800, color: "var(--navy)", fontSize: 20 }}>
                  {rupiah(order.total)}
                </span>
              </div>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-block"
            >
              <WhatsappIcon size={18} /> Chat Admin
            </a>
            <Link href="/products" className="btn btn-ghost btn-block">
              Belanja lagi
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
