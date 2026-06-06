"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Illo from "@/components/ui/Illo";
import RequiredLabel from "@/components/ui/RequiredLabel";
import { useCart } from "@/context/CartContext";
import { getAllProducts } from "@/lib/firebase/products";
import { getAllPaymentMethods } from "@/lib/firebase/payment-methods";
import { addOrderAndTransaction } from "@/lib/firebase/orders";
import { generateOrderCode } from "@/lib/utils/order-code";
import {
  KAB_TANGERANG_NAME,
  getDistricts,
  getVillages,
} from "@/lib/wilayah/api";
import { rupiah } from "@/lib/utils/format";

const SHIPPING_FLAT = 12000;

const EMPTY_FORM = {
  name: "",
  contact: "",
  kecamatan_code: "",
  kelurahan_code: "",
  address_detail: "",
  notes: "",
  payment_method_id: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, hydrated, clear } = useCart();

  const [productMap, setProductMap] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const [wilayahError, setWilayahError] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    Promise.all([getAllProducts({ onlyActive: true }), getAllPaymentMethods()])
      .then(([products, methods]) => {
        setProductMap(Object.fromEntries(products.map((p) => [p.id, p])));
        setPaymentMethods(methods);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    setLoadingDistricts(true);
    getDistricts()
      .then(setDistricts)
      .catch(() => setWilayahError("Gagal memuat data wilayah."))
      .finally(() => setLoadingDistricts(false));
  }, []);

  useEffect(() => {
    if (!form.kecamatan_code) {
      setVillages([]);
      return;
    }
    setLoadingVillages(true);
    setVillages([]);
    getVillages(form.kecamatan_code)
      .then(setVillages)
      .catch(() => setWilayahError("Gagal memuat kelurahan."))
      .finally(() => setLoadingVillages(false));
  }, [form.kecamatan_code]);

  const cartItems = useMemo(
    () =>
      Object.entries(items)
        .map(([id, qty]) => ({ product: productMap[id], qty }))
        .filter((x) => x.product),
    [items, productMap],
  );

  const subtotal = cartItems.reduce((s, x) => s + x.product.price * x.qty, 0);
  const shipping = cartItems.length > 0 ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!hydrated || loadingProducts || submitted || submitting) return;
    if (cartItems.length === 0) router.replace("/cart");
  }, [hydrated, loadingProducts, cartItems.length, submitted, submitting, router]);

  function validate(values = form) {
    const e = {};
    if (!values.name.trim()) e.name = "Nama wajib diisi.";
    if (!values.contact.trim()) e.contact = "Nomor WhatsApp wajib diisi.";
    else if (!/^[0-9+\s-]{8,}$/.test(values.contact.trim()))
      e.contact = "Format nomor tidak valid.";
    if (!values.kecamatan_code) e.kecamatan_code = "Pilih kecamatan.";
    if (!values.kelurahan_code) e.kelurahan_code = "Pilih kelurahan.";
    if (!values.address_detail.trim())
      e.address_detail = "Detail alamat wajib diisi.";
    if (!values.payment_method_id) e.payment_method_id = "Pilih metode pembayaran.";
    return e;
  }

  function setField(key, value) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "kecamatan_code") next.kelurahan_code = "";
      const allErrors = validate(next);
      setErrors((prev) => ({ ...prev, [key]: allErrors[key], ...(key === "kecamatan_code" ? { kelurahan_code: undefined } : {}) }));
      return next;
    });
  }

  function markTouched(key) {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate());
  }

  const allErrors = useMemo(() => validate(), [form]);
  const isValid = Object.keys(allErrors).length === 0 && cartItems.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    const all = validate();
    setErrors(all);
    setTouched({
      name: true,
      contact: true,
      kecamatan_code: true,
      kelurahan_code: true,
      address_detail: true,
      payment_method_id: true,
    });
    if (Object.keys(all).length > 0 || cartItems.length === 0) return;

    setSubmitting(true);
    setSubmitError(null);

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

      const selectedPayment = paymentMethods.find((m) => m.id === form.payment_method_id);
      const kecamatan = districts.find((d) => d.code === form.kecamatan_code);
      const kelurahan = villages.find((v) => v.code === form.kelurahan_code);

      const address = {
        kecamatan_code: form.kecamatan_code,
        kecamatan_name: kecamatan?.name || "",
        kelurahan_code: form.kelurahan_code,
        kelurahan_name: kelurahan?.name || "",
        detail: form.address_detail.trim(),
      };

      const paymentSnapshot = selectedPayment
        ? {
            id: selectedPayment.id,
            payment_method: selectedPayment.payment_method,
            account_name: selectedPayment.account_name,
            account_number: selectedPayment.account_number,
          }
        : null;

      await addOrderAndTransaction(
        orderCode,
        {
          items: orderItems,
          total,
          customer_name: form.name.trim(),
          contact: form.contact.trim(),
          address,
          payment_method: paymentSnapshot,
          notes: form.notes.trim(),
        },
        { items: transactionItems },
      );

      setSubmitted(true);
      clear();
      router.push(`/checkout/success?code=${encodeURIComponent(orderCode)}`);
    } catch (err) {
      console.error(err);
      setSubmitError(
        err?.message ||
          "Gagal membuat pesanan. Periksa koneksi dan coba lagi.",
      );
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

  const showError = (key) => (touched[key] || submitError) && errors[key];

  return (
    <div className="wrap" style={{ padding: "32px 28px 60px" }}>
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
          {/* Data Pemesan */}
          <Section icon="user" title="Data Pemesan">
            <FieldGrid>
              <Field
                label="Nama Lengkap"
                required
                error={showError("name") ? errors.name : null}
              >
                <input
                  className="input"
                  placeholder="cth. Budi Santoso"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  onBlur={() => markTouched("name")}
                  disabled={submitting}
                  required
                />
              </Field>

              <Field
                label="No. WhatsApp"
                required
                error={showError("contact") ? errors.contact : null}
              >
                <input
                  className="input"
                  placeholder="08xx xxxx xxxx"
                  value={form.contact}
                  onChange={(e) => setField("contact", e.target.value)}
                  onBlur={() => markTouched("contact")}
                  disabled={submitting}
                  required
                />
              </Field>
            </FieldGrid>
          </Section>

          {/* Alamat */}
          <Section icon="map" title="Alamat Pengiriman">
            <p
              className="mut"
              style={{ margin: 0, marginTop: -6, marginBottom: 14, fontSize: 13 }}
            >
              Hanya melayani area <b style={{ color: "var(--navy)" }}>{KAB_TANGERANG_NAME}</b>.
            </p>

            {wilayahError && (
              <ErrorBanner>
                {wilayahError}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setWilayahError(null);
                    setLoadingDistricts(true);
                    getDistricts()
                      .then(setDistricts)
                      .catch(() => setWilayahError("Masih gagal memuat data wilayah."))
                      .finally(() => setLoadingDistricts(false));
                  }}
                  style={{
                    color: "var(--red)",
                    textDecoration: "underline",
                    fontWeight: 700,
                  }}
                >
                  Coba lagi
                </button>
              </ErrorBanner>
            )}

            <FieldGrid>
              <Field
                label="Kecamatan"
                required
                error={showError("kecamatan_code") ? errors.kecamatan_code : null}
              >
                <select
                  className="select"
                  value={form.kecamatan_code}
                  onChange={(e) => setField("kecamatan_code", e.target.value)}
                  onBlur={() => markTouched("kecamatan_code")}
                  disabled={submitting || loadingDistricts}
                  required
                >
                  <option value="">
                    {loadingDistricts ? "Memuat…" : "Pilih kecamatan"}
                  </option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Kelurahan"
                required
                error={showError("kelurahan_code") ? errors.kelurahan_code : null}
              >
                <select
                  className="select"
                  value={form.kelurahan_code}
                  onChange={(e) => setField("kelurahan_code", e.target.value)}
                  onBlur={() => markTouched("kelurahan_code")}
                  disabled={submitting || !form.kecamatan_code || loadingVillages}
                  required
                >
                  <option value="">
                    {!form.kecamatan_code
                      ? "Pilih kecamatan dulu"
                      : loadingVillages
                      ? "Memuat…"
                      : "Pilih kelurahan"}
                  </option>
                  {villages.map((v) => (
                    <option key={v.code} value={v.code}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Detail Alamat"
                required
                error={showError("address_detail") ? errors.address_detail : null}
                style={{ gridColumn: "1/3" }}
              >
                <textarea
                  className="input"
                  rows="3"
                  style={{ resize: "vertical" }}
                  placeholder="Nama jalan, nomor rumah, RT/RW, patokan…"
                  value={form.address_detail}
                  onChange={(e) => setField("address_detail", e.target.value)}
                  onBlur={() => markTouched("address_detail")}
                  disabled={submitting}
                  required
                />
              </Field>
            </FieldGrid>
          </Section>

          {/* Metode Pembayaran */}
          <Section icon="card" title="Metode Pembayaran">
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
                Admin belum menambah metode pembayaran. Hubungi via WhatsApp.
              </div>
            ) : (
              <>
                <span
                  style={{
                    display: "block",
                    marginBottom: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  <RequiredLabel>Pilih satu metode</RequiredLabel>
                </span>
                <div className="col gap-10">
                  {paymentMethods.map((m) => (
                    <PaymentRadio
                      key={m.id}
                      method={m}
                      checked={form.payment_method_id === m.id}
                      onSelect={() => {
                        setField("payment_method_id", m.id);
                        markTouched("payment_method_id");
                      }}
                      disabled={submitting}
                    />
                  ))}
                </div>
                {showError("payment_method_id") && (
                  <span
                    style={{
                      display: "block",
                      marginTop: 8,
                      fontSize: 12.5,
                      color: "var(--red)",
                      fontWeight: 600,
                    }}
                  >
                    {errors.payment_method_id}
                  </span>
                )}
              </>
            )}
          </Section>

          {/* Catatan */}
          <Section icon="edit" title="Catatan (opsional)">
            <textarea
              className="input"
              rows="2"
              style={{ resize: "vertical" }}
              placeholder="cth. Titip ke pos satpam, antar setelah jam 4 sore"
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              disabled={submitting}
            />
          </Section>
        </div>

        {/* Ringkasan */}
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

          {submitError && <ErrorBanner>{submitError}</ErrorBanner>}

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={!isValid || submitting}
          >
            {submitting ? (
              <>
                <span className="ki-spin" /> Memproses…
              </>
            ) : (
              <>
                Lanjutkan Pembayaran <Icon name="arrowR" size={18} />
              </>
            )}
          </button>
          <span style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "center" }}>
            Detail rekening dan tombol konfirmasi WhatsApp muncul setelah pesanan dibuat.
          </span>
        </aside>
      </form>
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="row gap-10" style={{ marginBottom: 16 }}>
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
          <Icon name={icon} size={19} />
        </span>
        <h3 style={{ fontSize: 17 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FieldGrid({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {children}
    </div>
  );
}

function Field({ label, required, error, children, style }) {
  return (
    <div className="field" style={style}>
      <label>{required ? <RequiredLabel>{label}</RequiredLabel> : label}</label>
      {children}
      {error && (
        <span style={{ fontSize: 12.5, color: "var(--red)", fontWeight: 600 }}>
          {error}
        </span>
      )}
    </div>
  );
}

function ErrorBanner({ children }) {
  return (
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
      <Icon name="info" size={16} /> {children}
    </div>
  );
}

function PaymentRadio({ method, checked, onSelect, disabled }) {
  const [imgError, setImgError] = useState(false);
  const label = (method.payment_method || "").toUpperCase();
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className="row gap-12"
      style={{
        padding: 14,
        borderRadius: 14,
        textAlign: "left",
        background: checked ? "var(--sky-50)" : "#fff",
        boxShadow: checked
          ? "inset 0 0 0 2px var(--sky)"
          : "inset 0 0 0 1.5px var(--line)",
        transition: "background .15s, box-shadow .15s",
      }}
    >
      <span
        style={{
          width: 48,
          height: 48,
          borderRadius: 11,
          background: "#fff",
          display: "grid",
          placeItems: "center",
          flex: "0 0 auto",
          boxShadow: "inset 0 0 0 1px var(--line)",
          overflow: "hidden",
        }}
      >
        {imgError ? (
          <Icon name="card" size={22} style={{ color: "var(--muted)" }} />
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
        <span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 14.5 }}>
          {label}
        </span>
        <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>
          a.n. {method.account_name} · {method.account_number}
        </span>
      </div>
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          border: `2px solid ${checked ? "var(--sky)" : "var(--line)"}`,
          display: "grid",
          placeItems: "center",
          flex: "0 0 auto",
        }}
      >
        {checked && (
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: 999,
              background: "var(--sky)",
            }}
          />
        )}
      </span>
    </button>
  );
}
