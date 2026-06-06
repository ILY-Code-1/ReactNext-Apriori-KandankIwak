/* ===========================================================
   Kandank Iwak — Admin: login, shell, dashboard
   =========================================================== */

/* ---------------- Admin login ---------------- */
function AdminLogin({ onLogin, onExit, embedded }) {
  const [u, setU] = useState("admin");
  const [p, setP] = useState("");
  return (
    <div style={{ minHeight: embedded ? 768 : "100vh", display: "grid", gridTemplateColumns: "1.1fr 1fr" }}>
      {/* left brand panel */}
      <div style={{ position: "relative", background: "linear-gradient(160deg, var(--navy) 0%, var(--navy-900) 100%)", overflow: "hidden", padding: 56, display: "flex", flexDirection: "column", color: "#fff" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.16, background: "radial-gradient(50% 40% at 80% 10%, var(--sky), transparent 60%), radial-gradient(40% 40% at 10% 90%, var(--sky), transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}><Logo height={42} mono /></div>
        <div style={{ position: "relative", zIndex: 1, marginTop: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ width: 150, height: 120 }}><Illo type="whole" size={210} /></div>
          <h2 style={{ color: "#fff", fontSize: 30, maxWidth: 360, lineHeight: 1.15 }}>Panel Pemilik Kandank Iwak</h2>
          <p style={{ color: "#bcc0e4", fontSize: 15, maxWidth: 360, margin: 0, lineHeight: 1.6 }}>Kelola produk, pesanan, dan jalankan analisis Apriori untuk rekomendasi cerdas di toko Anda.</p>
          <div className="row gap-20" style={{ marginTop: 8 }}>
            {[["36", "Transaksi"], ["6", "Produk"], ["Apriori", "Engine aktif"]].map(([a, b]) => (
              <div key={b} className="col" style={{ gap: 2 }}><span className="num" style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{a}</span><span style={{ fontSize: 12, color: "#9fa3cf", fontWeight: 600 }}>{b}</span></div>
            ))}
          </div>
        </div>
      </div>
      {/* right form */}
      <div style={{ display: "grid", placeItems: "center", padding: 40, background: "var(--bg)" }}>
        <div className="col gap-20" style={{ width: 360 }}>
          <div className="col gap-6"><h1 style={{ fontSize: 28 }}>Masuk Admin</h1><p className="mut" style={{ margin: 0 }}>Silakan masuk untuk mengelola toko.</p></div>
          <div className="field"><label>Username</label><div style={{ position: "relative" }}><span style={{ position: "absolute", left: 14, top: 13, color: "var(--muted)" }}><Icon name="user" size={18} /></span><input className="input" style={{ paddingLeft: 42 }} value={u} onChange={(e) => setU(e.target.value)} /></div></div>
          <div className="field"><label>Password</label><div style={{ position: "relative" }}><span style={{ position: "absolute", left: 14, top: 13, color: "var(--muted)" }}><Icon name="lock" size={18} /></span><input className="input" type="password" style={{ paddingLeft: 42 }} placeholder="••••••••" value={p} onChange={(e) => setP(e.target.value)} /></div></div>
          <div className="row"><label className="row gap-8" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--body)", cursor: "pointer" }}><input type="checkbox" defaultChecked style={{ accentColor: "var(--sky)" }} /> Ingat saya</label><div className="spacer" /><a style={{ fontSize: 13.5, fontWeight: 600, color: "var(--sky-600)" }}>Lupa password?</a></div>
          <button className="btn btn-primary btn-lg btn-block" onClick={onLogin}>Masuk ke Dashboard <Icon name="arrowR" size={18} /></button>
          <button className="btn btn-ghost btn-block" onClick={onExit}>← Kembali ke toko pelanggan</button>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", margin: 0 }}>Demo: tekan “Masuk” untuk langsung melihat dashboard.</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Admin sidebar + shell ---------------- */
function AdminShell({ page, go, onExit, children, lastRun, embedded }) {
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "grid" },
    { id: "products", label: "Kelola Produk", icon: "pkg" },
    { id: "orders", label: "Kelola Pesanan", icon: "receipt", badge: 2 },
    { id: "transactions", label: "Data Transaksi", icon: "chart" },
    { id: "apriori", label: "Analisis Apriori", icon: "spark", accent: true },
  ];
  const titles = {
    dashboard: "Dashboard", products: "Kelola Produk", orders: "Kelola Pesanan",
    transactions: "Data Transaksi", apriori: "Analisis Apriori",
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "248px 1fr", minHeight: embedded ? 768 : "100vh", background: "var(--bg)" }}>
      {/* sidebar */}
      <aside style={{ background: "#fff", borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", position: embedded ? "static" : "sticky", top: 0, height: embedded ? "auto" : "100vh" }}>
        <div style={{ padding: "22px 22px 18px" }}><Logo height={36} /></div>
        <nav className="col gap-4" style={{ padding: "6px 14px" }}>
          {nav.map((n) => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => go(n.id)} className="row gap-12" style={{
                padding: "11px 14px", borderRadius: 12, fontWeight: 700, fontSize: 14.5, justifyContent: "flex-start",
                color: active ? "#fff" : (n.accent ? "var(--sky-600)" : "var(--body)"),
                background: active ? "var(--navy)" : (n.accent ? "var(--sky-50)" : "transparent"),
                boxShadow: active ? "var(--shadow)" : "none",
              }}>
                <Icon name={n.icon} size={19} /> {n.label}
                {n.badge && <span className="num" style={{ marginLeft: "auto", minWidth: 20, height: 20, padding: "0 5px", borderRadius: 999, background: active ? "rgba(255,255,255,.25)" : "var(--red)", color: "#fff", fontSize: 11, fontWeight: 800, display: "grid", placeItems: "center" }}>{n.badge}</span>}
                {n.accent && !n.badge && <span style={{ marginLeft: "auto" }}><Icon name="spark" size={14} /></span>}
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", padding: 16 }}>
          <div className="card card-line" style={{ padding: 14, boxShadow: "none", background: "var(--sky-50)", border: "none" }}>
            <div className="row gap-8"><span style={{ color: "var(--sky-600)" }}><Icon name="info" size={16} /></span><span style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)" }}>Apriori terakhir</span></div>
            <p style={{ fontSize: 12, color: "var(--body)", margin: "6px 0 0", fontWeight: 600 }}>{lastRun ? lastRun : "Belum dijalankan"}</p>
          </div>
          <button className="row gap-12" onClick={onExit} style={{ width: "100%", padding: "11px 14px", borderRadius: 12, fontWeight: 700, fontSize: 14, color: "var(--body)", justifyContent: "flex-start", marginTop: 6 }}>
            <Icon name="logout" size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* main */}
      <div className="col" style={{ minWidth: 0 }}>
        <header className="row gap-16" style={{ height: 70, padding: "0 30px", background: "rgba(255,255,255,.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)", position: embedded ? "static" : "sticky", top: 0, zIndex: 30 }}>
          <h2 style={{ fontSize: 21, whiteSpace: "nowrap" }}>{titles[page]}</h2>
          <div className="spacer" />
          <div className="row gap-8" style={{ background: "var(--bg)", borderRadius: 999, padding: "9px 14px", width: 240, color: "var(--muted)" }}><Icon name="search" size={17} /><span style={{ fontSize: 13, fontWeight: 600 }}>Cari…</span></div>
          <button className="row" style={{ width: 42, height: 42, borderRadius: 999, background: "var(--bg)", color: "var(--navy)", justifyContent: "center", position: "relative" }}><Icon name="bell" size={19} /><span style={{ position: "absolute", top: 9, right: 10, width: 8, height: 8, borderRadius: 999, background: "var(--red)", boxShadow: "0 0 0 2px var(--bg)" }} /></button>
          <div className="row gap-10" style={{ paddingLeft: 6 }}>
            <span style={{ width: 40, height: 40, borderRadius: 999, background: "var(--navy)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 15 }}>KI</span>
            <div className="col" style={{ gap: 0 }}><span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink)" }}>Pak Anwar</span><span style={{ fontSize: 11.5, color: "var(--muted)" }}>Pemilik</span></div>
          </div>
        </header>
        <main style={{ padding: 30, flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function StatCard({ icon, label, value, delta, tint }) {
  return (
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="row">
        <span style={{ width: 44, height: 44, borderRadius: 13, background: tint === "sky" ? "var(--sky-50)" : tint === "green" ? "var(--green-50)" : "var(--bg-2)", color: tint === "sky" ? "var(--sky-600)" : tint === "green" ? "var(--green)" : "var(--navy)", display: "grid", placeItems: "center" }}><Icon name={icon} size={23} /></span>
        <div className="spacer" />
        {delta && <span className="badge badge-green"><Icon name="chart" size={12} /> {delta}</span>}
      </div>
      <div className="col" style={{ gap: 2 }}>
        <span className="num" style={{ fontSize: 27, fontWeight: 800, color: "var(--ink)" }}>{value}</span>
        <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{label}</span>
      </div>
    </div>
  );
}

function Dashboard({ go }) {
  const KI = window.KI;
  const max = Math.max(...KI.salesSeries.map((s) => s.value));
  const topProducts = [
    { p: KI.productMap.nila, sold: 142, pct: 92 },
    { p: KI.productMap.bumbu, sold: 118, pct: 76 },
    { p: KI.productMap.fillet, sold: 64, pct: 42 },
    { p: KI.productMap.pakan, sold: 39, pct: 26 },
  ];
  return (
    <div className="col gap-22 kiup">
      {/* stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
        <StatCard icon="chart" label="Total Penjualan (bln ini)" value="Rp14,8 jt" delta="+12%" tint="green" />
        <StatCard icon="receipt" label="Jumlah Transaksi" value="36" delta="+8%" tint="sky" />
        <StatCard icon="pkg" label="Produk Aktif" value="6" tint="navy" />
        <StatCard icon="spark" label="Produk Terlaris" value="Nila Segar" tint="sky" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}>
        {/* sales chart */}
        <div className="card" style={{ padding: 24 }}>
          <div className="row" style={{ marginBottom: 22 }}>
            <div className="col" style={{ gap: 2 }}><h3 style={{ fontSize: 18 }}>Penjualan 7 Hari Terakhir</h3><span className="mut" style={{ fontSize: 12.5, fontWeight: 600 }}>dalam ribuan Rupiah</span></div>
            <div className="spacer" />
            <span className="chip">Minggu ini</span>
          </div>
          <div className="row" style={{ alignItems: "flex-end", gap: 16, height: 200, paddingTop: 10 }}>
            {KI.salesSeries.map((s, i) => (
              <div key={s.day} className="col" style={{ flex: 1, alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}>
                <span className="num" style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)" }}>{s.value}</span>
                <div style={{ width: "100%", maxWidth: 38, height: `${(s.value / max) * 100}%`, borderRadius: "8px 8px 4px 4px", background: i === 5 ? "linear-gradient(180deg, var(--sky), var(--sky-600))" : "linear-gradient(180deg, #cfe9f8, #b6ddf2)", transition: "height .5s" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--body)" }}>{s.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* top products */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 18 }}>Produk Terlaris</h3>
          <div className="col gap-16">
            {topProducts.map(({ p, sold, pct }) => (
              <div key={p.id} className="col gap-6">
                <div className="row gap-10">
                  <div className={`illo illo-${p.tint}`} style={{ width: 38, height: 32, aspectRatio: "auto", flex: "0 0 auto" }}><Illo type={p.illo} size={34} /></div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{p.name}</span>
                  <div className="spacer" />
                  <span className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>{sold}</span>
                </div>
                <div style={{ height: 7, borderRadius: 999, background: "var(--bg-2)", overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--sky), var(--navy))" }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* apriori promo + recent orders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 18 }}>
        <div className="card" style={{ padding: 24, background: "linear-gradient(150deg, var(--navy), var(--navy-900))", color: "#fff", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.18, background: "radial-gradient(50% 50% at 90% 10%, var(--sky), transparent 60%)" }} />
          <div style={{ position: "relative" }}>
            <span style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,.16)", display: "grid", placeItems: "center", marginBottom: 16 }}><Icon name="spark" size={23} /></span>
            <h3 style={{ color: "#fff", fontSize: 19, marginBottom: 8 }}>Analisis Apriori</h3>
            <p style={{ color: "#c2c5ea", fontSize: 13.5, margin: "0 0 18px", lineHeight: 1.55 }}>Temukan pola “sering dibeli bersama” dari data transaksi dan tampilkan otomatis di toko.</p>
            <button className="btn btn-sky" onClick={() => go("apriori")}>Buka Analisis <Icon name="arrowR" size={17} /></button>
          </div>
        </div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="row" style={{ padding: "18px 22px 12px" }}><h3 style={{ fontSize: 18 }}>Pesanan Terbaru</h3><div className="spacer" /><button className="btn btn-ghost btn-sm" onClick={() => go("orders")}>Lihat semua</button></div>
          <table className="tbl">
            <tbody>
              {KI.orderSeed.slice(0, 4).map((o) => (
                <tr key={o.id}>
                  <td><span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>{o.id}</span></td>
                  <td>{o.name}</td>
                  <td className="num" style={{ fontWeight: 700, color: "var(--navy)" }}>{money(o.total)}</td>
                  <td><OrderStatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }) {
  const map = { baru: ["badge-amber", "Baru"], diproses: ["badge-navy", "Diproses"], selesai: ["badge-green", "Selesai"] };
  const [cls, label] = map[status] || map.baru;
  return <span className={`badge ${cls}`}><span className="dot" />{label}</span>;
}

Object.assign(window, { AdminLogin, AdminShell, Dashboard, StatCard, OrderStatusBadge });
