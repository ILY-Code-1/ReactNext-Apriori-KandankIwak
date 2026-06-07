"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { getAllOrders, updateOrderStatus } from "@/lib/firebase/orders";
import { ORDER_STATUS, ORDER_STATUS_FLOW } from "@/lib/firebase/collections";
import { rupiah, formatDateTime } from "@/lib/utils/format";

function formatContactDisplay(contact) {
  if (!contact) return "—";
  const digits = String(contact).replace(/\D/g, "");
  return digits ? `+${digits}` : contact;
}

function buildWhatsAppLink(contact) {
  if (!contact) return null;
  const digits = String(contact).replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: ORDER_STATUS.ORDERED, label: "Dipesan" },
  { id: ORDER_STATUS.PAID, label: "Dibayar" },
  { id: ORDER_STATUS.SHIPPED, label: "Dikirim" },
  { id: ORDER_STATUS.COMPLETED, label: "Selesai" },
  { id: ORDER_STATUS.CANCELLED, label: "Dibatalkan" },
];

const NEXT_LABELS = {
  [ORDER_STATUS.ORDERED]: "Tandai Dibayar",
  [ORDER_STATUS.PAID]: "Tandai Dikirim",
  [ORDER_STATUS.SHIPPED]: "Tandai Selesai",
};

