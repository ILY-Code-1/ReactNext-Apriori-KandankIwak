"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import {
  addPaymentMethod,
  deletePaymentMethod,
  getAllPaymentMethods,
  updatePaymentMethod,
} from "@/lib/firebase/payment-methods";

const EMPTY_DRAFT = { payment_method: "", account_name: "", account_number: "" };

export default function PaymentMethodsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setList(await getAllPaymentMethods());
    } catch {
      setError("Gagal memuat metode pembayaran.");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function openAdd() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setDraft({
      payment_method: item.payment_method || "",
      account_name: item.account_name || "",
      account_number: item.account_number || "",
    });
    setFormError(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
  }

  async function save() {
    const pm = draft.payment_method.trim().toLowerCase();
    const name = draft.account_name.trim();
    const num = draft.account_number.trim();

    if (!pm) return setFormError("Pilih metode pembayaran.");
    if (!name) return setFormError("Atas nama wajib diisi.");
    if (!num) return setFormError("Nomor rekening / e-wallet wajib diisi.");

    setFormError(null);
    setSaving(true);
    try {
      const payload = { payment_method: pm, account_name: name, account_number: num };
      if (editingId) {
        await updatePaymentMethod(editingId, payload);
        showToast("Metode pembayaran diperbarui");
      } else {
        await addPaymentMethod(payload);
        showToast("Metode pembayaran ditambahkan");
      }
      setModalOpen(false);
      await refresh();
    } catch (err) {
      setFormError(err.message || "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deletePaymentMethod(confirmDelete.id);
      showToast("Metode pembayaran dihapus");
      setConfirmDelete(null);
      await refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="col gap-18 kiup" style={{ minHeight: "calc(100vh - 130px)" }}>
      <div className="row">
        <div className="col" style={{ gap: 2 }}>
          <span className="mut" style={{ fontSize: 13, fontWeight: 600 }}>
            {loading ? "Memuat…" : `${list.length} metode terdaftar`}
          </span>
        </div>
        <div className="spacer" />
        <button type="button" className="btn btn-primary btn-sm" onClick={openAdd}>
          <Icon name="plus" size={16} stroke={2.5} /> Tambah Metode
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
          <div className="col" style={{ alignItems: "center", gap: 12, padding: "60px 0" }}>
            <span className="ki-spin ki-spin-lg" />
            <span className="mut" style={{ fontWeight: 600 }}>Memuat…</span>
          </div>
        ) : list.length === 0 ? (
          <div
            className="col"
            style={{ alignItems: "center", gap: 10, padding: "60px 20px", textAlign: "center" }}
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
              <Icon name="card" size={28} />
            </span>
            <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 16 }}>
              Belum ada metode pembayaran
            </span>
            <span className="mut" style={{ fontSize: 13.5, maxWidth: 360 }}>
              Tambah minimal satu metode (mis. BCA, DANA) supaya pelanggan tahu harus
              transfer kemana saat checkout.
            </span>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Metode</th>
                  <th>Atas Nama</th>
                  <th>Nomor</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="row gap-12">
                        <PaymentLogo method={m.payment_method} />
                        <div className="col" style={{ gap: 1 }}>
                          <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                            {(m.payment_method || "—").toUpperCase()}
                          </span>
                          <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                            kode: {m.payment_method || "—"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "var(--ink)" }}>{m.account_name}</td>
                    <td className="num" style={{ fontWeight: 700, color: "var(--navy)" }}>
                      {m.account_number}
                    </td>
                    <td>
                      <div className="row gap-6" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          onClick={() => openEdit(m)}
                          className="row"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            background: "var(--bg)",
                            color: "var(--navy)",
                            justifyContent: "center",
                          }}
                          title="Edit"
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(m)}
                          className="row"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            background: "var(--red-50)",
                            color: "var(--red)",
                            justifyContent: "center",
                          }}
                          title="Hapus"
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(28,26,77,.4)",
            backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "90px 16px 24px",
            overflowY: "auto",
            zIndex: 100,
          }}
        >
          <div
            className="card kiup"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 460,
              maxWidth: "100%",
              padding: 26,
              boxShadow: "var(--shadow-lg)",
              marginBottom: 24,
            }}
          >
            <div className="row" style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 20 }}>
                {editingId ? "Edit Metode Pembayaran" : "Tambah Metode Pembayaran"}
              </h3>
              <div className="spacer" />
              <button
                type="button"
                onClick={closeModal}
                style={{ color: "var(--muted)" }}
                disabled={saving}
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div className="col gap-14">
              <div className="field">
                <label>Kode Metode</label>
                <select
                  className="select"
                  value={draft.payment_method}
                  onChange={(e) => setDraft({ ...draft, payment_method: e.target.value })}
                  disabled={saving}
                >
                  <option value="">Pilih metode</option>
                  <option value="bca">BCA</option>
                  <option value="dana">DANA</option>
                </select>
                {draft.payment_method && (
                  <div
                    className="row gap-10"
                    style={{
                      marginTop: 4,
                      padding: 10,
                      borderRadius: 10,
                      background: "var(--bg)",
                    }}
                  >
                    <PaymentLogo method={draft.payment_method} />
                    <span className="mut" style={{ fontSize: 12.5, fontWeight: 600 }}>
                      Preview logo
                    </span>
                  </div>
                )}
              </div>

              <div className="field">
                <label>Atas Nama</label>
                <input
                  className="input"
                  value={draft.account_name}
                  onChange={(e) => setDraft({ ...draft, account_name: e.target.value })}
                  placeholder="cth. Anwar Saputra"
                  disabled={saving}
                />
              </div>

              <div className="field">
                <label>Nomor Rekening / E-Wallet</label>
                <input
                  className="input num"
                  value={draft.account_number}
                  onChange={(e) => setDraft({ ...draft, account_number: e.target.value })}
                  placeholder="cth. 1234567890"
                  disabled={saving}
                />
              </div>

              {formError && (
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
                  <Icon name="info" size={16} /> {formError}
                </div>
              )}
            </div>

            <div className="row gap-12" style={{ marginTop: 22 }}>
              <button
                type="button"
                className="btn btn-ghost btn-block"
                onClick={closeModal}
                disabled={saving}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={save}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="ki-spin" /> Menyimpan…
                  </>
                ) : editingId ? (
                  "Simpan Perubahan"
                ) : (
                  "Simpan Metode"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div
          onClick={() => !deleting && setConfirmDelete(null)}
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
              width: 380,
              maxWidth: "100%",
              padding: 26,
              boxShadow: "var(--shadow-lg)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 12,
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
              <Icon name="trash" size={26} />
            </span>
            <h3 style={{ fontSize: 19 }}>Hapus metode {(confirmDelete.payment_method || "").toUpperCase()}?</h3>
            <p className="mut" style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
              Pelanggan tidak akan lagi melihat metode ini saat checkout. Aksi tidak bisa dibatalkan.
            </p>
            <div className="row gap-10" style={{ width: "100%", marginTop: 8 }}>
              <button
                type="button"
                className="btn btn-ghost btn-block"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={handleDelete}
                disabled={deleting}
                style={{ background: "var(--red)" }}
              >
                {deleting ? (
                  <>
                    <span className="ki-spin" /> Menghapus…
                  </>
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
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
          {toast}
        </div>
      )}
    </div>
  );
}

function PaymentLogo({ method, size = 44 }) {
  const [errored, setErrored] = useState(false);
  if (!method || errored) {
    return (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: 10,
          background: "var(--bg)",
          color: "var(--muted)",
          display: "grid",
          placeItems: "center",
          flex: "0 0 auto",
        }}
      >
        <Icon name="card" size={size * 0.5} />
      </span>
    );
  }
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: "#fff",
        display: "grid",
        placeItems: "center",
        flex: "0 0 auto",
        boxShadow: "inset 0 0 0 1px var(--line)",
        overflow: "hidden",
      }}
    >
      <img
        src={`/payment-icon/${method}.webp`}
        alt={method}
        onError={() => setErrored(true)}
        style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }}
      />
    </span>
  );
}
