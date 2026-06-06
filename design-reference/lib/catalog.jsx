/* ===========================================================
   Kandank Iwak — Katalog Tampilan (1 desain / halaman)
   untuk dimasukkan ke dalam skripsi (Gambar 4.x)
   =========================================================== */

const KI = window.KI;
const noop = () => {};
const RULES = KI.apriori(KI.transactions.map((t) => t.items), 0.1, 0.3, 3).rules;
const recsFor = (pid) => KI.recommendFor(pid, RULES, 3);
const recsForCart = (ids) => KI.recommendForCart(ids, RULES, 3);

/* ---- store screen renderer ---- */
function StoreScreen({ page, params = {}, cart = {} }) {
  let view;
  if (page === "catalog") view = <CatalogPage go={noop} onAdd={noop} />;
  else if (page === "product") view = <ProductDetailPage go={noop} params={params} onAdd={noop} recsFor={recsFor} />;
  else if (page === "cart") view = <CartPage go={noop} cart={cart} setQty={noop} removeItem={noop} onAdd={noop} recsForCart={recsForCart} />;
  else if (page === "checkout") view = <CheckoutPage go={noop} cart={cart} placeOrder={noop} />;
  else view = <HomePage go={noop} onAdd={noop} />;
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <div>
      <StoreHeader embedded go={noop} page={page} cartCount={count} onCartClick={noop} />
      {view}
      <StoreFooter go={noop} />
    </div>
  );
}

/* ---- admin screen renderer ---- */
function AdminScreen({ page }) {
  let view;
  if (page === "products") view = <ManageProducts toast={noop} />;
  else if (page === "orders") view = <ManageOrders toast={noop} />;
  else if (page === "transactions") view = <TransactionsData go={noop} />;
  else if (page === "apriori") view = <AprioriPage rules={RULES} setRules={noop} lastRun="5 Jun 2026, 09.10" setLastRun={noop} params={{ support: 0.1, confidence: 0.3 }} setParams={noop} toast={noop} go={noop} />;
  else view = <Dashboard go={noop} />;
  return <AdminShell embedded page={page} go={noop} onExit={noop} lastRun="5 Jun 2026, 09.10">{view}</AdminShell>;
}

/* ---- screen registry ---- */
const SCREENS = [
  { num: "4.1", title: "Halaman Beranda", group: "Sisi Pelanggan (Storefront)",
    desc: "Halaman utama toko: hero produk unggulan, kategori, daftar produk, dan keunggulan layanan.",
    render: () => <StoreScreen page="home" /> },
  { num: "4.2", title: "Halaman Katalog Produk", group: "Sisi Pelanggan (Storefront)",
    desc: "Daftar seluruh produk dengan filter kategori, filter harga, dan pengurutan.",
    render: () => <StoreScreen page="catalog" /> },
  { num: "4.3", title: "Halaman Detail Produk", group: "Sisi Pelanggan (Storefront)",
    desc: "Rincian produk, pemilihan jumlah, dan widget “Sering Dibeli Bersama” hasil analisis Apriori.",
    render: () => <StoreScreen page="product" params={{ id: "nila" }} /> },
  { num: "4.4", title: "Halaman Keranjang Belanja", group: "Sisi Pelanggan (Storefront)",
    desc: "Ringkasan item, pengaturan jumlah, rekomendasi Apriori, dan total belanja.",
    render: () => <StoreScreen page="cart" cart={{ nila: 1, bumbu: 2, fillet: 1 }} /> },
  { num: "4.5", title: "Halaman Checkout", group: "Sisi Pelanggan (Storefront)",
    desc: "Pengisian data pengiriman, pemilihan metode pembayaran, dan konfirmasi pesanan.",
    render: () => <StoreScreen page="checkout" cart={{ nila: 1, bumbu: 2 }} /> },
  { num: "4.6", title: "Halaman Login Admin", group: "Sisi Admin (Pemilik)",
    desc: "Halaman masuk untuk pemilik toko sebelum mengakses panel pengelolaan.",
    render: () => <AdminLogin embedded onLogin={noop} onExit={noop} /> },
  { num: "4.7", title: "Dashboard Admin", group: "Sisi Admin (Pemilik)",
    desc: "Ringkasan penjualan, jumlah transaksi, grafik mingguan, produk terlaris, dan pesanan terbaru.",
    render: () => <AdminScreen page="dashboard" /> },
  { num: "4.8", title: "Halaman Kelola Produk", group: "Sisi Admin (Pemilik)",
    desc: "Tabel produk dengan aksi tambah, ubah stok, edit, dan hapus produk.",
    render: () => <AdminScreen page="products" /> },
  { num: "4.9", title: "Halaman Kelola Pesanan", group: "Sisi Admin (Pemilik)",
    desc: "Daftar pesanan masuk dengan filter status dan pembaruan status pesanan.",
    render: () => <AdminScreen page="orders" /> },
  { num: "4.10", title: "Halaman Data Transaksi", group: "Sisi Admin (Pemilik)",
    desc: "Riwayat transaksi sebagai sumber data (dataset) untuk proses analisis Apriori.",
    render: () => <AdminScreen page="transactions" /> },
  { num: "4.11", title: "Halaman Analisis Apriori", group: "Sisi Admin (Pemilik)",
    desc: "Pengaturan minimum support & confidence, hasil association rules, dan frequent itemsets.",
    render: () => <AdminScreen page="apriori" /> },
];

