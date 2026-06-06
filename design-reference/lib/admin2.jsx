/* ===========================================================
   Kandank Iwak — Admin 2: products, orders, transactions, Apriori
   =========================================================== */

/* ---------------- Manage products ---------------- */
function ManageProducts({ toast }) {
  const KI = window.KI;
  const [list, setList] = useState(KI.products.map((p) => ({ ...p })));
  const [modal, setModal] = useState(null); // 'add' | product
  const [draft, setDraft] = useState({ name: "", category: "Ikan Segar", price: "", stock: "", unit: "per kg" });

  const openAdd = () => { setDraft({ name: "", category: "Ikan Segar", price: "", stock: "", unit: "per kg" }); setModal("add"); };
  const save = () => {
    if (!draft.name || !draft.price) return;
    setList([{ id: "new" + Date.now(), illo: "whole", tint: "sky", tags: [], desc: "", ...draft, price: +draft.price, stock: +draft.stock || 0 }, ...list]);
    setModal(null); toast("Produk ditambahkan");
  };
  const del = (id) => { setList(list.filter((p) => p.id !== id)); toast("Produk dihapus"); };
  const bump = (id, d) => setList(list.map((p) => p.id === id ? { ...p, stock: Math.max(0, p.stock + d) } : p));

  return (
    <div className="col gap-18 kiup">
      <div className="row">
        <div className="col" style={{ gap: 2 }}><span className="mut" style={{ fontSize: 13, fontWeight: 600 }}>{list.length} produk terdaftar</span></div>
        <div className="spacer" />
        <button className="btn btn-outline btn-sm"><Icon name="download" size={16} /> Ekspor</button>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Icon name="plus" size={16} stroke={2.5} /> Tambah Produk</button>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <table className="tbl">
          <thead><tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Status</th><th style={{ textAlign: "right" }}>Aksi</th></tr></thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="row gap-12">
                    <div className={`illo illo-${p.tint}`} style={{ width: 46, height: 40, aspectRatio: "auto", flex: "0 0 auto" }}><Illo type={p.illo} size={42} /></div>
                    <div className="col" style={{ gap: 1 }}><span style={{ fontWeight: 700, color: "var(--ink)" }}>{p.name}</span><span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{p.unit}</span></div>
                  </div>
                </td>
                <td><span className="chip chip-ink">{p.category}</span></td>
                <td className="num" style={{ fontWeight: 700, color: "var(--navy)" }}>{money(p.price)}</td>
                <td>
                  <div className="row gap-6">
                    <button onClick={() => bump(p.id, -1)} style={{ width: 26, height: 26, borderRadius: 8, background: "var(--bg)", color: "var(--navy)", display: "grid", placeItems: "center" }}><Icon name="minus" size={14} /></button>
                    <span className="num" style={{ minWidth: 30, textAlign: "center", fontWeight: 700, color: "var(--ink)" }}>{p.stock}</span>
                    <button onClick={() => bump(p.id, 1)} style={{ width: 26, height: 26, borderRadius: 8, background: "var(--sky-50)", color: "var(--sky-600)", display: "grid", placeItems: "center" }}><Icon name="plus" size={14} /></button>
                  </div>
                </td>
                <td><StockPill stock={p.stock} /></td>
                <td>
                  <div className="row gap-6" style={{ justifyContent: "flex-end" }}>
                    <button className="row" onClick={() => toast("Mode edit (demo)")} style={{ width: 32, height: 32, borderRadius: 9, background: "var(--bg)", color: "var(--navy)", justifyContent: "center" }}><Icon name="edit" size={16} /></button>
                    <button className="row" onClick={() => del(p.id)} style={{ width: 32, height: 32, borderRadius: 9, background: "var(--red-50)", color: "var(--red)", justifyContent: "center" }}><Icon name="trash" size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(28,26,77,.4)", backdropFilter: "blur(3px)", display: "grid", placeItems: "center", zIndex: 100 }}>
          <div className="card kiup" onClick={(e) => e.stopPropagation()} style={{ width: 460, padding: 26, boxShadow: "var(--shadow-lg)" }}>
            <div className="row" style={{ marginBottom: 18 }}><h3 style={{ fontSize: 20 }}>Tambah Produk Baru</h3><div className="spacer" /><button onClick={() => setModal(null)} style={{ color: "var(--muted)" }}><Icon name="x" size={20} /></button></div>
            <div className="col gap-14">
              <div className="field"><label>Nama Produk</label><input className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="cth. Nila Bakar Frozen" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field"><label>Kategori</label><select className="select" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{["Ikan Segar", "Olahan", "Budidaya", "Bumbu", "Paket"].map((c) => <option key={c}>{c}</option>)}</select></div>
                <div className="field"><label>Satuan</label><input className="input" value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} /></div>
                <div className="field"><label>Harga (Rp)</label><input className="input num" type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="35000" /></div>
                <div className="field"><label>Stok</label><input className="input num" type="number" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} placeholder="50" /></div>
              </div>
            </div>
            <div className="row gap-12" style={{ marginTop: 22 }}><button className="btn btn-ghost btn-block" onClick={() => setModal(null)}>Batal</button><button className="btn btn-primary btn-block" onClick={save}>Simpan Produk</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Manage orders ---------------- */
