"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { getAllOrders, updateOrderStatus } from "@/lib/firebase/orders";
import { ORDER_STATUS, ORDER_STATUS_FLOW } from "@/lib/firebase/collections";
import { rupiah, formatDateTime } from "@/lib/utils/format";

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: ORDER_STATUS.ORDERED, label: "Dipesan" },
  { id: ORDER_STATUS.PAID, label: "Dibayar" },
  { id: ORDER_STATUS.SHIPPED, label: "Dikirim" },
  { id: ORDER_STATUS.COMPLETED, label: "Selesai" },
];

const NEXT_LABELS = {
  [ORDER_STATUS.ORDERED]: "Tandai Dibayar",
  [ORDER_STATUS.PAID]: "Tandai Dikirim",
  [ORDER_STATUS.SHIPPED]: "Tandai Selesai",
};

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const [busyCode, setBusyCode] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch {
      setError("Gagal memuat pesanan.");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  async function advance(order) {
    const idx = ORDER_STATUS_FLOW.indexOf(order.status);
    if (idx < 0 || idx >= ORDER_STATUS_FLOW.length - 1) return;
    const next = ORDER_STATUS_FLOW[idx + 1];

    setBusyCode(order.code);
    try {
      await updateOrderStatus(order.code, next);
      setOrders((all) =>
        all.map((o) => (o.code === order.code ? { ...o, status: next } : o)),
      );
      if (detail?.code === order.code) {
        setDetail({ ...detail, status: next });
      }
      showToast(`Status ${order.code} diperbarui`);
    } catch {
      showToast("Gagal memperbarui status");
    } finally {
      setBusyCode(null);
    }
  }

  const counts = useMemo(
    () => ({
      all: orders.length,
      [ORDER_STATUS.ORDERED]: orders.filter((o) => o.status === ORDER_STATUS.ORDERED).length,
      [ORDER_STATUS.PAID]: orders.filter((o) => o.status === ORDER_STATUS.PAID).length,
      [ORDER_STATUS.SHIPPED]: orders.filter((o) => o.status === ORDER_STATUS.SHIPPED).length,
      [ORDER_STATUS.COMPLETED]: orders.filter((o) => o.status === ORDER_STATUS.COMPLETED).length,
    }),
    [orders],
  );

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="col gap-18 kiup" style={{ minHeight: "calc(100vh - 130px)" }}>
      <div className="row gap-8" style={{ flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className="row gap-8"
            style={{
              padding: "9px 16px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 13.5,
              background: filter === f.id ? "var(--navy)" : "#fff",
              color: filter === f.id ? "#fff" : "var(--body)",
              boxShadow: filter === f.id ? "var(--shadow)" : "inset 0 0 0 1px var(--line)",
            }}
          >
            {f.label} <span className="num" style={{ opacity: 0.7 }}>{counts[f.id]}</span>
          </button>
        ))}
        <div className="spacer" />
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={refresh}
          disabled={loading}
        >
          {loading ? <span className="ki-spin" /> : <Icon name="chevR" size={14} />} Refresh
        </button>
      </div>

      {error && (
        <div
          className="row gap-8"
          style={{
            background: "var(--red-50)",
            color: "var(--red)",
            padding: "10px 14px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Icon name="info" size={16} /> {error}
        </div>
      )}

      <div className="card" style={{ overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        {loading ? (
          <div
            className="col"
            style={{ alignItems: "center", gap: 12, padding: "60px 0" }}
          >
            <span className="ki-spin ki-spin-lg" />
            <span className="mut" style={{ fontWeight: 600 }}>Memuat pesanan…</span>
          </div>
        ) : shown.length === 0 ? (
          <div
            className="col"
            style={{
              alignItems: "center",
              gap: 10,
              padding: "60px 20px",
              textAlign: "center",
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
              <Icon name="receipt" size={28} />
            </span>
            <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 16 }}>
              {filter === "all"
                ? "Belum ada pesanan"
                : "Tidak ada pesanan pada status ini"}
            </span>
            <span className="mut" style={{ fontSize: 13.5, maxWidth: 320 }}>
              {filter === "all"
                ? "Pesanan dari pelanggan akan muncul di sini setelah checkout."
                : "Coba pilih filter lain."}
            </span>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Pelanggan</th>
                  <th>Item</th>
                  <th>Total</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((o) => (
                  <tr key={o.code}>
                    <td>
                      <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>
                        {o.code}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--ink)" }}>{o.customer_name}</td>
                    <td>
                      <div className="row gap-4" style={{ flexWrap: "wrap" }}>
                        {(o.items || []).slice(0, 3).map((it, i) => (
                          <span
                            key={i}
                            className="chip chip-ink"
                            style={{ padding: "3px 9px", fontSize: 11.5 }}
                          >
                            {it.name?.split(" ").slice(0, 2).join(" ") || it.product_id}
                          </span>
                        ))}
                        {(o.items || []).length > 3 && (
                          <span
                            className="chip chip-ink"
                            style={{ padding: "3px 9px", fontSize: 11.5 }}
                          >
                            +{(o.items || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="num" style={{ fontWeight: 700, color: "var(--navy)" }}>
                      {rupiah(o.total)}
                    </td>
                    <td className="mut" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
                      {formatDateTime(o.created_at)}
                    </td>
                    <td>
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td>
                      <div className="row gap-6" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setDetail(o)}
                        >
                          Detail
                        </button>
                        {NEXT_LABELS[o.status] ? (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            disabled={busyCode === o.code}
                            onClick={() => advance(o)}
                          >
                            {busyCode === o.code ? (
                              <span className="ki-spin" />
                            ) : (
                              <>
                                {NEXT_LABELS[o.status]} <Icon name="arrowR" size={14} />
                              </>
                            )}
                          </button>
                        ) : (
                          <span
                            className="row gap-4"
                            style={{
                              color: "var(--green)",
                              fontSize: 13,
                              fontWeight: 700,
                              paddingRight: 4,
                            }}
                          >
                            <Icon name="check" size={15} stroke={2.5} /> Selesai
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detail && (
        <div
          onClick={() => setDetail(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(28,26,77,.4)",
            backdropFilter: "blur(3px)",
            display: "grid",
            placeItems: "center",
            zIndex: 100,
          }}
        >
          <div
            className="card kiup"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 540,
              maxWidth: "94vw",
              maxHeight: "90vh",
              overflow: "auto",
              padding: 26,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="row" style={{ marginBottom: 18 }}>
              <div className="col" style={{ gap: 2 }}>
                <h3 style={{ fontSize: 19 }}>Detail Pesanan</h3>
                <span
                  className="num"
                  style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}
                >
                  {detail.code}
                </span>
              </div>
              <div className="spacer" />
              <button
                type="button"
                onClick={() => setDetail(null)}
                style={{ color: "var(--muted)" }}
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div
              className="col gap-10"
              style={{
                background: "var(--bg)",
                borderRadius: 12,
                padding: 14,
                marginBottom: 16,
              }}
            >
              <div className="row">
                <span className="mut" style={{ fontSize: 13 }}>Pemesan</span>
                <div className="spacer" />
                <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                  {detail.customer_name}
                </span>
              </div>
              <div className="row">
                <span className="mut" style={{ fontSize: 13 }}>Kontak</span>
                <div className="spacer" />
                <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>
                  {detail.contact}
                </span>
              </div>
              <div className="row">
                <span className="mut" style={{ fontSize: 13 }}>Tanggal</span>
                <div className="spacer" />
                <span style={{ color: "var(--ink)" }}>{formatDateTime(detail.created_at)}</span>
              </div>
              <div className="row">
                <span className="mut" style={{ fontSize: 13 }}>Status</span>
                <div className="spacer" />
                <OrderStatusBadge status={detail.status} />
              </div>
              {detail.notes && (
                <div className="row" style={{ alignItems: "flex-start" }}>
                  <span className="mut" style={{ fontSize: 13 }}>Catatan</span>
                  <div className="spacer" />
                  <span style={{ maxWidth: 320, textAlign: "right", color: "var(--ink)" }}>
                    {detail.notes}
                  </span>
                </div>
              )}
            </div>

            <h4 style={{ fontSize: 14, marginBottom: 10 }}>Item</h4>
            <div className="col gap-10" style={{ marginBottom: 16 }}>
              {(detail.items || []).map((it) => (
                <div key={it.product_id} className="row">
                  <span style={{ color: "var(--ink)" }}>{it.name}</span>
                  <div className="spacer" />
                  <span className="num" style={{ color: "var(--muted)", marginRight: 12 }}>
                    {it.qty} ×
                  </span>
                  <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>
                    {rupiah(it.price * it.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="row"
              style={{
                borderTop: "1px dashed var(--line)",
                paddingTop: 12,
                marginBottom: 18,
              }}
            >
              <span style={{ fontWeight: 800, color: "var(--ink)" }}>Total</span>
              <div className="spacer" />
              <span className="num" style={{ fontWeight: 800, color: "var(--navy)", fontSize: 20 }}>
                {rupiah(detail.total)}
              </span>
            </div>

            <div className="row gap-10">
              <button
                type="button"
                className="btn btn-ghost btn-block"
                onClick={() => setDetail(null)}
              >
                Tutup
              </button>
              {NEXT_LABELS[detail.status] && (
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  disabled={busyCode === detail.code}
                  onClick={() => advance(detail)}
                >
                  {busyCode === detail.code ? (
                    <>
                      <span className="ki-spin" /> Memproses…
                    </>
                  ) : (
                    NEXT_LABELS[detail.status]
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
}

function Toast({ msg }) {
  return (
    <div
      className="kiup"
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        background: "var(--navy)",
        color: "#fff",
        padding: "13px 20px",
        borderRadius: 999,
        boxShadow: "var(--shadow-lg)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontWeight: 600,
        fontSize: 14,
        zIndex: 200,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          background: "var(--sky)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon name="check" size={14} stroke={3} />
      </span>
      {msg}
    </div>
  );
}
