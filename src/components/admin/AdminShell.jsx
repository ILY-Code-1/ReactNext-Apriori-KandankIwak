"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/products", label: "Kelola Produk", icon: "pkg" },
  { href: "/admin/orders", label: "Kelola Pesanan", icon: "receipt", badge: 2 },
  { href: "/admin/transactions", label: "Data Transaksi", icon: "chart" },
  { href: "/admin/apriori", label: "Analisis Apriori", icon: "spark", accent: true },
];

const TITLES = {
  "/admin": "Dashboard",
  "/admin/products": "Kelola Produk",
  "/admin/orders": "Kelola Pesanan",
  "/admin/transactions": "Data Transaksi",
  "/admin/apriori": "Analisis Apriori",
};

export default function AdminShell({ children, lastRun = "Belum dijalankan" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const title = TITLES[pathname] || "Admin";

  const initial = (user?.email || "?").charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    router.replace("/admin/login");
  };

  return (
    <div
      className="layout-aside-main"
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
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)" }}>
                Apriori terakhir
              </span>
            </div>
            <p style={{ fontSize: 12, color: "var(--body)", margin: "6px 0 0", fontWeight: 600 }}>
              {lastRun}
            </p>
          </div>
          <button
            type="button"
            className="row gap-12"
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "11px 14px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              color: "var(--body)",
              justifyContent: "flex-start",
              marginTop: 6,
            }}
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
          <button
            type="button"
            className="row"
            style={{
              width: 42,
              height: 42,
              borderRadius: 999,
              background: "var(--bg)",
              color: "var(--navy)",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Icon name="bell" size={19} />
            <span
              style={{
                position: "absolute",
                top: 9,
                right: 10,
                width: 8,
                height: 8,
                borderRadius: 999,
                background: "var(--red)",
                boxShadow: "0 0 0 2px var(--bg)",
              }}
            />
          </button>
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
    </div>
  );
}
