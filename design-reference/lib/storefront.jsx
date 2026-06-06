/* ===========================================================
   Kandank Iwak — Storefront (customer side)
   =========================================================== */

/* ---------------- Product card ---------------- */
function ProductCard({ product, onAdd, onOpen, compact }) {
  return (
    <div className="card kiup" style={{ overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer" }}
      onClick={() => onOpen && onOpen(product)}>
      <div style={{ padding: compact ? 12 : 16, paddingBottom: 0 }}>
        <div className={`illo illo-${product.tint}`} style={{ position: "relative" }}>
          <Illo type={product.illo} size={compact ? 124 : 158} />
          <div style={{ position: "absolute", top: 10, left: 10 }}><StockPill stock={product.stock} /></div>
        </div>
      </div>
      <div style={{ padding: compact ? "12px 14px 16px" : "14px 18px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <span className="chip" style={{ alignSelf: "flex-start" }}>{product.category}</span>
        <h4 style={{ fontSize: compact ? 15.5 : 17, lineHeight: 1.2 }}>{product.name}</h4>
        <div className="row gap-6" style={{ marginTop: "auto", paddingTop: 6 }}>
          <div className="col" style={{ gap: 0 }}>
            <span className="num" style={{ fontSize: compact ? 17 : 19, fontWeight: 800, color: "var(--navy)" }}>{money(product.price)}</span>
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{product.unit}</span>
          </div>
          <div className="spacer" />
          <button className="btn btn-sky btn-sm" onClick={(e) => { e.stopPropagation(); onAdd(product); }}>
            <Icon name="plus" size={16} stroke={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- "Sering Dibeli Bersama" widget (Apriori-powered) ---------------- */
function BoughtTogether({ recs, onAdd, onOpen, variant = "panel" }) {
  if (!recs || recs.length === 0) return null;
  return (
    <section className="card kiup" style={{
      overflow: "hidden",
      boxShadow: "var(--shadow)",
      border: "1.5px solid var(--sky-100)",
    }}>
      <div style={{
        padding: "16px 22px", display: "flex", alignItems: "center", gap: 12,
        background: "linear-gradient(100deg, var(--sky-50), #fff)",
        borderBottom: "1px solid var(--line-soft)",
      }}>
        <span style={{ width: 38, height: 38, borderRadius: 12, background: "var(--sky)", color: "#fff", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sky)" }}>
          <Icon name="spark" size={21} />
        </span>
        <div className="col" style={{ gap: 1 }}>
          <h3 style={{ fontSize: 18 }}>Sering Dibeli Bersama</h3>
          <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>
            Rekomendasi cerdas dari pola belanja pelanggan Kandank Iwak
          </span>
        </div>
      </div>
      <div style={{ padding: 18, display: "grid", gap: 14, gridTemplateColumns: `repeat(${Math.min(recs.length, 3)}, 1fr)` }}>
        {recs.map(({ product, confidence }) => (
          <div key={product.id} className="row gap-12" style={{
            background: "var(--bg)", borderRadius: "var(--r)", padding: 12, alignItems: "center",
          }}>
            <div className={`illo illo-${product.tint}`} style={{ width: 70, height: 60, aspectRatio: "auto", flex: "0 0 auto", borderRadius: 12 }}>
              <Illo type={product.illo} size={64} />
            </div>
            <div className="col" style={{ gap: 3, flex: 1, minWidth: 0 }}>
              <span className="badge badge-navy" style={{ alignSelf: "flex-start" }}>
                {Math.round(confidence * 100)}% cocok
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                onClick={() => onOpen && onOpen(product)} >{product.name}</span>
              <span className="num" style={{ fontSize: 14.5, fontWeight: 800, color: "var(--navy)" }}>{money(product.price)}</span>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ flex: "0 0 auto" }} onClick={() => onAdd(product)}>
              <Icon name="plus" size={15} stroke={2.5} /> Tambah
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Store header ---------------- */
function StoreHeader({ go, page, cartCount, onCartClick, embedded }) {
  const links = [
    { id: "home", label: "Beranda" },
    { id: "catalog", label: "Katalog" },
    { id: "about", label: "Tentang" },
  ];
  return (
    <header style={{ position: embedded ? "relative" : "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)" }}>
      <div className="wrap row" style={{ height: 72, gap: 16 }}>
        <div className="row gap-8" style={{ cursor: "pointer" }} onClick={() => go("home")}>
          <Logo height={38} />
        </div>
        <nav className="row gap-4" style={{ marginLeft: 18 }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id === "about" ? "home" : l.id)}
              style={{
                padding: "9px 15px", borderRadius: 999, fontWeight: 700, fontSize: 14.5,
                color: page === l.id ? "var(--navy)" : "var(--body)",
                background: page === l.id ? "var(--sky-50)" : "transparent",
              }}>{l.label}</button>
          ))}
        </nav>
        <div className="spacer" />
        <div className="row gap-8" style={{ background: "var(--bg)", borderRadius: 999, padding: "9px 14px", width: 230, color: "var(--muted)" }}>
          <Icon name="search" size={18} />
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>Cari ikan, bumbu…</span>
        </div>
        <button className="row" onClick={onCartClick} style={{ position: "relative", width: 46, height: 46, borderRadius: 999, background: "var(--navy)", color: "#fff", justifyContent: "center" }}>
          <Icon name="cart" size={21} />
          {cartCount > 0 && (
            <span className="num" style={{ position: "absolute", top: -3, right: -3, minWidth: 20, height: 20, padding: "0 5px", borderRadius: 999, background: "var(--sky)", color: "#fff", fontSize: 11.5, fontWeight: 800, display: "grid", placeItems: "center", boxShadow: "0 0 0 3px #fff" }}>{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}

/* ---------------- Store footer ---------------- */
function StoreFooter({ go }) {
  return (
    <footer style={{ marginTop: 40, background: "var(--navy-900)", color: "#cfd2ec" }}>
      <Wave color="var(--navy-900)" height={50} />
      <div className="wrap" style={{ padding: "10px 28px 44px", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1.4fr", gap: 32 }}>
        <div className="col gap-12">
          <Logo height={40} mono />
          <p style={{ fontSize: 13.5, lineHeight: 1.6, maxWidth: 280, color: "#a9adcf", margin: 0 }}>
            Budidaya & penjualan ikan nila segar langsung dari kolam. Segar, sehat, dan terpercaya untuk dapur Anda.
          </p>
        </div>
        <div className="col gap-10">
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 13.5 }}>Belanja</span>
          {["Ikan Segar", "Olahan", "Bumbu", "Paket Hemat"].map((x) => <a key={x} style={{ fontSize: 13.5, color: "#a9adcf" }}>{x}</a>)}
        </div>
        <div className="col gap-10">
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 13.5 }}>Bantuan</span>
          {["Cara Pesan", "Pengiriman", "Hubungi Kami", "FAQ"].map((x) => <a key={x} style={{ fontSize: 13.5, color: "#a9adcf" }}>{x}</a>)}
        </div>
        <div className="col gap-12">
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 13.5 }}>Pesan langsung</span>
          <button className="btn btn-sky" style={{ alignSelf: "flex-start" }}><Icon name="wa" size={18} /> Chat WhatsApp</button>
          <span style={{ fontSize: 12.5, color: "#8e92b8" }}>Jl. Kolam Asri No. 12, Sukabumi</span>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div className="wrap row" style={{ padding: "16px 28px", fontSize: 12.5, color: "#8e92b8" }}>
          <span>© 2026 Kandank Iwak. Semua hak dilindungi.</span>
          <div className="spacer" />
          <span>Ditenagai analisis Apriori untuk rekomendasi cerdas</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Home page ---------------- */
function HomePage({ go, onAdd }) {
  const KI = window.KI;
  const featured = KI.products.slice(0, 4);
  const cats = [
    { label: "Ikan Segar", illo: "whole", tint: "sky" },
    { label: "Olahan", illo: "fillet", tint: "navy" },
    { label: "Budidaya", illo: "feed", tint: "sky" },
    { label: "Bumbu", illo: "spice", tint: "navy" },
  ];
  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", background: "linear-gradient(150deg, #f4f9ff 0%, #e6f4fc 48%, #d6edfa 100%)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.5, background: "radial-gradient(50% 60% at 85% 10%, rgba(1,162,234,.20), transparent 60%)" }} />
        <div className="wrap" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 30, alignItems: "center", padding: "54px 28px 64px" }}>
          <div className="col gap-20 kiup">
            <span className="chip" style={{ alignSelf: "flex-start", background: "#fff", color: "var(--sky-600)", boxShadow: "var(--shadow-sm)" }}>
              <Icon name="spark" size={15} /> Panen harian dari kolam sendiri
            </span>
            <h1 style={{ fontSize: 52, lineHeight: 1.04 }}>
              Ikan Nila <span style={{ color: "var(--sky)" }}>Segar</span><br />langsung dari Kandank Iwak
            </h1>
            <p style={{ fontSize: 17, color: "var(--body)", maxWidth: 440, margin: 0, lineHeight: 1.6 }}>
              Dari kolam budidaya ke meja makan Anda. Nila segar, fillet praktis, bibit unggul, hingga bumbu pecak racikan sendiri.
            </p>
            <div className="row gap-12">
              <button className="btn btn-primary btn-lg" onClick={() => go("catalog")}>Belanja Sekarang <Icon name="arrowR" size={18} /></button>
              <button className="btn btn-outline btn-lg" onClick={() => go("catalog")}>Lihat Katalog</button>
            </div>
            <div className="row gap-24" style={{ marginTop: 6 }}>
              {[["100%", "Air tawar bersih"], ["6", "Produk pilihan"], ["4.9★", "Rating pelanggan"]].map(([a, b]) => (
                <div key={b} className="col" style={{ gap: 2 }}>
                  <span className="num" style={{ fontSize: 24, fontWeight: 800, color: "var(--navy)" }}>{a}</span>
                  <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="kiup" style={{ position: "relative" }}>
            <div style={{ position: "relative", background: "#fff", borderRadius: "var(--r-xl)", padding: 28, boxShadow: "var(--shadow-lg)" }}>
              <div className="illo illo-sky" style={{ aspectRatio: "1/.82" }}>
                <Illo type="whole" size={300} />
              </div>
              <div className="card" style={{ position: "absolute", bottom: -18, left: -18, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "var(--shadow-lg)" }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, background: "var(--green-50)", color: "var(--green)", display: "grid", placeItems: "center" }}><Icon name="truck" size={19} /></span>
                <div className="col" style={{ gap: 0 }}><span style={{ fontWeight: 800, fontSize: 13.5, color: "var(--ink)" }}>Pengiriman hari ini</span><span style={{ fontSize: 11.5, color: "var(--muted)" }}>Area Sukabumi & sekitar</span></div>
              </div>
              <div className="card" style={{ position: "absolute", top: -16, right: -14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, boxShadow: "var(--shadow-lg)" }}>
                <span className="num" style={{ fontSize: 19, fontWeight: 800, color: "var(--navy)" }}>{money(35000)}</span>
                <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600 }}>/kg</span>
              </div>
            </div>
          </div>
        </div>
        <Wave color="var(--bg)" height={56} />
      </section>

      <div className="wrap" style={{ padding: "10px 28px 0" }}>
        {/* Categories */}
        <div className="row" style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 26 }}>Kategori Produk</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 44 }}>
          {cats.map((c) => (
            <button key={c.label} className="card kiup" onClick={() => go("catalog")} style={{ padding: 16, textAlign: "left", display: "flex", flexDirection: "column", gap: 12, alignItems: "stretch" }}>
              <div className={`illo illo-${c.tint}`} style={{ aspectRatio: "16/10" }}><Illo type={c.illo} size={120} /></div>
              <div className="row"><span style={{ fontWeight: 700, fontSize: 15.5, color: "var(--ink)" }}>{c.label}</span><div className="spacer" /><span style={{ color: "var(--sky)" }}><Icon name="arrowR" size={18} /></span></div>
            </button>
          ))}
        </div>

        {/* Featured */}
        <div className="row" style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 26 }}>Produk Unggulan</h2>
          <div className="spacer" />
          <button className="btn btn-ghost btn-sm" onClick={() => go("catalog")}>Lihat semua <Icon name="arrowR" size={15} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {featured.map((p) => <ProductCard key={p.id} product={p} onAdd={onAdd} onOpen={(pr) => go("product", { id: pr.id })} />)}
        </div>

        {/* Trust band */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, margin: "44px 0 8px" }}>
          {[["truck", "Antar cepat & segar", "Pesanan dikirim di hari yang sama untuk area sekitar."],
            ["check", "Kualitas terjamin", "Dipanen langsung dari kolam, tanpa bau lumpur."],
            ["spark", "Rekomendasi cerdas", "Saran produk dari pola belanja, ditenagai Apriori."]].map(([ic, t, d]) => (
            <div key={t} className="card" style={{ padding: 22, display: "flex", gap: 14 }}>
              <span style={{ width: 44, height: 44, flex: "0 0 auto", borderRadius: 13, background: "var(--sky-50)", color: "var(--sky-600)", display: "grid", placeItems: "center" }}><Icon name={ic} size={23} /></span>
              <div className="col" style={{ gap: 4 }}><span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15.5 }}>{t}</span><span style={{ fontSize: 13.5, color: "var(--body)", lineHeight: 1.5 }}>{d}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Catalog page ---------------- */
function CatalogPage({ go, onAdd }) {
  const KI = window.KI;
  const cats = ["Semua", ...Array.from(new Set(KI.products.map((p) => p.category)))];
  const [cat, setCat] = useState("Semua");
  const [sort, setSort] = useState("rec");
  const [maxPrice, setMaxPrice] = useState(80000);
  let list = KI.products.filter((p) => (cat === "Semua" || p.category === cat) && p.price <= maxPrice);
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <div className="wrap" style={{ padding: "32px 28px 0" }}>
      <div className="col gap-6" style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>Beranda / Katalog</span>
        <h1 style={{ fontSize: 32 }}>Katalog Produk</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "248px 1fr", gap: 26, alignItems: "start" }}>
        {/* Filters */}
        <aside className="card" style={{ padding: 20, position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 22 }}>
          <div className="row gap-8"><Icon name="filter" size={18} style={{ color: "var(--navy)" }} /><span style={{ fontWeight: 800, color: "var(--ink)" }}>Filter</span></div>
          <div className="col gap-10">
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Kategori</span>
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className="row gap-8" style={{ justifyContent: "flex-start", fontSize: 14, fontWeight: 600, color: cat === c ? "var(--navy)" : "var(--body)" }}>
                <span style={{ width: 16, height: 16, borderRadius: 5, border: `2px solid ${cat === c ? "var(--sky)" : "var(--line)"}`, background: cat === c ? "var(--sky)" : "#fff", display: "grid", placeItems: "center" }}>{cat === c && <Icon name="check" size={11} stroke={3} style={{ color: "#fff" }} />}</span>
                {c}
              </button>
            ))}
          </div>
          <div className="col gap-10">
            <div className="row"><span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Harga maksimum</span></div>
            <input type="range" min="8000" max="80000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} style={{ accentColor: "var(--sky)" }} />
            <span className="num" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--navy)" }}>≤ {money(maxPrice)}</span>
          </div>
        </aside>
        {/* Grid */}
        <div>
          <div className="row" style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 600 }}>{list.length} produk</span>
            <div className="spacer" />
            <select className="select" style={{ width: "auto", padding: "9px 14px", fontWeight: 600 }} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="rec">Rekomendasi</option>
              <option value="low">Harga terendah</option>
              <option value="high">Harga tertinggi</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {list.map((p) => <ProductCard key={p.id} product={p} onAdd={onAdd} onOpen={(pr) => go("product", { id: pr.id })} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProductCard, BoughtTogether, StoreHeader, StoreFooter, HomePage, CatalogPage });
