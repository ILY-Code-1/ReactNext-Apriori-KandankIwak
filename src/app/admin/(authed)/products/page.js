"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import Illo from "@/components/ui/Illo";
import StockPill from "@/components/ui/StockPill";
import {
  addProduct,
  deactivateProduct,
  getAllProducts,
  updateProduct,
} from "@/lib/firebase/products";
import { uploadImage } from "@/lib/cloudinary/upload";
import { rupiah } from "@/lib/utils/format";

const CATEGORIES = ["Ikan Segar", "Olahan", "Budidaya", "Bumbu", "Paket"];

const EMPTY_DRAFT = {
  name: "",
  category: "Ikan Segar",
  price: "",
  stock: "",
  unit: "per kg",
  description: "",
  image_url: "",
};

export default function ManageProductsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const fileRef = useRef(null);

  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setList(data);
    } catch {
      setError("Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  function openAdd() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setFile(null);
    setImagePreview(null);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditingId(product.id);
    setDraft({
      name: product.name || "",
      category: product.category || CATEGORIES[0],
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      unit: product.unit || "per kg",
      description: product.description || "",
      image_url: product.image_url || "",
    });
    setFile(null);
    setImagePreview(product.image_url || null);
    setFormError(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
  }

  function onPickFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setImagePreview(URL.createObjectURL(f));
  }

  async function save() {
    if (!draft.name.trim()) {
      setFormError("Nama produk wajib diisi.");
      return;
    }
    if (!draft.price) {
      setFormError("Harga wajib diisi.");
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      let image_url = draft.image_url;
      if (file) {
        image_url = await uploadImage(file);
      }
      const payload = {
        name: draft.name.trim(),
        category: draft.category,
        price: Number(draft.price),
        stock: Number(draft.stock || 0),
        unit: draft.unit,
        description: draft.description.trim(),
        image_url,
      };
      if (editingId) {
        await updateProduct(editingId, payload);
        showToast("Produk diperbarui");
      } else {
        await addProduct(payload);
        showToast("Produk ditambahkan");
      }
      setModalOpen(false);
      await refresh();
    } catch (err) {
      setFormError(err.message || "Gagal menyimpan produk.");
    } finally {
      setSaving(false);
    }
  }

  async function bump(product, delta) {
    setBusyId(product.id);
    try {
      const next = Math.max(0, (product.stock || 0) + delta);
      await updateProduct(product.id, { stock: next });
      setList((all) => all.map((p) => (p.id === product.id ? { ...p, stock: next } : p)));
    } finally {
      setBusyId(null);
    }
  }

  async function toggleActive(product) {
    setBusyId(product.id);
    try {
      if (product.active === false) {
        await updateProduct(product.id, { active: true });
        showToast("Produk diaktifkan");
      } else {
        await deactivateProduct(product.id);
        showToast("Produk dinonaktifkan");
      }
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="col gap-18 kiup" style={{ minHeight: "calc(100vh - 130px)" }}>
      <div className="row">
        <div className="col" style={{ gap: 2 }}>
          <span className="mut" style={{ fontSize: 13, fontWeight: 600 }}>
            {loading ? "Memuat…" : `${list.length} produk terdaftar`}
          </span>
        </div>
        <div className="spacer" />
        <button type="button" className="btn btn-primary btn-sm" onClick={openAdd}>
          <Icon name="plus" size={16} stroke={2.5} /> Tambah Produk
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
            <span className="mut" style={{ fontWeight: 600 }}>Memuat produk…</span>
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
              <Icon name="pkg" size={28} />
            </span>
            <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 16 }}>
              Belum ada produk
            </span>
            <span className="mut" style={{ fontSize: 13.5, maxWidth: 320 }}>
              Klik "Tambah Produk" untuk memulai. Data tersimpan langsung di Firestore.
            </span>
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const inactive = p.active === false;
                return (
                  <tr key={p.id} style={{ opacity: inactive ? 0.55 : 1 }}>
                    <td>
                      <div className="row gap-12">
                        <div
                          className="illo illo-sky"
                          style={{
                            width: 46,
                            height: 40,
                            aspectRatio: "auto",
                            flex: "0 0 auto",
                            overflow: "hidden",
                          }}
                        >
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <Illo type="whole" size={42} />
                          )}
                        </div>
                        <div className="col" style={{ gap: 1 }}>
                          <span style={{ fontWeight: 700, color: "var(--ink)" }}>{p.name}</span>
                          <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                            {p.unit}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="chip chip-ink">{p.category}</span>
                    </td>
                    <td className="num" style={{ fontWeight: 700, color: "var(--navy)" }}>
                      {rupiah(p.price)}
                    </td>
                    <td>
                      <div className="row gap-6">
                        <button
                          type="button"
                          onClick={() => bump(p, -1)}
                          disabled={busyId === p.id || (p.stock || 0) <= 0}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            background: "var(--bg)",
                            color: "var(--navy)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <Icon name="minus" size={14} />
                        </button>
                        <span
                          className="num"
                          style={{
                            minWidth: 30,
                            textAlign: "center",
                            fontWeight: 700,
                            color: "var(--ink)",
                          }}
                        >
                          {p.stock ?? 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => bump(p, 1)}
                          disabled={busyId === p.id}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            background: "var(--sky-50)",
                            color: "var(--sky-600)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <Icon name="plus" size={14} />
                        </button>
                      </div>
                    </td>
                    <td>
                      {inactive ? (
                        <span className="badge badge-red">
                          <span className="dot" /> Nonaktif
                        </span>
                      ) : (
                        <StockPill stock={p.stock ?? 0} />
                      )}
                    </td>
                    <td>
                      <div className="row gap-6" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
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
                          onClick={() => toggleActive(p)}
                          disabled={busyId === p.id}
                          className="row"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            background: inactive ? "var(--green-50)" : "var(--red-50)",
                            color: inactive ? "var(--green)" : "var(--red)",
                            justifyContent: "center",
                          }}
                          title={inactive ? "Aktifkan" : "Nonaktifkan"}
                        >
                          <Icon name={inactive ? "check" : "trash"} size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
              width: 520,
              maxWidth: "100%",
              padding: 26,
              boxShadow: "var(--shadow-lg)",
              marginBottom: 24,
            }}
          >
            <div className="row" style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 20 }}>
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
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
                <label>Gambar Produk</label>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={saving}
                  style={{
                    width: "100%",
                    border: "2px dashed var(--line)",
                    borderRadius: "var(--r)",
                    padding: imagePreview ? 0 : "26px 18px",
                    background: imagePreview ? "var(--bg)" : "#fff",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                >
                  {imagePreview ? (
                    <div style={{ position: "relative" }}>
                      <img
                        src={imagePreview}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <span
                        className="badge badge-sky"
                        style={{ position: "absolute", top: 10, right: 10 }}
                      >
                        Ganti gambar
                      </span>
                    </div>
                  ) : (
                    <div className="col" style={{ alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: "var(--sky-50)",
                          color: "var(--sky-600)",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Icon name="upload" size={22} />
                      </span>
                      <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                        Klik untuk unggah gambar
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          textAlign: "center",
                          lineHeight: 1.5,
                          maxWidth: 360,
                        }}
                      >
                        Rasio <b style={{ color: "var(--ink)" }}>1:1 (persegi)</b>,
                        minimal <b style={{ color: "var(--ink)" }}>800×800 px</b>,
                        maks 2 MB. Format JPG / PNG / WebP.
                        <br />
                        Foto terang dengan latar polos memberi hasil terbaik di kartu produk.
                      </span>
                    </div>
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={onPickFile}
                  style={{ display: "none" }}
                />
              </div>

              <div className="field">
                <label>Nama Produk</label>
                <input
                  className="input"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="cth. Nila Bakar Frozen"
                  disabled={saving}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label>Kategori</label>
                  <select
                    className="select"
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    disabled={saving}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Satuan</label>
                  <input
                    className="input"
                    value={draft.unit}
                    onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
                    disabled={saving}
                  />
                </div>
                <div className="field">
                  <label>Harga (Rp)</label>
                  <input
                    className="input num"
                    type="number"
                    value={draft.price}
                    onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                    placeholder="35000"
                    disabled={saving}
                  />
                </div>
                <div className="field">
                  <label>Stok</label>
                  <input
                    className="input num"
                    type="number"
                    value={draft.stock}
                    onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
                    placeholder="50"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="field">
                <label>Deskripsi</label>
                <textarea
                  className="input"
                  rows="3"
                  style={{ resize: "vertical" }}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="Ceritakan keunggulan produk ini…"
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
                    <span className="ki-spin" />{" "}
                    {file ? "Mengunggah & menyimpan…" : "Menyimpan…"}
                  </>
                ) : editingId ? (
                  "Simpan Perubahan"
                ) : (
                  "Simpan Produk"
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
            bottom: 96,
            left: "50%",
            transform: "translateX(-50%)",
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
