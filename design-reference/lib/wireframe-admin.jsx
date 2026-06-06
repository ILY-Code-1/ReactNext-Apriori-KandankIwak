/* ===========================================================
   Kandank Iwak — Wireframe Admin screens
   =========================================================== */

function WAdminShell({ active = "Dashboard", title, children }) {
  const nav = ["Dashboard", "Kelola Produk", "Kelola Pesanan", "Data Transaksi", "Analisis Apriori"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: 720, background: "var(--w-fill-2)" }}>
      <div className="wf-col" style={{ background: "#fff", borderRight: "1.5px solid var(--w-line)", padding: 16, gap: 6 }}>
        <div className="wf-box" style={{ padding: "8px 14px", width: 70, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>LOGO</div>
        {nav.map((n) => (
          <div key={n} className="wf-row" style={{ gap: 11, padding: "10px 12px", borderRadius: 9, background: active === n ? "var(--w-solid)" : "transparent", border: active === n ? "none" : "1.5px solid transparent" }}>
            <div className="wf-box" style={{ width: 18, height: 18, borderRadius: 5, background: active === n ? "#fff" : "var(--w-fill)" }} />
            <Bar w={active === n ? 92 : 86} h={9} dark={active === n} />
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <Card pad={12} style={{ background: "var(--w-fill-2)" }}><Bar w="60%" h={7} style={{ marginBottom: 6 }} /><Bar w="85%" h={7} /></Card>
      </div>
      <div className="wf-col">
        <div className="wf-row" style={{ height: 64, padding: "0 26px", borderBottom: "1.5px solid var(--w-line)", gap: 14, background: "#fff" }}>
          <Bar w={150} h={14} dark />
          <div style={{ flex: 1 }} />
          <div className="wf-input" style={{ width: 200, height: 36 }} />
          <IconBox size={40} r={999} />
          <div className="wf-row" style={{ gap: 8 }}><IconBox size={36} r={999} /><div className="wf-col" style={{ gap: 4 }}><Bar w={56} h={8} dark /><Bar w={40} h={6} /></div></div>
        </div>
        <div style={{ padding: 26 }}>{children}</div>
      </div>
    </div>
  );
}

function WTable({ cols, rows = 5, render }) {
  return (
    <Card pad={0} style={{ overflow: "hidden" }}>
      <table className="wf-tbl">
        <thead><tr>{cols.map((c, i) => <th key={i} style={{ textAlign: c.right ? "right" : "left" }}>{c.label}</th>)}</tr></thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>{cols.map((c, i) => <td key={i} style={{ textAlign: c.right ? "right" : "left" }}>{render ? render(c, r, i) : <Bar w={c.w || "70%"} h={9} />}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function WFLogin() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", minHeight: 600 }}>
      <div className="wf-col" style={{ background: "var(--w-fill)", padding: 48, justifyContent: "space-between", borderRight: "1.5px solid var(--w-line)" }}>
        <div className="wf-box" style={{ padding: "8px 14px", width: 70, fontWeight: 700, fontSize: 12, background: "#fff" }}>LOGO</div>
        <div className="wf-col" style={{ gap: 16 }}>
          <ImgBox h={110} label="ILUSTRASI" style={{ width: 150 }} />
          <Bar w="80%" h={20} dark /><Lines rows={2} widths={["90%", "70%"]} />
          <div className="wf-row" style={{ gap: 24 }}>{[0, 1, 2].map((i) => <div key={i} className="wf-col" style={{ gap: 5 }}><Bar w={40} h={14} dark /><Bar w={60} h={6} /></div>)}</div>
        </div>
      </div>
      <div style={{ display: "grid", placeItems: "center", padding: 40, background: "#fff" }}>
        <div className="wf-col" style={{ gap: 18, width: 320 }}>
          <Bar w={160} h={20} dark /><Bar w={220} h={8} />
          <Field label /><Field label />
          <div className="wf-row"><div className="wf-row" style={{ gap: 7 }}><div className="wf-box" style={{ width: 15, height: 15, borderRadius: 4 }} /><Bar w={70} h={7} /></div><div style={{ flex: 1 }} /><Bar w={80} h={7} /></div>
          <Btn label="Masuk ke Dashboard" solid block h={46} />
          <Btn label="← Kembali ke toko" block />
        </div>
      </div>
    </div>
  );
}

function WFDashboard() {
  return (
    <WAdminShell active="Dashboard" title="Dashboard">
      <div className="wf-col" style={{ gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {[0, 1, 2, 3].map((i) => <Card key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}><div className="wf-row"><IconBox size={42} /><div style={{ flex: 1 }} /><Chip w={50} /></div><Bar w="70%" h={18} dark /><Bar w="55%" h={8} /></Card>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
          <Card pad={22}>
            <div className="wf-row" style={{ marginBottom: 18 }}><Bar w={180} h={11} dark /><div style={{ flex: 1 }} /><Chip w={70} /></div>
            <div className="wf-row" style={{ alignItems: "flex-end", gap: 14, height: 180 }}>
              {[55, 70, 64, 86, 95, 100, 78].map((h, i) => <div key={i} className="wf-col" style={{ flex: 1, alignItems: "center", gap: 8, justifyContent: "flex-end", height: "100%" }}><div className="wf-soft" style={{ width: "70%", height: h + "%", borderRadius: "6px 6px 3px 3px", background: i === 5 ? "var(--w-solid)" : "var(--w-fill)" }} /><Bar w={20} h={6} /></div>)}
            </div>
            <div style={{ marginTop: 10 }}><Note>grafik penjualan 7 hari</Note></div>
          </Card>
          <Card pad={22}>
            <Bar w={140} h={11} dark style={{ marginBottom: 18 }} />
            <div className="wf-col" style={{ gap: 16 }}>{[80, 64, 44, 28].map((w, i) => <div key={i} className="wf-col" style={{ gap: 6 }}><div className="wf-row" style={{ gap: 10 }}><ImgBox h={30} label="" style={{ width: 34 }} /><Bar w="50%" h={8} /><div style={{ flex: 1 }} /><Bar w={24} h={7} /></div><div className="wf-bar" style={{ height: 6 }}><div className="wf-bar-dark" style={{ width: w + "%", height: "100%" }} /></div></div>)}</div>
          </Card>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>
          <Card pad={22} style={{ background: "var(--w-fill)" }}><IconBox size={42} /><Bar w="60%" h={12} dark style={{ margin: "14px 0 8px" }} /><Lines rows={2} /><div style={{ marginTop: 16 }}><Btn label="Buka Analisis Apriori" solid /></div></Card>
          <Card pad={0} style={{ overflow: "hidden" }}>
            <div className="wf-row" style={{ padding: "16px 18px 8px" }}><Bar w={130} h={10} dark /><div style={{ flex: 1 }} /><Bar w={70} h={7} /></div>
            <WTable cols={[{ label: "ID", w: "60%" }, { label: "Pelanggan" }, { label: "Total", right: true, w: "60%" }, { label: "Status", w: 70 }]} rows={4} render={(c, r) => c.label === "Status" ? <div className="wf-chip" style={{ width: 70, justifyContent: "center" }}><Bar w="60%" h={6} /></div> : <Bar w={c.w || "70%"} h={9} style={{ marginLeft: c.right ? "auto" : 0 }} />} />
          </Card>
        </div>
      </div>
    </WAdminShell>
  );
}

function WFProducts() {
  return (
    <WAdminShell active="Kelola Produk" title="Kelola Produk">
      <div className="wf-col" style={{ gap: 16 }}>
        <div className="wf-row"><Bar w={120} h={8} /><div style={{ flex: 1 }} /><Btn label="Ekspor" /><Btn label="+ Tambah Produk" solid /></div>
        <WTable
          cols={[{ label: "Produk" }, { label: "Kategori", w: 80 }, { label: "Harga", w: 70 }, { label: "Stok", w: 90 }, { label: "Status", w: 70 }, { label: "Aksi", right: true, w: 80 }]}
          rows={6}
          render={(c, r) => {
            if (c.label === "Produk") return <div className="wf-row" style={{ gap: 12 }}><ImgBox h={36} label="" style={{ width: 42 }} /><div className="wf-col" style={{ gap: 5 }}><Bar w={120} h={8} dark /><Bar w={70} h={6} /></div></div>;
            if (c.label === "Kategori" || c.label === "Status") return <div className="wf-chip" style={{ width: c.w, justifyContent: "center" }}><Bar w="60%" h={6} /></div>;
            if (c.label === "Stok") return <div className="wf-row" style={{ gap: 6 }}><div className="wf-box" style={{ width: 24, height: 24, borderRadius: 6 }} /><Bar w={26} h={9} dark /><div className="wf-box" style={{ width: 24, height: 24, borderRadius: 6 }} /></div>;
            if (c.label === "Aksi") return <div className="wf-row" style={{ gap: 6, justifyContent: "flex-end" }}><IconBox size={30} /><IconBox size={30} /></div>;
            return <Bar w="70%" h={9} dark />;
          }}
        />
        <Note>klik “+ Tambah Produk” membuka modal form (nama, kategori, harga, stok)</Note>
      </div>
    </WAdminShell>
  );
}

function WFOrders() {
  return (
    <WAdminShell active="Kelola Pesanan" title="Kelola Pesanan">
      <div className="wf-col" style={{ gap: 16 }}>
        <div className="wf-row" style={{ gap: 8 }}>{["Semua", "Baru", "Diproses", "Selesai"].map((t, i) => <div key={t} className="wf-btn" style={{ background: i === 0 ? "var(--w-solid)" : "#fff", borderColor: i === 0 ? "var(--w-solid)" : "var(--w-line)", padding: "8px 16px" }}>{t}</div>)}</div>
        <WTable
          cols={[{ label: "ID Pesanan", w: 80 }, { label: "Pelanggan" }, { label: "Item" }, { label: "Total", w: 70 }, { label: "Status", w: 80 }, { label: "Aksi", right: true, w: 90 }]}
          rows={6}
          render={(c, r) => {
            if (c.label === "Item") return <div className="wf-row" style={{ gap: 5 }}>{[0, 1].map((i) => <div key={i} className="wf-chip" style={{ width: 50, justifyContent: "center" }}><Bar w="60%" h={5} /></div>)}</div>;
            if (c.label === "Status") return <div className="wf-chip" style={{ width: 80, justifyContent: "center" }}><Bar w="55%" h={6} /></div>;
            if (c.label === "Aksi") return <div className="wf-btn" style={{ marginLeft: "auto", padding: "6px 12px", fontSize: 11 }}>Proses →</div>;
            return <Bar w={c.w ? c.w : "70%"} h={9} dark={c.label === "ID Pesanan"} />;
          }}
        />
      </div>
    </WAdminShell>
  );
}

function WFTransactions() {
  return (
    <WAdminShell active="Data Transaksi" title="Data Transaksi">
      <div className="wf-col" style={{ gap: 16 }}>
        <Card pad={16} style={{ display: "flex", gap: 14, alignItems: "center", background: "var(--w-fill)" }}>
          <IconBox size={36} />
          <div className="wf-col" style={{ gap: 5, flex: 1 }}><Bar w="70%" h={8} /><Bar w="45%" h={7} /></div>
          <Btn label="Jalankan Apriori" solid />
        </Card>
        <div className="wf-row"><Bar w={140} h={10} dark /><div style={{ flex: 1 }} /><Chip w={90} /></div>
        <WTable
          cols={[{ label: "ID", w: 70 }, { label: "Tanggal", w: 90 }, { label: "Item dalam Transaksi" }, { label: "Channel", w: 70 }, { label: "Total", right: true, w: 70 }]}
          rows={8}
          render={(c, r) => {
            if (c.label === "Item dalam Transaksi") return <div className="wf-row" style={{ gap: 6 }}>{Array.from({ length: 2 + (r % 2) }).map((_, i) => <div key={i} className="wf-chip" style={{ width: 64, justifyContent: "center" }}><Bar w="60%" h={5} /></div>)}</div>;
            if (c.label === "Channel") return <div className="wf-chip" style={{ width: 64, justifyContent: "center" }}><Bar w="60%" h={5} /></div>;
            return <Bar w={c.w || "70%"} h={9} dark={c.label === "ID"} style={{ marginLeft: c.right ? "auto" : 0 }} />;
          }}
        />
        <Note>tabel ini = dataset (sumber data) untuk algoritma Apriori</Note>
      </div>
    </WAdminShell>
  );
}

function WFApriori() {
  return (
    <WAdminShell active="Analisis Apriori" title="Analisis Apriori">
      <div className="wf-col" style={{ gap: 16 }}>
        <Card pad={16} style={{ display: "flex", gap: 14, alignItems: "center", background: "var(--w-fill)" }}>
          <IconBox size={38} />
          <div className="wf-col" style={{ gap: 5, flex: 1 }}><Bar w="60%" h={9} dark /><Bar w="80%" h={7} /></div>
          <Note>rules mengisi widget di toko</Note>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 18, alignItems: "start" }}>
          <div className="wf-col" style={{ gap: 16 }}>
            <Card pad={20}>
              <div className="wf-row" style={{ gap: 10, marginBottom: 18 }}><IconBox size={28} /><Bar w={90} h={10} dark /></div>
              <div className="wf-col" style={{ gap: 20 }}>
                {["Minimum Support", "Minimum Confidence"].map((l, i) => (
                  <div key={i} className="wf-col" style={{ gap: 9 }}>
                    <div className="wf-row"><Bar w={120} h={8} /><div style={{ flex: 1 }} /><Bar w={36} h={11} dark /></div>
                    <div className="wf-bar" style={{ height: 6, position: "relative" }}><div className="wf-bar-dark" style={{ width: (i ? 40 : 25) + "%", height: "100%" }} /><div className="wf-box" style={{ width: 16, height: 16, borderRadius: 999, position: "absolute", top: -5, left: (i ? 40 : 25) + "%" }} /></div>
                    <Bar w="80%" h={6} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 22 }}><Btn label="▶ Jalankan Analisis" solid block h={46} /></div>
            </Card>
            <Card pad={20}><Bar w={70} h={7} style={{ marginBottom: 14 }} />{["Total transaksi", "Frequent itemsets", "Rules dihasilkan"].map((l, i) => <div key={i} className="wf-row" style={{ marginBottom: 10 }}><Bar w={110} h={8} /><div style={{ flex: 1 }} /><Bar w={30} h={11} dark /></div>)}</Card>
          </div>
          <div className="wf-col" style={{ gap: 16 }}>
            <Card pad={0} style={{ overflow: "hidden" }}>
              <div className="wf-row" style={{ padding: "16px 18px 10px" }}><div className="wf-col" style={{ gap: 5 }}><Bar w={150} h={11} dark /><Bar w={210} h={7} /></div><div style={{ flex: 1 }} /><Btn label="PDF" /><Btn label="Excel" /></div>
              <table className="wf-tbl">
                <thead><tr><th>Antecedent → Consequent</th><th style={{ width: 130 }}>Support</th><th style={{ width: 140 }}>Confidence</th><th style={{ width: 60 }}>Lift</th></tr></thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, r) => (
                    <tr key={r}>
                      <td>
                        <div className="wf-row" style={{ gap: 10, flexWrap: "wrap" }}>
                          <div className="wf-chip" style={{ width: 90 }}><div className="wf-box" style={{ width: 18, height: 18, borderRadius: 5 }} /><Bar w="50%" h={6} /></div>
                          <span style={{ color: "var(--w-muted)", fontWeight: 700 }}>→</span>
                          <div className="wf-chip" style={{ width: 90 }}><div className="wf-box" style={{ width: 18, height: 18, borderRadius: 5 }} /><Bar w="50%" h={6} /></div>
                        </div>
                      </td>
                      <td><div className="wf-col" style={{ gap: 5 }}><Bar w={40} h={8} /><div className="wf-bar" style={{ height: 5 }}><div className="wf-bar-dark" style={{ width: (50 - r * 5) + "%", height: "100%" }} /></div></div></td>
                      <td><div className="wf-col" style={{ gap: 5 }}><Bar w={46} h={8} dark /><div className="wf-bar" style={{ height: 5 }}><div className="wf-bar-dark" style={{ width: (90 - r * 8) + "%", height: "100%" }} /></div></div></td>
                      <td><Bar w={36} h={8} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card pad={20}><Bar w={150} h={10} dark style={{ marginBottom: 14 }} /><div className="wf-row" style={{ gap: 10, flexWrap: "wrap" }}>{Array.from({ length: 6 }).map((_, i) => <div key={i} className="wf-soft wf-row" style={{ gap: 8, padding: "7px 11px" }}><div className="wf-box" style={{ width: 18, height: 18, borderRadius: 5 }} /><Bar w={50} h={7} /><Bar w={20} h={7} /></div>)}</div></Card>
          </div>
        </div>
      </div>
    </WAdminShell>
  );
}

Object.assign(window, { WAdminShell, WTable, WFLogin, WFDashboard, WFProducts, WFOrders, WFTransactions, WFApriori });
