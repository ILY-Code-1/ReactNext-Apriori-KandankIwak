/* ===========================================================
   Kandank Iwak — Storefront pages 2: detail, cart, checkout
   =========================================================== */

/* ---------------- Product detail ---------------- */
function ProductDetailPage({ go, params, onAdd, recsFor }) {
  const KI = window.KI;
  const product = KI.productMap[params.id] || KI.products[0];
  const [qty, setQty] = useState(1);
  const recs = recsFor(product.id);

  return (
    <div className="wrap" style={{ padding: "26px 28px 0" }}>
      <button className="row gap-6" onClick={() => go("catalog")} style={{ fontSize: 13.5, fontWeight: 600, color: "var(--muted)", marginBottom: 18 }}>
        <Icon name="chevL" size={16} /> Kembali ke katalog
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "start" }}>
        {/* gallery */}
        <div className="col gap-14">
          <div className={`illo illo-${product.tint}`} style={{ aspectRatio: "1/.86", boxShadow: "var(--shadow)" }}>
            <Illo type={product.illo} size={320} />
          </div>
          <div className="row gap-12">
            {[product.illo, "fillet", "spice"].slice(0, 3).map((t, i) => (
              <div key={i} className={`illo illo-${i === 0 ? product.tint : i % 2 ? "navy" : "sky"}`} style={{ width: 84, height: 70, aspectRatio: "auto", flex: "0 0 auto", boxShadow: i === 0 ? "inset 0 0 0 2px var(--sky)" : "none", cursor: "pointer" }}>
                <Illo type={t} size={70} />
              </div>
            ))}
          </div>
        </div>

        {/* info */}
        <div className="col gap-16">
          <div className="row gap-8">
            <span className="chip">{product.category}</span>
            <StockPill stock={product.stock} />
          </div>
          <h1 style={{ fontSize: 34 }}>{product.name}</h1>
          <div className="row gap-8">
            <span style={{ color: "var(--amber)" }}>{"★★★★★"}</span>
            <span style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 600 }}>4.9 · 128 terjual</span>
          </div>
          <div className="row gap-8" style={{ alignItems: "baseline" }}>
            <span className="num" style={{ fontSize: 36, fontWeight: 800, color: "var(--navy)" }}>{money(product.price)}</span>
            <span style={{ fontSize: 15, color: "var(--muted)", fontWeight: 600 }}>{product.unit}</span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--body)", margin: 0 }}>{product.desc}</p>
          <div className="row gap-8">
            {product.tags.map((t) => <span key={t} className="chip chip-ink"><Icon name="check" size={13} stroke={3} style={{ color: "var(--green)" }} /> {t}</span>)}
          </div>

          {/* unit selector */}
          <div className="card card-line" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14, boxShadow: "none" }}>
            <div className="row gap-12">
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>Jumlah</span>
              <div className="spacer" />
              <Stepper value={qty} onChange={setQty} max={product.stock} />
            </div>
            <div className="row gap-12" style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 14 }}>
              <span style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 600 }}>Subtotal</span>
              <div className="spacer" />
              <span className="num" style={{ fontSize: 20, fontWeight: 800, color: "var(--navy)" }}>{money(product.price * qty)}</span>
            </div>
          </div>

          <div className="row gap-12">
            <button className="btn btn-sky btn-lg" style={{ flex: 1 }} onClick={() => onAdd(product, qty)}>
              <Icon name="cart" size={19} /> Tambah ke Keranjang
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => { onAdd(product, qty); go("cart"); }}>Beli Sekarang</button>
          </div>
        </div>
      </div>

      {/* Sering Dibeli Bersama — WAJIB di bawah detail produk */}
      <div style={{ marginTop: 40 }}>
        <BoughtTogether recs={recs} onAdd={(p) => onAdd(p)} onOpen={(p) => go("product", { id: p.id })} />
      </div>

      {/* description block */}
      <div className="card" style={{ marginTop: 24, padding: 28 }}>
        <h3 style={{ fontSize: 20, marginBottom: 12 }}>Tentang produk ini</h3>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--body)", margin: 0, maxWidth: 760 }}>
          {product.desc} Semua produk Kandank Iwak berasal dari kolam budidaya yang dikelola dengan sirkulasi air bersih dan
          pakan berkualitas. Kami menjaga kesegaran dari panen hingga pengemasan agar sampai di tangan Anda dalam kondisi terbaik.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Cart page ---------------- */
