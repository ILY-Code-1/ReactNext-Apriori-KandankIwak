"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

export default function AprioriPage() {
  const [support, setSupport] = useState(0.1);
  const [confidence, setConfidence] = useState(0.3);

  return (
    <div className="col gap-20 kiup" style={{ minHeight: "calc(100vh - 130px)" }}>
      <div
        className="card"
        style={{
          padding: "18px 22px",
          display: "flex",
          gap: 16,
          alignItems: "center",
          background: "linear-gradient(100deg, var(--sky-50), #fff)",
          border: "1px solid var(--sky-100)",
        }}
      >
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "var(--sky)",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            flex: "0 0 auto",
            boxShadow: "var(--shadow-sky)",
          }}
        >
          <Icon name="spark" size={22} />
        </span>
        <div className="col" style={{ gap: 2 }}>
          <span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15.5 }}>
            Market Basket Analysis dengan Algoritma Apriori
          </span>
          <span style={{ fontSize: 13, color: "var(--body)", fontWeight: 500 }}>
            Rules yang dihasilkan akan otomatis mengisi widget{" "}
            <b style={{ color: "var(--navy)" }}>"Sering Dibeli Bersama"</b> di toko pelanggan.
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start", flex: 1 }}>
        <div className="col gap-18" style={{ position: "sticky", top: 88 }}>
          <div className="card" style={{ padding: 22 }}>
            <div className="row gap-10" style={{ marginBottom: 20 }}>
              <span style={{ color: "var(--navy)" }}>
                <Icon name="settings" size={19} />
              </span>
              <h3 style={{ fontSize: 17 }}>Parameter</h3>
            </div>
            <div className="col gap-22">
              <ParamControl
                label="Minimum Support"
                value={support}
                onChange={setSupport}
                min={0.05}
                max={0.5}
                step={0.01}
                hint="Seberapa sering kombinasi item muncul di seluruh transaksi."
              />
              <ParamControl
                label="Minimum Confidence"
                value={confidence}
                onChange={setConfidence}
                min={0.1}
                max={1}
                step={0.05}
                hint="Seberapa kuat keterkaitan antar item dalam sebuah rule."
              />
            </div>
            <button
              type="button"
              className="btn btn-sky btn-lg btn-block"
              style={{ marginTop: 24 }}
              disabled
              title="Akan diaktifkan setelah ada data transaksi"
            >
              <Icon name="play" size={17} /> Jalankan Analisis
            </button>
            <div
              className="row gap-8"
              style={{
                marginTop: 14,
                padding: "10px 12px",
                borderRadius: 12,
                background: "var(--bg)",
              }}
            >
              <span style={{ color: "var(--muted)" }}>
                <Icon name="info" size={15} />
              </span>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                Belum pernah dijalankan
              </span>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h4
              style={{
                marginBottom: 14,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: ".04em",
                fontSize: 11.5,
              }}
            >
              Ringkasan
            </h4>
            <div className="col gap-12">
              {[
                ["Total transaksi", "—"],
                ["Frequent itemsets", "—"],
                ["Rules dihasilkan", "—"],
              ].map(([k, v]) => (
                <div key={k} className="row">
                  <span className="mut" style={{ fontSize: 13.5 }}>{k}</span>
                  <div className="spacer" />
                  <span className="num" style={{ fontWeight: 800, color: "var(--navy)", fontSize: 16 }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col gap-18">
          <div className="card" style={{ overflow: "hidden" }}>
            <div className="row" style={{ padding: "18px 22px 14px" }}>
              <div className="col" style={{ gap: 2 }}>
                <h3 style={{ fontSize: 18 }}>Association Rules</h3>
                <span className="mut" style={{ fontSize: 12.5, fontWeight: 600 }}>
                  Jalankan analisis untuk melihat hasil
                </span>
              </div>
              <div className="spacer" />
              <button type="button" className="btn btn-outline btn-sm" disabled>
                <Icon name="download" size={15} /> PDF
              </button>
              <button type="button" className="btn btn-outline btn-sm" disabled>
                <Icon name="download" size={15} /> Excel
              </button>
            </div>

            <div
              className="col"
              style={{
                alignItems: "center",
                gap: 12,
                padding: "56px 20px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: "var(--sky-50)",
                  color: "var(--sky)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name="spark" size={32} />
              </span>
              <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 16 }}>
                Belum ada hasil
              </span>
              <span className="mut" style={{ fontSize: 13.5, maxWidth: 360 }}>
                Tampilan kosong ini akan terisi setelah data transaksi tersedia dan analisis
                dijalankan. Tabel akan menampilkan kolom <b>Antecedent → Consequent</b>,{" "}
                <b>Support</b>, <b>Confidence</b>, dan <b>Lift</b>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParamControl({ label, value, onChange, min, max, step, hint }) {
  return (
    <div className="col gap-10">
      <div className="row">
        <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>{label}</span>
        <div className="spacer" />
        <span className="num" style={{ fontWeight: 800, color: "var(--navy)", fontSize: 16 }}>
          {(value * 100).toFixed(0)}%
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ accentColor: "var(--sky)", width: "100%" }}
      />
      <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, lineHeight: 1.4 }}>
        {hint}
      </span>
    </div>
  );
}
