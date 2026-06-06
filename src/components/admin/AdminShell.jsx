"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/products", label: "Kelola Produk", icon: "pkg" },
  { href: "/admin/orders", label: "Kelola Pesanan", icon: "receipt" },
  { href: "/admin/payment-methods", label: "Metode Pembayaran", icon: "card" },
  { href: "/admin/transactions", label: "Data Transaksi", icon: "chart" },
  { href: "/admin/apriori", label: "Analisis Apriori", icon: "spark", accent: true },
];

const TITLES = {
  "/admin": "Dashboard",
  "/admin/products": "Kelola Produk",
  "/admin/orders": "Kelola Pesanan",
  "/admin/payment-methods": "Metode Pembayaran",
  "/admin/transactions": "Data Transaksi",
  "/admin/apriori": "Analisis Apriori",
};

export default function AdminShell({ children, lastRun = "Belum dijalankan" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const title = TITLES[pathname] || "Admin";
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initial = (user?.email || "?").charAt(0).toUpperCase();

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.replace("/admin/login");
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "248px 1fr",
        gap: 0,
        minHeight: "100vh",
        background: "var(--bg)",
      }}
    >
      <aside
        style={{
          background: "#fff",
          borderRight: "1px solid var(--line)",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div style={{ padding: "22px 22px 18px" }}>
          <Logo height={36} />
        </div>
        <nav className="col gap-4" style={{ padding: "6px 14px" }}>
          {NAV.map((n) => {
            const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className="row gap-12"
                style={{
                  padding: "11px 14px",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14.5,
                  justifyContent: "flex-start",
                  color: active ? "#fff" : n.accent ? "var(--sky-600)" : "var(--body)",
                  background: active ? "var(--navy)" : n.accent ? "var(--sky-50)" : "transparent",
                  boxShadow: active ? "var(--shadow)" : "none",
                }}
              >
                <Icon name={n.icon} size={19} /> {n.label}
                {n.badge && (
                  <span
                    className="num"
                    style={{
                      marginLeft: "auto",
                      minWidth: 20,
                      height: 20,
                      padding: "0 5px",
                      borderRadius: 999,
                      background: active ? "rgba(255,255,255,.25)" : "var(--red)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 800,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {n.badge}
                  </span>
                )}
                {n.accent && !n.badge && (
                  <span style={{ marginLeft: "auto" }}>
                    <Icon name="spark" size={14} />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", padding: 16 }}>
          <div
            className="card card-line"
            style={{
              padding: 14,
              boxShadow: "none",
              background: "var(--sky-50)",
              border: "none",
            }}
          >
            <div className="row gap-8">
              <span style={{ color: "var(--sky-600)" }}>
                <Icon name="info" size={16} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)" }}>Apriori terakhir</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--body)", margin: "6px 0 0", fontWeight: 600 }}>{lastRun}</p>
          </div>
          <button
            type="button"
            className="row gap-12"
            onClick={() => setConfirmLogout(true)}
            style={{
              width: "100%",
              padding: "11px 14px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              color: "#fff",
              background: "#b03d4d",
              justifyContent: "flex-start",
              marginTop: 6,
              boxShadow: "0 4px 12px -4px rgba(176, 61, 77, .5)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#922f3e")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#b03d4d")}
          >
            <Icon name="logout" size={18} /> Keluar
          </button>
        </div>
      </aside>

      <div className="col" style={{ minWidth: 0 }}>
        <header
          className="row gap-16"
          style={{
            height: 70,
            padding: "0 30px",
            background: "rgba(255,255,255,.85)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid var(--line)",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <h2 style={{ fontSize: 21, whiteSpace: "nowrap" }}>{title}</h2>
          <div className="spacer" />
          <div
            className="row gap-8"
            style={{
              background: "var(--bg)",
              borderRadius: 999,
              padding: "9px 14px",
              width: 240,
              color: "var(--muted)",
            }}
          >
            <Icon name="search" size={17} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Cari…</span>
          </div>
          <div className="row gap-10" style={{ paddingLeft: 6 }}>
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                background: "var(--navy)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              {initial}
            </span>
            <div className="col" style={{ gap: 0, maxWidth: 160 }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: "var(--ink)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email || "Admin"}
              </span>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Pemilik</span>
            </div>
          </div>
        </header>
        <main style={{ padding: 30, flex: 1, minWidth: 0 }}>{children}</main>
      </div>

      {confirmLogout && (
        <div
          onClick={() => !loggingOut && setConfirmLogout(false)}
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
              <Icon name="logout" size={26} />
            </span>
            <h3 style={{ fontSize: 19 }}>Keluar dari panel admin?</h3>
            <p className="mut" style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
              Kamu perlu masuk lagi untuk mengelola produk dan pesanan.
            </p>
            <div className="row gap-10" style={{ width: "100%", marginTop: 8 }}>
              <button type="button" className="btn btn-ghost btn-block" onClick={() => setConfirmLogout(false)} disabled={loggingOut}>
                Batal
              </button>
              <button type="button" className="btn btn-primary btn-block" onClick={handleConfirmLogout} disabled={loggingOut} style={{ background: "var(--red)" }}>
                {loggingOut ? (
                  <>
                    <span className="ki-spin" /> Keluar…
                  </>
                ) : (
                  "Ya, Keluar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