function CartPage({ go, cart, setQty, removeItem, onAdd, recsForCart }) {
  const KI = window.KI;
  const items = Object.entries(cart).map(([id, q]) => ({ product: KI.productMap[id], qty: q })).filter((x) => x.product);
  const subtotal = items.reduce((s, x) => s + x.product.price * x.qty, 0);
  const shipping = subtotal > 0 ? 12000 : 0;
  const recs = recsForCart(items.map((x) => x.product.id));

  if (items.length === 0) {
    return (
      <div className="wrap" style={{ padding: "60px 28px", display: "grid", placeItems: "center" }}>
        <div className="col" style={{ alignItems: "center", gap: 16, textAlign: "center" }}>
          <span style={{ width: 84, height: 84, borderRadius: 24, background: "var(--sky-50)", color: "var(--sky)", display: "grid", placeItems: "center" }}><Icon name="cart" size={40} /></span>
          <h2 style={{ fontSize: 24 }}>Keranjang masih kosong</h2>
          <p className="mut" style={{ margin: 0 }}>Yuk pilih nila segar dan produk favorit Anda.</p>
          <button className="btn btn-primary btn-lg" onClick={() => go("catalog")}>Mulai Belanja</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ padding: "32px 28px 0" }}>
      <h1 style={{ fontSize: 32, marginBottom: 6 }}>Keranjang Belanja</h1>
      <p className="mut" style={{ marginTop: 0, marginBottom: 24 }}>{items.length} jenis produk di keranjang Anda</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 26, alignItems: "start" }}>
        <div className="col gap-16">
          <div className="card" style={{ overflow: "hidden" }}>
            {items.map((x, i) => (
              <div key={x.product.id} className="row gap-16" style={{ padding: 18, borderTop: i ? "1px solid var(--line-soft)" : "none" }}>
                <div className={`illo illo-${x.product.tint}`} style={{ width: 84, height: 72, aspectRatio: "auto", flex: "0 0 auto" }}><Illo type={x.product.illo} size={76} /></div>
                <div className="col" style={{ gap: 4, flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 16 }}>{x.product.name}</span>
                  <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>{x.product.category} · {x.product.unit}</span>
                  <span className="num" style={{ fontWeight: 800, color: "var(--navy)", fontSize: 15.5 }}>{money(x.product.price)}</span>
                </div>
                <div className="col gap-10" style={{ alignItems: "flex-end" }}>
                  <Stepper value={x.qty} onChange={(v) => setQty(x.product.id, v)} max={x.product.stock} />
                  <button className="row gap-4" onClick={() => removeItem(x.product.id)} style={{ fontSize: 12.5, color: "var(--red)", fontWeight: 600 }}><Icon name="trash" size={14} /> Hapus</button>
                </div>
              </div>
            ))}
          </div>

          {/* Sering Dibeli Bersama — WAJIB juga di keranjang */}
          <BoughtTogether recs={recs} onAdd={(p) => onAdd(p)} onOpen={(p) => go("product", { id: p.id })} />
        </div>

        {/* Summary */}
        <aside className="card" style={{ padding: 22, position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: 19 }}>Ringkasan Belanja</h3>
          <div className="col gap-10">
            <div className="row"><span className="mut" style={{ fontSize: 14 }}>Subtotal</span><div className="spacer" /><span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>{money(subtotal)}</span></div>
            <div className="row"><span className="mut" style={{ fontSize: 14 }}>Ongkos kirim</span><div className="spacer" /><span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>{money(shipping)}</span></div>
            <div className="row" style={{ borderTop: "1px dashed var(--line)", paddingTop: 12 }}>
              <span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 16 }}>Total</span><div className="spacer" />
              <span className="num" style={{ fontWeight: 800, color: "var(--navy)", fontSize: 22 }}>{money(subtotal + shipping)}</span>
            </div>
          </div>
          <button className="btn btn-sky btn-lg btn-block" onClick={() => go("checkout")}>Lanjut ke Checkout <Icon name="arrowR" size={18} /></button>
          <button className="btn btn-ghost btn-block" onClick={() => go("catalog")}>Tambah produk lain</button>
          <div className="row gap-8" style={{ background: "var(--green-50)", borderRadius: 12, padding: "10px 12px", color: "var(--green)" }}>
            <Icon name="truck" size={18} /><span style={{ fontSize: 12.5, fontWeight: 600 }}>Gratis ongkir min. belanja Rp100.000</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Checkout page ---------------- */