const FINAL_STATUSES = new Set([ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED]);

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const [busyCode, setBusyCode] = useState(null);
  const [toast, setToast] = useState(null);
  const [pendingChange, setPendingChange] = useState(null);

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

  function requestAdvance(order) {
    const idx = ORDER_STATUS_FLOW.indexOf(order.status);
    if (idx < 0 || idx >= ORDER_STATUS_FLOW.length - 1) return;
    const next = ORDER_STATUS_FLOW[idx + 1];
    setPendingChange({ order, next, kind: "advance" });
  }

  function requestCancel(order) {
    if (FINAL_STATUSES.has(order.status)) return;
    setPendingChange({ order, next: ORDER_STATUS.CANCELLED, kind: "cancel" });
  }

  async function applyChange() {
    if (!pendingChange) return;
    const { order, next } = pendingChange;
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
      setPendingChange(null);
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
      [ORDER_STATUS.CANCELLED]: orders.filter((o) => o.status === ORDER_STATUS.CANCELLED).length,
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
            <table className="tbl" style={{ minWidth: 1100 }}>
              <thead>
                <tr>
                  <th style={{ whiteSpace: "nowrap" }}>Kode</th>
                  <th style={{ whiteSpace: "nowrap" }}>Pelanggan</th>
                  <th>Item</th>
                  <th style={{ whiteSpace: "nowrap" }}>Total</th>
                  <th style={{ whiteSpace: "nowrap" }}>Tanggal</th>
                  <th style={{ whiteSpace: "nowrap" }}>Status</th>
                  <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((o) => {
                  const isCancelled = o.status === ORDER_STATUS.CANCELLED;
                  const isFinal = FINAL_STATUSES.has(o.status);
                  return (
                    <tr key={o.code}>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>
                          {o.code}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>
                        {o.customer_name}
                      </td>
                      <td>
                        <div className="row gap-4" style={{ flexWrap: "nowrap" }}>
                          {(o.items || []).slice(0, 3).map((it, i) => (
                            <span
                              key={i}
                              className="chip chip-ink"
                              style={{ padding: "3px 9px", fontSize: 11.5, whiteSpace: "nowrap" }}
                            >
                              {it.name?.split(" ").slice(0, 2).join(" ") || it.product_id}
                            </span>
                          ))}
                          {(o.items || []).length > 3 && (
                            <span
                              className="chip chip-ink"
                              style={{ padding: "3px 9px", fontSize: 11.5, whiteSpace: "nowrap" }}
                            >
                              +{(o.items || []).length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className="num"
                        style={{ fontWeight: 700, color: "var(--navy)", whiteSpace: "nowrap" }}
                      >
                        {rupiah(o.total)}
                      </td>
                      <td className="mut" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
                        {formatDateTime(o.created_at)}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <div className="row gap-6" style={{ justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setDetail(o)}
                          >
                            Detail
                          </button>
                          {NEXT_LABELS[o.status] && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              disabled={busyCode === o.code}
                              onClick={() => requestAdvance(o)}
                            >
                              {busyCode === o.code ? (
                                <span className="ki-spin" />
                              ) : (
                                <>
                                  {NEXT_LABELS[o.status]} <Icon name="arrowR" size={14} />
                                </>
                              )}
                            </button>
                          )}
                          {!isFinal && (
                            <button
                              type="button"
                              className="btn btn-sm"
                              disabled={busyCode === o.code}
                              onClick={() => requestCancel(o)}
                              style={{
                                background: "var(--red-50)",
                                color: "var(--red)",
                                fontWeight: 700,
                              }}
                              title="Batalkan pesanan"
                            >
                              <Icon name="x" size={14} stroke={2.5} /> Batalkan
                            </button>
                          )}
                          {o.status === ORDER_STATUS.COMPLETED && (
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
                          {isCancelled && (
                            <span
                              className="row gap-4"
                              style={{
                                color: "var(--red)",
                                fontSize: 13,
                                fontWeight: 700,
                                paddingRight: 4,
                              }}
                            >
                              <Icon name="x" size={15} stroke={2.5} /> Dibatalkan
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                marginBottom: 14,
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
                <span className="mut" style={{ fontSize: 13 }}>Tanggal</span>
                <div className="spacer" />
                <span style={{ color: "var(--ink)" }}>{formatDateTime(detail.created_at)}</span>
              </div>
              <div className="row">
                <span className="mut" style={{ fontSize: 13 }}>Status</span>
                <div className="spacer" />
                <OrderStatusBadge status={detail.status} />
              </div>
            </div>

            <DetailSection icon="wa" title="Kontak Pelanggan">
              <div className="row gap-10" style={{ alignItems: "center" }}>
                <span
                  className="num"
                  style={{ fontWeight: 700, color: "var(--ink)", fontSize: 15 }}
                >
                  {formatContactDisplay(detail.contact)}
                </span>
                <div className="spacer" />
                {buildWhatsAppLink(detail.contact) && (
                  <a
                    href={buildWhatsAppLink(detail.contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                  >
                    <WhatsappIcon size={16} /> Hubungi
                  </a>
                )}
              </div>
            </DetailSection>

            {detail.address && (
              <DetailSection icon="map" title="Alamat Pengiriman">
                <div className="col" style={{ gap: 4, color: "var(--ink)", fontSize: 13.5, lineHeight: 1.55 }}>
                  <span>{detail.address.detail}</span>
                  <span className="mut" style={{ fontWeight: 600 }}>
                    Kel. {detail.address.kelurahan_name}, Kec. {detail.address.kecamatan_name}
                  </span>
                  <span className="mut" style={{ fontWeight: 600 }}>
                    Kabupaten Tangerang
                  </span>
                </div>
              </DetailSection>
            )}

            {detail.payment_method && (
              <DetailSection icon="card" title="Metode Pembayaran">
                <div className="col gap-4">
                  <span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15 }}>
                    {(detail.payment_method.payment_method || "—").toUpperCase()}
                  </span>
                  <span
                    className="num"
                    style={{ fontWeight: 700, color: "var(--navy)", fontSize: 15 }}
                  >
                    {detail.payment_method.account_number}
                  </span>
                  <span className="mut" style={{ fontSize: 12.5, fontWeight: 600 }}>
                    a.n. {detail.payment_method.account_name}
                  </span>
                </div>
              </DetailSection>
            )}

            {detail.notes && (
              <DetailSection icon="edit" title="Catatan Pelanggan">
                <p
                  style={{
                    margin: 0,
                    color: "var(--ink)",
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {detail.notes}
                </p>
              </DetailSection>
            )}

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

            <div className="col gap-10">
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
                    onClick={() => requestAdvance(detail)}
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
              {!FINAL_STATUSES.has(detail.status) && (
                <button
                  type="button"
                  className="btn btn-block"
                  disabled={busyCode === detail.code}
                  onClick={() => requestCancel(detail)}
                  style={{
                    background: "var(--red-50)",
                    color: "var(--red)",
                    fontWeight: 700,
                  }}
                >
                  <Icon name="x" size={16} stroke={2.5} /> Batalkan Pesanan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {pendingChange && (
        <ConfirmStatusDialog
          pending={pendingChange}
          busy={busyCode === pendingChange.order.code}
          onCancel={() => setPendingChange(null)}
          onConfirm={applyChange}
        />
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
}

const STATUS_LABEL = {
  ordered: "Dipesan",
  paid: "Dibayar",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

function ConfirmStatusDialog({ pending, busy, onCancel, onConfirm }) {
  const { order, next, kind } = pending;
  const fromLabel = STATUS_LABEL[order.status] || order.status;
  const toLabel = STATUS_LABEL[next] || next;
  const isCancel = kind === "cancel";

  return (
    <div
      onClick={() => !busy && onCancel()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(28,26,77,.4)",
        backdropFilter: "blur(3px)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 200,
      }}
    >
      <div
        className="card kiup"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          maxWidth: "100%",
          padding: 26,
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <span
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: isCancel ? "var(--red-50)" : "var(--sky-50)",
            color: isCancel ? "var(--red)" : "var(--sky-600)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name={isCancel ? "x" : "info"} size={26} stroke={isCancel ? 2.5 : 2} />
        </span>
        <h3 style={{ fontSize: 19 }}>
          {isCancel ? "Batalkan pesanan?" : "Ubah status pesanan?"}
        </h3>
        <div
          className="num"
          style={{ fontWeight: 800, color: "var(--ink)", fontSize: 14 }}
        >
          {order.code}
        </div>
        <div
          className="row gap-10"
          style={{
            background: "var(--bg)",
            padding: "10px 16px",
            borderRadius: 999,
            fontSize: 13.5,
            fontWeight: 700,
          }}
        >
          <span className="badge badge-amber">
            <span className="dot" />
            {fromLabel}
          </span>
          <Icon name="arrowR" size={16} style={{ color: "var(--muted)" }} />
          <span className={`badge ${isCancel ? "badge-red" : "badge-green"}`}>
            <span className="dot" />
            {toLabel}
          </span>
        </div>
        <p
          className="mut"
          style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55 }}
        >
          {isCancel
            ? "Pesanan akan ditandai dibatalkan dan pelanggan melihat statusnya di halaman Lacak Pesanan. Aksi ini tidak bisa dilanjutkan ke status berikutnya."
            : "Pelanggan akan melihat status baru di halaman Lacak Pesanan. Lanjutkan?"}
        </p>
        <div className="row gap-10" style={{ width: "100%", marginTop: 6 }}>
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={onCancel}
            disabled={busy}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={onConfirm}
            disabled={busy}
            style={isCancel ? { background: "var(--red)" } : undefined}
          >
            {busy ? (
              <>
                <span className="ki-spin" /> Memproses…
              </>
            ) : isCancel ? (
              "Ya, Batalkan"
            ) : (
              "Ya, Ubah"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailSection({ icon, title, children }) {
  return (
    <div
      style={{
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        boxShadow: "inset 0 0 0 1px var(--line)",
      }}
    >
      <div className="row gap-8" style={{ marginBottom: 10 }}>
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: "var(--sky-50)",
            color: "var(--sky-600)",
            display: "grid",
            placeItems: "center",
            flex: "0 0 auto",
          }}
        >
          <Icon name={icon} size={14} />
        </span>
        <span
          style={{
            fontWeight: 800,
            color: "var(--ink)",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: ".04em",
          }}
        >
          {title}
        </span>
      </div>
      {children}
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