function ManageOrders({ toast }) {
  const KI = window.KI;
  const [orders, setOrders] = useState(KI.orderSeed.map((o) => ({ ...o })));
  const [filter, setFilter] = useState("semua");
  const flow = ["baru", "diproses", "selesai"];
  const advance = (id) => setOrders(orders.map((o) => o.id === id ? { ...o, status: flow[Math.min(flow.indexOf(o.status) + 1, 2)] } : o));
  const counts = { semua: orders.length, baru: orders.filter((o) => o.status === "baru").length, diproses: orders.filter((o) => o.status === "diproses").length, selesai: orders.filter((o) => o.status === "selesai").length };
  const shown = filter === "semua" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="col gap-18 kiup">
      <div className="row gap-8">
        {[["semua", "Semua"], ["baru", "Baru"], ["diproses", "Diproses"], ["selesai", "Selesai"]].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} className="row gap-8" style={{ padding: "9px 16px", borderRadius: 999, fontWeight: 700, fontSize: 13.5, background: filter === id ? "var(--navy)" : "#fff", color: filter === id ? "#fff" : "var(--body)", boxShadow: filter === id ? "var(--shadow)" : "inset 0 0 0 1px var(--line)" }}>
            {label} <span className="num" style={{ opacity: .7 }}>{counts[id]}</span>
          </button>
        ))}
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <table className="tbl">
          <thead><tr><th>ID Pesanan</th><th>Pelanggan</th><th>Item</th><th>Total</th><th>Tanggal</th><th>Status</th><th style={{ textAlign: "right" }}>Aksi</th></tr></thead>
          <tbody>
            {shown.map((o) => (
              <tr key={o.id}>
                <td><span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>{o.id}</span></td>
                <td style={{ fontWeight: 600, color: "var(--ink)" }}>{o.name}</td>
                <td><div className="row gap-4" style={{ flexWrap: "wrap" }}>{o.items.map((id, i) => <span key={i} className="chip chip-ink" style={{ padding: "3px 9px", fontSize: 11.5 }}>{KI.productMap[id]?.name.split(" ")[0] || id}</span>)}</div></td>
                <td className="num" style={{ fontWeight: 700, color: "var(--navy)" }}>{money(o.total)}</td>
                <td className="mut" style={{ fontSize: 13 }}>{o.date}</td>
                <td><OrderStatusBadge status={o.status} /></td>
                <td>
                  <div className="row" style={{ justifyContent: "flex-end" }}>
                    {o.status !== "selesai"
                      ? <button className="btn btn-ghost btn-sm" onClick={() => { advance(o.id); toast("Status diperbarui"); }}>{o.status === "baru" ? "Proses" : "Selesaikan"} <Icon name="arrowR" size={14} /></button>
                      : <span className="row gap-4" style={{ color: "var(--green)", fontSize: 13, fontWeight: 700 }}><Icon name="check" size={15} stroke={2.5} /> Selesai</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Transactions data ---------------- */
function TransactionsData({ go }) {
  const KI = window.KI;
  const fmt = (d) => d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="col gap-18 kiup">
      <div className="card" style={{ padding: "16px 20px", display: "flex", gap: 14, alignItems: "center", background: "var(--sky-50)", border: "1px solid var(--sky-100)" }}>
        <span style={{ width: 38, height: 38, borderRadius: 11, background: "#fff", color: "var(--sky-600)", display: "grid", placeItems: "center", flex: "0 0 auto" }}><Icon name="info" size={20} /></span>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--body)", fontWeight: 600 }}>Tabel ini adalah <b style={{ color: "var(--navy)" }}>sumber data</b> untuk analisis Apriori. Setiap baris berisi item yang dibeli bersama dalam satu transaksi.</p>
        <div className="spacer" />
        <button className="btn btn-sky btn-sm" onClick={() => go("apriori")} style={{ flex: "0 0 auto" }}><Icon name="spark" size={15} /> Jalankan Apriori</button>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="row" style={{ padding: "16px 22px 8px" }}><h3 style={{ fontSize: 17 }}>Riwayat Transaksi</h3><div className="spacer" /><span className="chip">{KI.transactions.length} transaksi</span></div>
        <div style={{ maxHeight: 520, overflow: "auto" }}>
          <table className="tbl">
            <thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1 }}><tr><th>ID</th><th>Tanggal</th><th>Item dalam transaksi</th><th>Channel</th><th style={{ textAlign: "right" }}>Total</th></tr></thead>
            <tbody>
              {KI.transactions.map((t) => (
                <tr key={t.id}>
                  <td><span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>{t.id}</span></td>
                  <td className="mut" style={{ fontSize: 13, whiteSpace: "nowrap" }}>{fmt(t.date)}</td>
                  <td><div className="row gap-6" style={{ flexWrap: "wrap" }}>{t.items.map((id, i) => <span key={i} className="chip" style={{ padding: "4px 10px", fontSize: 12 }}>{KI.productMap[id]?.name || id}</span>)}</div></td>
                  <td><span className="chip chip-ink" style={{ fontSize: 11.5 }}>{t.channel}</span></td>
                  <td className="num" style={{ fontWeight: 700, color: "var(--navy)", textAlign: "right" }}>{money(t.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ManageProducts, ManageOrders, TransactionsData });