function CheckoutPage({ go, cart, placeOrder }) {
  const KI = window.KI;
  const items = Object.entries(cart).map(([id, q]) => ({ product: KI.productMap[id], qty: q })).filter((x) => x.product);
  const subtotal = items.reduce((s, x) => s + x.product.price * x.qty, 0);
  const shipping = subtotal > 0 ? 12000 : 0;
  const [pay, setPay] = useState("transfer");
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [done, setDone] = useState(false);
  const valid = form.name && form.phone && form.address;

  const pays = [
    { id: "transfer", label: "Transfer Bank", sub: "BCA · BRI · Mandiri", icon: "receipt" },
    { id: "cod", label: "Bayar di Tempat (COD)", sub: "Bayar saat pesanan tiba", icon: "truck" },
    { id: "ewallet", label: "E-Wallet", sub: "GoPay · OVO · DANA", icon: "spark" },
  ];

  if (done) {
    return (
      <div className="wrap" style={{ padding: "60px 28px", display: "grid", placeItems: "center" }}>
        <div className="card kiup" style={{ padding: 40, maxWidth: 480, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <span style={{ width: 76, height: 76, borderRadius: 999, background: "var(--green-50)", color: "var(--green)", display: "grid", placeItems: "center" }}><Icon name="check" size={42} stroke={2.5} /></span>
          <h2 style={{ fontSize: 26 }}>Pesanan Diterima!</h2>
          <p className="mut" style={{ margin: 0 }}>Terima kasih, {form.name.split(" ")[0] || "Kak"}. Pesanan Anda sedang kami siapkan. Konfirmasi dikirim via WhatsApp ke {form.phone}.</p>
          <div className="card card-line" style={{ padding: 16, width: "100%", boxShadow: "none", textAlign: "left" }}>
            <div className="row"><span className="mut" style={{ fontSize: 13.5 }}>No. Pesanan</span><div className="spacer" /><span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>ORD-{2052}</span></div>
            <div className="row" style={{ marginTop: 8 }}><span className="mut" style={{ fontSize: 13.5 }}>Total dibayar</span><div className="spacer" /><span className="num" style={{ fontWeight: 800, color: "var(--navy)" }}>{money(subtotal + shipping)}</span></div>
          </div>
          <button className="btn btn-primary btn-lg btn-block" onClick={() => { placeOrder(); go("home"); }}>Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ padding: "32px 28px 0" }}>
      <button className="row gap-6" onClick={() => go("cart")} style={{ fontSize: 13.5, fontWeight: 600, color: "var(--muted)", marginBottom: 14 }}><Icon name="chevL" size={16} /> Kembali ke keranjang</button>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Checkout</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 26, alignItems: "start" }}>
        <div className="col gap-18">
          {/* address */}
          <div className="card" style={{ padding: 24 }}>
            <div className="row gap-10" style={{ marginBottom: 18 }}><span style={{ width: 34, height: 34, borderRadius: 10, background: "var(--sky-50)", color: "var(--sky-600)", display: "grid", placeItems: "center" }}><Icon name="map" size={19} /></span><h3 style={{ fontSize: 18 }}>Data Pengiriman</h3></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field"><label>Nama Lengkap</label><input className="input" placeholder="cth. Budi Santoso" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="field"><label>No. WhatsApp</label><input className="input" placeholder="08xx xxxx xxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="field" style={{ gridColumn: "1/3" }}><label>Alamat Lengkap</label><textarea className="input" rows="3" placeholder="Jalan, RT/RW, kelurahan, kecamatan, kota" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ resize: "vertical" }} /></div>
              <div className="field" style={{ gridColumn: "1/3" }}><label>Catatan (opsional)</label><input className="input" placeholder="cth. Titip ke pos satpam" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
            </div>
          </div>

          {/* payment */}
          <div className="card" style={{ padding: 24 }}>
            <div className="row gap-10" style={{ marginBottom: 18 }}><span style={{ width: 34, height: 34, borderRadius: 10, background: "var(--sky-50)", color: "var(--sky-600)", display: "grid", placeItems: "center" }}><Icon name="receipt" size={19} /></span><h3 style={{ fontSize: 18 }}>Metode Pembayaran</h3></div>
            <div className="col gap-12">
              {pays.map((p) => (
                <button key={p.id} onClick={() => setPay(p.id)} className="row gap-14" style={{ padding: 16, borderRadius: "var(--r)", textAlign: "left", boxShadow: pay === p.id ? "inset 0 0 0 2px var(--sky)" : "inset 0 0 0 1.5px var(--line)", background: pay === p.id ? "var(--sky-50)" : "#fff" }}>
                  <span style={{ width: 40, height: 40, borderRadius: 11, background: pay === p.id ? "var(--sky)" : "var(--bg)", color: pay === p.id ? "#fff" : "var(--navy)", display: "grid", placeItems: "center" }}><Icon name={p.icon} size={20} /></span>
                  <div className="col" style={{ gap: 1 }}><span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 15 }}>{p.label}</span><span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>{p.sub}</span></div>
                  <div className="spacer" />
                  <span style={{ width: 20, height: 20, borderRadius: 999, border: `2px solid ${pay === p.id ? "var(--sky)" : "var(--line)"}`, display: "grid", placeItems: "center" }}>{pay === p.id && <span style={{ width: 10, height: 10, borderRadius: 999, background: "var(--sky)" }} />}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* order summary */}
        <aside className="card" style={{ padding: 22, position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ fontSize: 18 }}>Ringkasan Pesanan</h3>
          <div className="col gap-12" style={{ maxHeight: 230, overflow: "auto" }}>
            {items.map((x) => (
              <div key={x.product.id} className="row gap-10">
                <div className={`illo illo-${x.product.tint}`} style={{ width: 46, height: 40, aspectRatio: "auto", flex: "0 0 auto" }}><Illo type={x.product.illo} size={42} /></div>
                <div className="col" style={{ gap: 0, flex: 1, minWidth: 0 }}><span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.product.name}</span><span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{x.qty} × {money(x.product.price)}</span></div>
                <span className="num" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>{money(x.product.price * x.qty)}</span>
              </div>
            ))}
          </div>
          <div className="col gap-8" style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 12 }}>
            <div className="row"><span className="mut" style={{ fontSize: 13.5 }}>Subtotal</span><div className="spacer" /><span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>{money(subtotal)}</span></div>
            <div className="row"><span className="mut" style={{ fontSize: 13.5 }}>Ongkir</span><div className="spacer" /><span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>{money(shipping)}</span></div>
            <div className="row" style={{ borderTop: "1px dashed var(--line)", paddingTop: 10 }}><span style={{ fontWeight: 800, color: "var(--ink)" }}>Total</span><div className="spacer" /><span className="num" style={{ fontWeight: 800, color: "var(--navy)", fontSize: 21 }}>{money(subtotal + shipping)}</span></div>
          </div>
          <button className="btn btn-sky btn-lg btn-block" disabled={!valid} onClick={() => setDone(true)}>
            {valid ? <>Konfirmasi Pesanan <Icon name="check" size={18} stroke={2.5} /></> : "Lengkapi data dulu"}
          </button>
          <span style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "center" }}>Dengan memesan, Anda menyetujui ketentuan Kandank Iwak.</span>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { ProductDetailPage, CartPage, CheckoutPage });
