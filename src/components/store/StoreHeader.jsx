"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { useCart } from "@/context/CartContext";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/products", label: "Katalog" },
  { href: "/track", label: "Lacak Pesanan" },
];

export default function StoreHeader() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();
  const showBadge = hydrated && count > 0;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="wrap row" style={{ height: 72, gap: 16 }}>
        <Link href="/" className="row gap-8">
          <Logo height={38} />
        </Link>
        <nav className="row gap-4 hide-mobile" style={{ marginLeft: 18 }}>
          {LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: "9px 15px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 14.5,
                  color: active ? "var(--navy)" : "var(--body)",
                  background: active ? "var(--sky-50)" : "transparent",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="spacer" />
        <div
          className="row gap-8 hide-mobile"
          style={{
            background: "var(--bg)",
            borderRadius: 999,
            padding: "9px 14px",
            width: 230,
            color: "var(--muted)",
          }}
        >
          <Icon name="search" size={18} />
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>Cari ikan, bumbu…</span>
        </div>
        <Link
          href="/cart"
          className="row"
          style={{
            position: "relative",
            width: 46,
            height: 46,
            borderRadius: 999,
            background: "var(--navy)",
            color: "#fff",
            justifyContent: "center",
          }}
        >
          <Icon name="cart" size={21} />
          {showBadge && (
            <span
              className="num"
              style={{
                position: "absolute",
                top: -3,
                right: -3,
                minWidth: 20,
                height: 20,
                padding: "0 5px",
                borderRadius: 999,
                background: "var(--sky)",
                color: "#fff",
                fontSize: 11.5,
                fontWeight: 800,
                display: "grid",
                placeItems: "center",
                boxShadow: "0 0 0 3px #fff",
              }}
            >
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
