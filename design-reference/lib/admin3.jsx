/* ===========================================================
   Kandank Iwak — Admin 3: Halaman Analisis Apriori
   =========================================================== */

function ParamControl({ label, value, onChange, min, max, step, hint }) {
  return (
    <div className="col gap-10">
      <div className="row"><span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>{label}</span><div className="spacer" /><span className="num" style={{ fontWeight: 800, color: "var(--navy)", fontSize: 16 }}>{(value * 100).toFixed(0)}%</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} style={{ accentColor: "var(--sky)", width: "100%" }} />
      <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, lineHeight: 1.4 }}>{hint}</span>
    </div>
  );
}

function RuleChips({ ids }) {
  const KI = window.KI;
  return (
    <div className="row gap-6" style={{ flexWrap: "wrap" }}>
      {ids.map((id, i) => (
        <span key={i} className="row gap-6" style={{ background: "#fff", padding: "5px 10px 5px 6px", borderRadius: 999, boxShadow: "inset 0 0 0 1.5px var(--line)", fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>
          <span className={`illo illo-${KI.productMap[id]?.tint || "sky"}`} style={{ width: 24, height: 24, aspectRatio: "auto", borderRadius: 7, flex: "0 0 auto" }}><Illo type={KI.productMap[id]?.illo || "whole"} size={22} /></span>
          {KI.productMap[id]?.name || id}
        </span>
      ))}
    </div>
  );
}

function AprioriPage({ rules, setRules, lastRun, setLastRun, params, setParams, toast, go }) {
  const KI = window.KI;
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null); // {rules, frequentItemsets, transactionCount}

  // initialise result from existing rules (if already run)
  useEffect(() => {
    if (rules && rules.length && !result) {
      setResult({ rules, frequentItemsets: [], transactionCount: KI.transactions.length });
    }
  }, []);

  const run = () => {
    setRunning(true);
    setTimeout(() => {
      const res = KI.apriori(KI.transactions.map((t) => t.items), params.support, params.confidence, 3);
      setResult(res);
      setRules(res.rules);
      const now = new Date();
      setLastRun(now.toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }));
      setRunning(false);
      toast(`${res.rules.length} rules ditemukan`);
    }, 950);
  };

  const rl = result ? result.rules : (rules || []);
  const maxConf = Math.max(0.01, ...rl.map((r) => r.confidence));

  return (
    <div className="col gap-20 kiup">
      {/* intro flow banner */}
      <div className="card" style={{ padding: "18px 22px", display: "flex", gap: 16, alignItems: "center", background: "linear-gradient(100deg, var(--sky-50), #fff)", border: "1px solid var(--sky-100)" }}>
        <span style={{ width: 42, height: 42, borderRadius: 12, background: "var(--sky)", color: "#fff", display: "grid", placeItems: "center", flex: "0 0 auto", boxShadow: "var(--shadow-sky)" }}><Icon name="spark" size={22} /></span>
        <div className="col" style={{ gap: 2 }}>
          <span style={{ fontWeight: 800, color: "var(--ink)", fontSize: 15.5 }}>Market Basket Analysis dengan Algoritma Apriori</span>
          <span style={{ fontSize: 13, color: "var(--body)", fontWeight: 500 }}>Rules yang dihasilkan di sini otomatis mengisi widget <b style={{ color: "var(--navy)" }}>“Sering Dibeli Bersama”</b> di toko pelanggan.</span>
        </div>
        <div className="spacer" />
        <button className="btn btn-outline btn-sm" onClick={() => go && go("product", { id: "nila" }, "store")} style={{ flex: "0 0 auto" }}><Icon name="arrowR" size={15} /> Lihat di toko</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>
        {/* settings panel */}
        <div className="col gap-18" style={{ position: "sticky", top: 88 }}>
          <div className="card" style={{ padding: 22 }}>
            <div className="row gap-10" style={{ marginBottom: 20 }}><span style={{ color: "var(--navy)" }}><Icon name="settings" size={19} /></span><h3 style={{ fontSize: 17 }}>Parameter</h3></div>
            <div className="col gap-22">
              <ParamControl label="Minimum Support" value={params.support} onChange={(v) => setParams({ ...params, support: v })} min={0.05} max={0.5} step={0.01} hint="Seberapa sering kombinasi item muncul di seluruh transaksi." />
              <ParamControl label="Minimum Confidence" value={params.confidence} onChange={(v) => setParams({ ...params, confidence: v })} min={0.1} max={1} step={0.05} hint="Seberapa kuat keterkaitan antar item dalam sebuah rule." />
            </div>
            <button className="btn btn-sky btn-lg btn-block" style={{ marginTop: 24 }} onClick={run} disabled={running}>
              {running ? <><span className="ki-spin" /> Melatih…</> : <><Icon name="play" size={17} /> Jalankan Analisis</>}
            </button>
            <div className="row gap-8" style={{ marginTop: 14, padding: "10px 12px", borderRadius: 12, background: "var(--bg)" }}>
              <span style={{ color: "var(--muted)" }}><Icon name="info" size={15} /></span>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{lastRun ? `Terakhir: ${lastRun}` : "Belum pernah dijalankan"}</span>
            </div>
          </div>

          {/* run summary */}
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 14, marginBottom: 14, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em", fontSize: 11.5 }}>Ringkasan</h4>
            <div className="col gap-12">
              {[["Total transaksi", KI.transactions.length], ["Frequent itemsets", result ? result.frequentItemsets.length : "—"], ["Rules dihasilkan", rl.length || "—"]].map(([k, v]) => (
                <div key={k} className="row"><span className="mut" style={{ fontSize: 13.5 }}>{k}</span><div className="spacer" /><span className="num" style={{ fontWeight: 800, color: "var(--navy)", fontSize: 16 }}>{v}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* results */}
        <div className="col gap-18">
          <div className="card" style={{ overflow: "hidden" }}>
            <div className="row" style={{ padding: "18px 22px 14px" }}>
              <div className="col" style={{ gap: 2 }}><h3 style={{ fontSize: 18 }}>Association Rules</h3><span className="mut" style={{ fontSize: 12.5, fontWeight: 600 }}>{rl.length ? `${rl.length} rules · diurutkan dari confidence tertinggi` : "Jalankan analisis untuk melihat hasil"}</span></div>
              <div className="spacer" />
              <button className="btn btn-outline btn-sm" disabled={!rl.length} onClick={() => toast("Laporan PDF diekspor (demo)")}><Icon name="download" size={15} /> PDF</button>
              <button className="btn btn-outline btn-sm" disabled={!rl.length} onClick={() => toast("Laporan Excel diekspor (demo)")}><Icon name="download" size={15} /> Excel</button>
            </div>

            {running ? (
              <div className="col" style={{ alignItems: "center", gap: 14, padding: "60px 0" }}>
                <span className="ki-spin ki-spin-lg" />
                <span style={{ fontWeight: 700, color: "var(--navy)" }}>Melatih model Apriori…</span>
                <span className="mut" style={{ fontSize: 13 }}>Menghitung support & confidence dari {KI.transactions.length} transaksi</span>
              </div>
            ) : rl.length === 0 ? (
              <div className="col" style={{ alignItems: "center", gap: 12, padding: "56px 20px", textAlign: "center" }}>
                <span style={{ width: 64, height: 64, borderRadius: 18, background: "var(--sky-50)", color: "var(--sky)", display: "grid", placeItems: "center" }}><Icon name="spark" size={32} /></span>
                <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 16 }}>Belum ada hasil</span>
                <span className="mut" style={{ fontSize: 13.5, maxWidth: 320 }}>Atur parameter di kiri lalu klik “Jalankan Analisis”. Coba turunkan minimum support jika rules terlalu sedikit.</span>
              </div>
            ) : (
              <table className="tbl">
                <thead><tr><th>Antecedent → Consequent</th><th style={{ width: 150 }}>Support</th><th style={{ width: 160 }}>Confidence</th><th style={{ width: 80 }}>Lift</th></tr></thead>
                <tbody>
                  {rl.map((r, i) => (
                    <tr key={i}>
                      <td style={{ padding: "16px" }}>
                        <div className="row gap-10" style={{ flexWrap: "wrap" }}>
                          <RuleChips ids={r.antecedent} />
                          <span style={{ color: "var(--sky)", flex: "0 0 auto" }}><Icon name="arrowR" size={18} stroke={2.5} /></span>
                          <RuleChips ids={r.consequent} />
                        </div>
                      </td>
                      <td>
                        <div className="col gap-4">
                          <span className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>{KI.pct(r.support)}</span>
                          <div style={{ height: 5, borderRadius: 999, background: "var(--bg-2)" }}><div style={{ width: `${Math.min(100, r.support * 250)}%`, height: "100%", borderRadius: 999, background: "var(--navy)" }} /></div>
                        </div>
                      </td>
                      <td>
                        <div className="col gap-4">
                          <span className="num" style={{ fontWeight: 800, color: "var(--sky-600)" }}>{KI.pct(r.confidence)}</span>
                          <div style={{ height: 5, borderRadius: 999, background: "var(--bg-2)" }}><div style={{ width: `${(r.confidence / maxConf) * 100}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--sky), var(--navy))" }} /></div>
                        </div>
                      </td>
                      <td><span className="num" style={{ fontWeight: 700, color: r.lift >= 1 ? "var(--green)" : "var(--muted)" }}>{r.lift.toFixed(2)}×</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* frequent itemsets */}
          {result && result.frequentItemsets.length > 0 && (
            <div className="card" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 17, marginBottom: 4 }}>Frequent Itemsets</h3>
              <span className="mut" style={{ fontSize: 12.5, fontWeight: 600 }}>Kombinasi item yang memenuhi minimum support</span>
              <div className="row gap-10" style={{ flexWrap: "wrap", marginTop: 16 }}>
                {result.frequentItemsets.filter((f) => f.items.length >= 2).slice(0, 12).map((f, i) => (
                  <div key={i} className="row gap-8" style={{ background: "var(--bg)", borderRadius: 12, padding: "8px 12px" }}>
                    <RuleChips ids={f.items} />
                    <span className="num" style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>×{f.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AprioriPage });
