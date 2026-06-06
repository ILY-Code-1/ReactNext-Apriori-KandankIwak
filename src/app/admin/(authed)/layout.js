"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";

function FullPageSpinner({ label = "Memuat…" }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
      }}
    >
      <div className="col" style={{ alignItems: "center", gap: 12 }}>
        <span className="ki-spin ki-spin-lg" />
        <span className="mut" style={{ fontWeight: 600 }}>{label}</span>
      </div>
    </div>
  );
}

function Guard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  if (loading) return <FullPageSpinner />;
  if (!user) return <FullPageSpinner label="Mengarahkan…" />;

  return <AdminShell lastRun="Belum dijalankan">{children}</AdminShell>;
}

export default function AuthedAdminLayout({ children }) {
  return (
    <AuthProvider>
      <Guard>{children}</Guard>
    </AuthProvider>
  );
}