/* ---- figure frame ---- */
function Figure({ num, title, desc, children }) {
  return (
    <section id={"g-" + num} className="ki-fig">
      <div className="ki-fig-cap">
        <span className="ki-fig-tag">Gambar {num}</span>
        <div className="col" style={{ gap: 3 }}>
          <h3 style={{ fontSize: 19 }}>{title}</h3>
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted)", fontWeight: 500, lineHeight: 1.5, maxWidth: 820 }}>{desc}</p>
        </div>
      </div>
      <div className="ki-frame">
        <div className="ki-frame-bar">
          <span style={{ width: 11, height: 11, borderRadius: 99, background: "#ff5f57" }} />
          <span style={{ width: 11, height: 11, borderRadius: 99, background: "#febc2e" }} />
          <span style={{ width: 11, height: 11, borderRadius: 99, background: "#28c840" }} />
          <span className="ki-frame-url">kandankiwak.id</span>
        </div>
        <div className="ki-frame-body">{children}</div>
      </div>
      <div className="ki-fig-foot">Gambar {num} — {title}</div>
    </section>
  );
}

function Catalog() {
  const groups = [...new Set(SCREENS.map((s) => s.group))];
  return (
    <div>
      {/* cover */}
      <header className="ki-cat-head">
        <div className="wrap" style={{ padding: "30px 28px", display: "flex", alignItems: "center", gap: 18 }}>
          <Logo height={46} mono />
          <div style={{ width: 1, height: 42, background: "rgba(255,255,255,.2)" }} />
          <div className="col" style={{ gap: 3 }}>
            <h1 style={{ color: "#fff", fontSize: 23 }}>Katalog Tampilan Antarmuka Sistem</h1>
            <span style={{ color: "#bcc0e4", fontSize: 13.5, fontWeight: 600 }}>E-Commerce Kandank Iwak dengan Rekomendasi Algoritma Apriori</span>
          </div>
          <div className="spacer" />
          <button className="btn btn-sky" onClick={() => window.print()}><Icon name="download" size={17} /> Cetak / Simpan PDF</button>
        </div>
      </header>

      {/* TOC */}
      <div className="wrap ki-toc-wrap">
        <div className="ki-toc">
          <span className="ki-toc-title">Daftar Tampilan</span>
          {groups.map((g) => (
            <div key={g} className="col" style={{ gap: 2, marginTop: 8 }}>
              <span className="ki-toc-group">{g}</span>
              {SCREENS.filter((s) => s.group === g).map((s) => (
                <a key={s.num} href={"#g-" + s.num} className="ki-toc-item"><span className="num" style={{ color: "var(--sky-600)", fontWeight: 800, minWidth: 34 }}>{s.num}</span> {s.title}</a>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* figures */}
      <main className="wrap ki-figs">
        {groups.map((g) => (
          <React.Fragment key={g}>
            <div className="ki-group-head"><span className="dot" style={{ background: "var(--sky)" }} /> {g}</div>
            {SCREENS.filter((s) => s.group === g).map((s) => (
              <Figure key={s.num} num={s.num} title={s.title} desc={s.desc}>{s.render()}</Figure>
            ))}
          </React.Fragment>
        ))}
      </main>

      <footer style={{ textAlign: "center", padding: "30px", color: "var(--muted)", fontSize: 12.5 }}>
        © 2026 Kandank Iwak · Katalog tampilan untuk dokumentasi skripsi
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Catalog />);
