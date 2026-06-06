"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import Icon from "@/components/ui/Icon";
import Illo from "@/components/ui/Illo";
import Logo from "@/components/ui/Logo";
import { auth } from "@/lib/firebase/client";
import { loginAdmin, translateAuthError } from "@/lib/firebase/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) router.replace("/admin");
    });
    return unsub;
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginAdmin(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(translateAuthError(err.code));
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1.1fr 1fr" }}>
      <div
        style={{
          position: "relative",
          background: "linear-gradient(160deg, var(--navy) 0%, var(--navy-900) 100%)",
          overflow: "hidden",
          padding: 56,
          display: "flex",
          flexDirection: "column",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.16,
            background:
              "radial-gradient(50% 40% at 80% 10%, var(--sky), transparent 60%), radial-gradient(40% 40% at 10% 90%, var(--sky), transparent 60%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Logo height={42} mono />
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ width: 150, height: 120 }}>
            <Illo type="whole" size={210} />
          </div>
          <h2 style={{ color: "#fff", fontSize: 30, maxWidth: 360, lineHeight: 1.15 }}>
            Panel Pemilik Kandank Iwak
          </h2>
          <p style={{ color: "#bcc0e4", fontSize: 15, maxWidth: 360, margin: 0, lineHeight: 1.6 }}>
            Kelola produk, pesanan, dan jalankan analisis Apriori untuk rekomendasi cerdas di toko
            Anda.
          </p>
        </div>
      </div>

      <form
        onSubmit={submit}
        style={{ display: "grid", placeItems: "center", padding: 40, background: "var(--bg)" }}
      >
        <div className="col gap-20" style={{ width: 360 }}>
          <div className="col gap-6">
            <h1 style={{ fontSize: 28 }}>Masuk Admin</h1>
            <p className="mut" style={{ margin: 0 }}>
              Gunakan akun admin yang dibuat lewat Firebase Console.
            </p>
          </div>

          <div className="field">
            <label>Email</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: 13, color: "var(--muted)" }}>
                <Icon name="user" size={18} />
              </span>
              <input
                type="email"
                className="input"
                style={{ paddingLeft: 42 }}
                placeholder="admin@kandankiwak.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: 13, color: "var(--muted)" }}>
                <Icon name="lock" size={18} />
              </span>
              <input
                type="password"
                className="input"
                style={{ paddingLeft: 42 }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
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
              <Icon name="info" size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="ki-spin" /> Memproses…
              </>
            ) : (
              <>
                Masuk ke Dashboard <Icon name="arrowR" size={18} />
              </>
            )}
          </button>
          <Link href="/" className="btn btn-ghost btn-block">
            ← Kembali ke toko pelanggan
          </Link>
        </div>
      </form>
    </div>
  );
}
