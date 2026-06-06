/* ===========================================================
   Kandank Iwak — Wireframe primitives + Store screens
   =========================================================== */
const { useState: wfUseState } = React;

/* ---------- primitives ---------- */
function Bar({ w = "100%", h = 10, dark, style }) {
  return <div className={dark ? "wf-bar-dark" : "wf-bar"} style={{ width: w, height: h, ...style }} />;
}
function Lines({ rows = 3, gap = 8, widths }) {
  const def = ["100%", "92%", "70%"];
  return (
    <div className="wf-col" style={{ gap }}>
      {Array.from({ length: rows }).map((_, i) => <Bar key={i} w={(widths && widths[i]) || def[i % 3]} h={9} />)}
    </div>
  );
}
function Btn({ w, label, solid, h = 38 }) {
  return <div className="wf-btn" style={{ width: w, height: h, borderRadius: 999 }} ><span style={{ opacity: .85 }}>{label}</span></div>;
}
function ImgBox({ h = 150, label = "GAMBAR", r = 8, style }) {
  return (
    <div className="wf-soft" style={{ height: h, borderRadius: r, position: "relative", overflow: "hidden", display: "grid", placeItems: "center", ...style }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, opacity: .4 }}>
        <line x1="0" y1="0" x2="100" y2="100" stroke="var(--w-line)" strokeWidth=".6" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="var(--w-line)" strokeWidth=".6" />
      </svg>
      <span className="wf-mono" style={{ position: "relative", fontSize: 12, color: "var(--w-muted)", letterSpacing: ".05em" }}>{label}</span>
    </div>
  );
}
function IconBox({ size = 36, r = 8 }) { return <div className="wf-ico" style={{ width: size, height: size, borderRadius: r, flex: "0 0 auto" }}><svg width={size * .5} height={size * .5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 12h8" /></svg></div>; }
function Chip({ w = 64 }) { return <div className="wf-chip" style={{ width: w, justifyContent: "center" }}><Bar w="70%" h={7} /></div>; }
function Field({ label, h = 42, full }) {
  return <div className="wf-col" style={{ gap: 6, gridColumn: full ? "1 / -1" : "auto" }}><Bar w="38%" h={8} /><div className="wf-input" style={{ height: h }} /></div>;
}
function Note({ children }) { return <span className="wf-note">{children}</span>; }
function Sect({ title, hint, children, style }) {
  return (
    <div className="wf-col" style={{ gap: 14, ...style }}>
      <div className="wf-row" style={{ gap: 10 }}>
        <h3 style={{ fontSize: 16 }}>{title}</h3>
        {hint && <Note>{hint}</Note>}
      </div>
      {children}
    </div>
  );
}
function Card({ children, pad = 16, style }) { return <div className="wf-box" style={{ padding: pad, ...style }}>{children}</div>; }

/* ---------- shared store header/footer ---------- */
function WStoreHeader({ active = "Beranda" }) {
  return (
    <div className="wf-row" style={{ height: 64, padding: "0 26px", borderBottom: "1.5px solid var(--w-line)", gap: 16, background: "#fff" }}>
      <div className="wf-box" style={{ padding: "7px 14px", fontWeight: 700, fontSize: 13 }}>LOGO</div>
      <div className="wf-row" style={{ gap: 18, marginLeft: 14 }}>
        {["Beranda", "Katalog", "Tentang"].map((l) => <span key={l} style={{ fontSize: 13, fontWeight: active === l ? 700 : 500, color: active === l ? "#000" : "var(--w-muted)", borderBottom: active === l ? "2px solid var(--w-ink)" : "none", paddingBottom: 2 }}>{l}</span>)}
      </div>
      <div style={{ flex: 1 }} />
      <div className="wf-input wf-row" style={{ width: 220, height: 38, gap: 8 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg><span style={{ fontSize: 12 }}>Cari…</span></div>
      <IconBox size={42} r={999} />
    </div>
  );
}
function WStoreFooter() {
  return (
    <div style={{ borderTop: "1.5px solid var(--w-line)", background: "var(--w-fill-2)", padding: "26px", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1.2fr", gap: 26 }}>
      <div className="wf-col" style={{ gap: 10 }}><div className="wf-box" style={{ padding: "6px 12px", width: 64, fontWeight: 700, fontSize: 12 }}>LOGO</div><Lines rows={2} widths={["90%", "60%"]} /></div>
      {["Belanja", "Bantuan", "Kontak"].map((t) => <div key={t} className="wf-col" style={{ gap: 9 }}><Bar w="50%" h={8} dark /><Bar w="70%" h={7} /><Bar w="60%" h={7} /><Bar w="65%" h={7} /></div>)}
    </div>
  );
}

/* ---------- product card ---------- */
function WProductCard() {
  return (
    <Card pad={14} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <ImgBox h={120} label="FOTO PRODUK" />
      <Chip w={70} />
      <Bar w="85%" h={11} dark />
      <div className="wf-row" style={{ gap: 8, marginTop: 4 }}>
        <Bar w={64} h={13} dark />
        <div style={{ flex: 1 }} />
        <div className="wf-btn solid" style={{ width: 36, height: 32, padding: 0 }}>+</div>
      </div>
    </Card>
  );
}

/* ---------- Sering Dibeli Bersama (wireframe) ---------- */
function WBoughtTogether() {
  return (
    <div className="wf-box" style={{ overflow: "hidden", borderWidth: 2 }}>
      <div className="wf-row" style={{ gap: 12, padding: "14px 18px", borderBottom: "1.5px dashed var(--w-line)", background: "var(--w-fill-2)" }}>
        <IconBox size={34} />
        <div className="wf-col" style={{ gap: 4 }}><Bar w={200} h={11} dark /><Bar w={150} h={7} /></div>
        <div style={{ flex: 1 }} />
        <Note>widget rekomendasi (hasil Apriori)</Note>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, padding: 16 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="wf-soft wf-row" style={{ gap: 10, padding: 10 }}>
            <ImgBox h={48} label="" style={{ width: 60, flex: "0 0 auto" }} />
            <div className="wf-col" style={{ gap: 5, flex: 1 }}><Chip w={56} /><Bar w="80%" h={8} /><Bar w={48} h={10} dark /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ STORE SCREENS ============ */
function WFHome() {
  return (
    <div>
      <WStoreHeader active="Beranda" />
      {/* hero */}
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 28, padding: "40px 30px", background: "var(--w-fill-2)", alignItems: "center" }}>
        <div className="wf-col" style={{ gap: 18 }}>
          <div className="wf-tag" style={{ alignSelf: "flex-start" }}>BADGE / TAGLINE</div>
          <div className="wf-col" style={{ gap: 10 }}><Bar w="95%" h={24} dark /><Bar w="78%" h={24} dark /></div>
          <Lines rows={2} widths={["88%", "64%"]} />
          <div className="wf-row" style={{ gap: 12 }}><Btn w={160} label="Belanja Sekarang" solid /><Btn w={130} label="Lihat Katalog" /></div>
          <div className="wf-row" style={{ gap: 30, marginTop: 6 }}>{[0, 1, 2].map((i) => <div key={i} className="wf-col" style={{ gap: 5 }}><Bar w={46} h={16} dark /><Bar w={70} h={7} /></div>)}</div>
        </div>
        <ImgBox h={300} label="FOTO IKAN (HERO)" r={14} />
      </div>
      <div style={{ padding: "30px" }}>
        <Sect title="Kategori Produk" style={{ marginBottom: 30 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>{[0, 1, 2, 3].map((i) => <Card key={i} pad={14} style={{ display: "flex", flexDirection: "column", gap: 10 }}><ImgBox h={84} label="" /><Bar w="60%" h={10} dark /></Card>)}</div>
        </Sect>
        <Sect title="Produk Unggulan" hint="grid kartu produk">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>{[0, 1, 2, 3].map((i) => <WProductCard key={i} />)}</div>
        </Sect>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 30 }}>{[0, 1, 2].map((i) => <Card key={i} style={{ display: "flex", gap: 12 }}><IconBox size={42} /><div className="wf-col" style={{ gap: 6, flex: 1 }}><Bar w="70%" h={10} dark /><Lines rows={2} widths={["100%", "80%"]} /></div></Card>)}</div>
      </div>
      <WStoreFooter />
    </div>
  );
}

function WFCatalog() {
  return (
    <div>
      <WStoreHeader active="Katalog" />
      <div style={{ padding: "26px 30px" }}>
        <Bar w={140} h={8} style={{ marginBottom: 10 }} />
        <Bar w={240} h={20} dark style={{ marginBottom: 22 }} />
        <div style={{ display: "grid", gridTemplateColumns: "248px 1fr", gap: 24, alignItems: "start" }}>
          <Card pad={18} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="wf-row" style={{ gap: 8 }}><IconBox size={24} /><Bar w={60} h={9} dark /></div>
            <div className="wf-col" style={{ gap: 11 }}><Bar w="50%" h={8} dark />{[0, 1, 2, 3, 4].map((i) => <div key={i} className="wf-row" style={{ gap: 9 }}><div className="wf-box" style={{ width: 15, height: 15, borderRadius: 4 }} /><Bar w={i % 2 ? "60%" : "75%"} h={8} /></div>)}</div>
            <div className="wf-col" style={{ gap: 10 }}><Bar w="65%" h={8} dark /><div className="wf-bar" style={{ height: 6 }} /><Bar w="40%" h={7} /></div>
          </Card>
          <div>
            <div className="wf-row" style={{ marginBottom: 14 }}><Bar w={70} h={8} /><div style={{ flex: 1 }} /><div className="wf-input" style={{ width: 150, height: 36 }} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>{[0, 1, 2, 3, 4, 5].map((i) => <WProductCard key={i} />)}</div>
          </div>
        </div>
      </div>
      <WStoreFooter />
    </div>
  );
}

function WFProduct() {
  return (
    <div>
      <WStoreHeader active="Katalog" />
      <div style={{ padding: "22px 30px" }}>
        <Bar w={150} h={8} style={{ marginBottom: 18 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
          <div className="wf-col" style={{ gap: 12 }}>
            <ImgBox h={320} label="FOTO PRODUK UTAMA" r={12} />
            <div className="wf-row" style={{ gap: 12 }}>{[0, 1, 2].map((i) => <ImgBox key={i} h={70} label="" style={{ width: 84 }} />)}</div>
          </div>
          <div className="wf-col" style={{ gap: 16 }}>
            <div className="wf-row" style={{ gap: 8 }}><Chip w={80} /><Chip w={64} /></div>
            <Bar w="80%" h={22} dark />
            <Bar w={140} h={9} />
            <Bar w={170} h={26} dark />
            <Lines rows={3} />
            <div className="wf-row" style={{ gap: 8 }}>{[0, 1].map((i) => <Chip key={i} w={90} />)}</div>
            <Card pad={16} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="wf-row"><Bar w={60} h={9} dark /><div style={{ flex: 1 }} /><div className="wf-box" style={{ width: 96, height: 36, borderRadius: 999 }} /></div>
              <div className="wf-row" style={{ borderTop: "1px solid var(--w-fill)", paddingTop: 12 }}><Bar w={60} h={8} /><div style={{ flex: 1 }} /><Bar w={90} h={14} dark /></div>
            </Card>
            <div className="wf-row" style={{ gap: 12 }}><Btn w="60%" label="+ Tambah ke Keranjang" solid h={46} /><Btn w="38%" label="Beli Sekarang" h={46} /></div>
          </div>
        </div>
        <div style={{ marginTop: 34 }}><WBoughtTogether /></div>
        <Card pad={24} style={{ marginTop: 22 }}><Bar w={200} h={13} dark style={{ marginBottom: 14 }} /><Lines rows={3} /></Card>
      </div>
      <WStoreFooter />
    </div>
  );
}

function WFCart() {
  return (
    <div>
      <WStoreHeader active="Katalog" />
      <div style={{ padding: "26px 30px" }}>
        <Bar w={240} h={20} dark style={{ marginBottom: 6 }} />
        <Bar w={160} h={8} style={{ marginBottom: 22 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>
          <div className="wf-col" style={{ gap: 16 }}>
            <Card pad={0} style={{ overflow: "hidden" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="wf-row" style={{ gap: 16, padding: 16, borderTop: i ? "1px solid var(--w-fill)" : "none" }}>
                  <ImgBox h={68} label="" style={{ width: 84, flex: "0 0 auto" }} />
                  <div className="wf-col" style={{ gap: 6, flex: 1 }}><Bar w="55%" h={11} dark /><Bar w="35%" h={7} /><Bar w={70} h={10} dark /></div>
                  <div className="wf-box" style={{ width: 96, height: 36, borderRadius: 999 }} />
                  <Bar w={48} h={8} />
                </div>
              ))}
            </Card>
            <WBoughtTogether />
          </div>
          <Card pad={20} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Bar w="60%" h={13} dark />
            {[0, 1].map((i) => <div key={i} className="wf-row"><Bar w={70} h={8} /><div style={{ flex: 1 }} /><Bar w={60} h={9} /></div>)}
            <div className="wf-row" style={{ borderTop: "1.5px dashed var(--w-line)", paddingTop: 12 }}><Bar w={50} h={11} dark /><div style={{ flex: 1 }} /><Bar w={90} h={16} dark /></div>
            <Btn label="Lanjut ke Checkout" solid block h={46} />
            <Btn label="Tambah produk lain" block />
          </Card>
        </div>
      </div>
    </div>
  );
}

function WFCheckout() {
  return (
    <div>
      <WStoreHeader active="Katalog" />
      <div style={{ padding: "26px 30px" }}>
        <Bar w={150} h={20} dark style={{ marginBottom: 22 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>
          <div className="wf-col" style={{ gap: 18 }}>
            <Card pad={22}>
              <div className="wf-row" style={{ gap: 10, marginBottom: 18 }}><IconBox size={32} /><Bar w={170} h={11} dark /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label /><Field label /><Field full h={70} /><Field full />
              </div>
            </Card>
            <Card pad={22}>
              <div className="wf-row" style={{ gap: 10, marginBottom: 18 }}><IconBox size={32} /><Bar w={190} h={11} dark /></div>
              <div className="wf-col" style={{ gap: 12 }}>{[0, 1, 2].map((i) => <div key={i} className="wf-row" style={{ gap: 14, padding: 14, border: "1.5px solid var(--w-line-2)", borderRadius: 12 }}><IconBox size={38} /><div className="wf-col" style={{ gap: 5, flex: 1 }}><Bar w="40%" h={9} dark /><Bar w="55%" h={7} /></div><div className="wf-box" style={{ width: 18, height: 18, borderRadius: 999 }} /></div>)}</div>
            </Card>
          </div>
          <Card pad={20} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Bar w="55%" h={13} dark />
            {[0, 1].map((i) => <div key={i} className="wf-row" style={{ gap: 10 }}><ImgBox h={40} label="" style={{ width: 46 }} /><div className="wf-col" style={{ gap: 4, flex: 1 }}><Bar w="80%" h={8} /><Bar w="40%" h={6} /></div><Bar w={40} h={8} /></div>)}
            <div className="wf-row" style={{ borderTop: "1px solid var(--w-fill)", paddingTop: 12 }}><Bar w={50} h={11} dark /><div style={{ flex: 1 }} /><Bar w={90} h={16} dark /></div>
            <Btn label="Konfirmasi Pesanan" solid block h={46} />
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Bar, Lines, Btn, ImgBox, IconBox, Chip, Field, Note, Sect, Card,
  WStoreHeader, WStoreFooter, WBoughtTogether, WProductCard,
  WFHome, WFCatalog, WFProduct, WFCart, WFCheckout });
