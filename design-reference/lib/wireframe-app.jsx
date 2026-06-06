/* ===========================================================
   Kandank Iwak — Wireframe catalog root
   =========================================================== */
const WF_SCREENS = [
  { num: "1", title: "Halaman Beranda", group: "Sisi Pelanggan (Storefront)", render: () => <WFHome /> },
  { num: "2", title: "Halaman Katalog Produk", group: "Sisi Pelanggan (Storefront)", render: () => <WFCatalog /> },
  { num: "3", title: "Halaman Detail Produk", group: "Sisi Pelanggan (Storefront)", render: () => <WFProduct /> },
  { num: "4", title: "Halaman Keranjang Belanja", group: "Sisi Pelanggan (Storefront)", render: () => <WFCart /> },
  { num: "5", title: "Halaman Checkout", group: "Sisi Pelanggan (Storefront)", render: () => <WFCheckout /> },
  { num: "6", title: "Halaman Login Admin", group: "Sisi Admin (Pemilik)", render: () => <WFLogin /> },
  { num: "7", title: "Dashboard Admin", group: "Sisi Admin (Pemilik)", render: () => <WFDashboard /> },
  { num: "8", title: "Halaman Kelola Produk", group: "Sisi Admin (Pemilik)", render: () => <WFProducts /> },
  { num: "9", title: "Halaman Kelola Pesanan", group: "Sisi Admin (Pemilik)", render: () => <WFOrders /> },
  { num: "10", title: "Halaman Data Transaksi", group: "Sisi Admin (Pemilik)", render: () => <WFTransactions /> },
  { num: "11", title: "Halaman Analisis Apriori", group: "Sisi Admin (Pemilik)", render: () => <WFApriori /> },
];

function WFFigure({ num, title, children }) {
  return (
    <section id={"wf-" + num} className="wf-fig">
      <div className="wf-fig-cap">
        <span className="wf-fig-num">Wireframe {num}</span>
        <h3 style={{ fontSize: 17 }}>{title}</h3>
      </div>
      <div className="wf-frame">
        <div className="wf-frame-bar"><i /><i /><i /><span className="wf-frame-url">wireframe — {title.toLowerCase()}</span></div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function WFCatalogApp() {
  const groups = [...new Set(WF_SCREENS.map((s) => s.group))];
  return (
    <div>
      <header className="wf-head">
        <div className="wf-wrap wf-row" style={{ padding: "20px 28px", gap: 16 }}>
          <div className="wf-box" style={{ padding: "8px 14px", fontWeight: 700, fontSize: 13 }}>LOGO</div>
          <div style={{ width: 1.5, height: 36, background: "var(--w-line)" }} />
          <div className="wf-col" style={{ gap: 3 }}>
            <h1 style={{ fontSize: 20 }}>Wireframe / Low-Fidelity Mockup</h1>
            <span className="wf-mono" style={{ fontSize: 13, color: "var(--w-muted)" }}>Rancangan struktur antarmuka — E-Commerce Kandank Iwak (Apriori)</span>
          </div>
          <div style={{ flex: 1 }} />
          <div className="wf-btn solid" onClick={() => window.print()} style={{ cursor: "pointer" }}>Cetak / Simpan PDF</div>
        </div>
      </header>

      <div className="wf-toc">
        <span style={{ fontWeight: 700, fontSize: 14 }}>Daftar Wireframe</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 30px", marginTop: 10 }}>
          {groups.map((g) => (
            <div key={g} className="wf-col" style={{ gap: 2 }}>
              <span className="wf-mono" style={{ fontSize: 11.5, color: "var(--w-muted)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>{g}</span>
              {WF_SCREENS.filter((s) => s.group === g).map((s) => <a key={s.num} href={"#wf-" + s.num}><b style={{ minWidth: 22 }}>{s.num}.</b> {s.title}</a>)}
            </div>
          ))}
        </div>
      </div>

      <main className="wf-figs">
        {groups.map((g) => (
          <React.Fragment key={g}>
            <div className="wf-group">{g}</div>
            {WF_SCREENS.filter((s) => s.group === g).map((s) => <WFFigure key={s.num} num={s.num} title={s.title}>{s.render()}</WFFigure>)}
          </React.Fragment>
        ))}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WFCatalogApp />);
