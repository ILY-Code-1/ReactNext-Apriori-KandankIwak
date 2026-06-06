/* ===========================================================
   Kandank Iwak — Data Layer & Apriori Engine
   Plain JS, attaches everything to window.KI
   =========================================================== */
(function () {
  // ---------- Format helpers ----------
  const rupiah = (n) =>
    "Rp" + Math.round(n).toLocaleString("id-ID");
  const pct = (n) => (n * 100).toFixed(1) + "%";

  // ---------- Products ----------
  // illo = key used to pick a flat illustration in the UI
  const products = [
    {
      id: "nila",
      name: "Nila Segar 1kg",
      category: "Ikan Segar",
      unit: "per kg",
      price: 35000,
      stock: 48,
      illo: "whole",
      tint: "sky",
      desc:
        "Ikan nila hasil panen harian dari kolam budidaya Kandank Iwak. Daging tebal, segar, tanpa bau lumpur. Cocok untuk digoreng, dibakar, atau dipecak.",
      tags: ["Panen harian", "Air tawar bersih"],
    },
    {
      id: "fillet",
      name: "Nila Fillet",
      category: "Olahan",
      unit: "per pack 500g",
      price: 32000,
      stock: 26,
      illo: "fillet",
      tint: "navy",
      desc:
        "Fillet nila tanpa duri, sudah dibersihkan dan dikemas vakum. Praktis untuk MPASI, sup, atau menu restoran.",
      tags: ["Tanpa duri", "Kemasan vakum"],
    },
    {
      id: "bibit",
      name: "Bibit Nila",
      category: "Budidaya",
      unit: "per 100 ekor",
      price: 65000,
      stock: 120,
      illo: "fry",
      tint: "sky",
      desc:
        "Bibit nila unggul ukuran 5–7 cm, sehat dan seragam. Tingkat kelangsungan hidup tinggi untuk pembesaran.",
      tags: ["Ukuran 5–7cm", "SR tinggi"],
    },
    {
      id: "pakan",
      name: "Pakan Ikan",
      category: "Budidaya",
      unit: "per karung 5kg",
      price: 78000,
      stock: 34,
      illo: "feed",
      tint: "navy",
      desc:
        "Pelet apung protein 30% untuk pertumbuhan optimal nila. Tidak mudah hancur di air, hemat dan efisien.",
      tags: ["Protein 30%", "Pelet apung"],
    },
    {
      id: "bumbu",
      name: "Bumbu Pecak",
      category: "Bumbu",
      unit: "per sachet",
      price: 8000,
      stock: 90,
      illo: "spice",
      tint: "sky",
      desc:
        "Bumbu pecak khas Kandank Iwak — racikan cabai, kencur, dan terasi. Tinggal ulek, sambal pecak siap menemani nila bakar.",
      tags: ["Racikan rumahan", "Pedas segar"],
    },
    {
      id: "bundling",
      name: "Paket Bundling Nila + Bumbu",
      category: "Paket",
      unit: "per paket",
      price: 40000,
      stock: 30,
      illo: "bundle",
      tint: "navy",
      desc:
        "Hemat! Satu kilo nila segar berpasangan dengan dua sachet bumbu pecak. Langsung masak begitu sampai rumah.",
      tags: ["Hemat Rp3.000", "Siap masak"],
    },
  ];

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  // ---------- Transaction history (source data for Apriori) ----------
  // Each = set of product ids bought together.
  const baskets = [
    // nila + bumbu core
    ["nila", "bumbu"],
    ["nila", "bumbu"],
    ["nila", "bumbu", "fillet"],
    ["nila", "bumbu"],
    ["nila", "bumbu"],
    ["nila", "bumbu", "fillet"],
    ["nila", "bumbu"],
    ["nila", "bumbu"],
    ["nila", "bumbu", "fillet"],
    ["nila", "bumbu"],
    ["nila", "bumbu"],
    ["nila", "bumbu", "fillet"],
    // bibit + pakan core
    ["bibit", "pakan"],
    ["bibit", "pakan"],
    ["bibit", "pakan", "bumbu"],
    ["bibit", "pakan"],
    ["bibit", "pakan", "bumbu"],
    ["bibit", "pakan"],
    ["bibit", "pakan", "bumbu"],
    ["bibit", "pakan"],
    ["bibit", "pakan", "bumbu"],
    ["bibit", "pakan"],
    // fillet associations
    ["fillet", "bumbu"],
    ["fillet", "bumbu"],
    ["fillet", "bumbu"],
    ["fillet", "nila"],
    ["fillet", "nila"],
    ["fillet"],
    // misc / singles
    ["nila"],
    ["nila"],
    ["nila"],
    ["bumbu"],
    ["pakan"],
    ["bundling"],
    ["bundling", "fillet"],
    ["nila", "fillet", "bumbu"],
  ];

  // Build transaction objects with id + date for the admin table
  const startDate = new Date(2026, 4, 1); // May 2026
  const transactions = baskets.map((items, i) => {
    const d = new Date(startDate.getTime() + i * 26 * 3600 * 1000);
    const total = items.reduce((s, id) => s + (productMap[id]?.price || 0), 0);
    return {
      id: "TRX-" + String(1024 + i),
      date: d,
      items: items.slice(),
      total,
      channel: i % 3 === 0 ? "WhatsApp" : i % 3 === 1 ? "Web" : "Marketplace",
    };
  });

  // ---------- Apriori ----------
  function powersetSubsets(arr) {
    // all non-empty proper subsets
    const res = [];
    const n = arr.length;
    for (let mask = 1; mask < (1 << n) - 1; mask++) {
      const sub = [];
      for (let i = 0; i < n; i++) if (mask & (1 << i)) sub.push(arr[i]);
      res.push(sub);
    }
    return res;
  }

  const key = (arr) => arr.slice().sort().join("|");

  function apriori(txns, minSupport, minConfidence, maxLen = 3) {
    const N = txns.length;
    const minCount = minSupport * N;
    const sets = txns.map((t) => new Set(t));

    // count helper
    const countOf = (items) => {
      let c = 0;
      for (const s of sets) {
        let ok = true;
        for (const it of items)
          if (!s.has(it)) {
            ok = false;
            break;
          }
        if (ok) c++;
      }
      return c;
    };

    // L1
    const itemCounts = new Map();
    for (const s of sets)
      for (const it of s) itemCounts.set(it, (itemCounts.get(it) || 0) + 1);

    let current = [];
    for (const [it, c] of itemCounts)
      if (c >= minCount) current.push([it]);
    current.sort();

    const supportMap = new Map(); // key -> count
    const allFrequent = [];
    current.forEach((items) => {
      const c = countOf(items);
      supportMap.set(key(items), c);
      allFrequent.push({ items, count: c });
    });

    let k = 1;
    while (current.length > 0 && k < maxLen) {
      // generate candidates by joining
      const candidates = [];
      const seen = new Set();
      for (let i = 0; i < current.length; i++) {
        for (let j = i + 1; j < current.length; j++) {
          const a = current[i],
            b = current[j];
          // join if first k-1 equal
          let same = true;
          for (let x = 0; x < k - 1; x++)
            if (a[x] !== b[x]) {
              same = false;
              break;
            }
          if (!same) continue;
          const merged = Array.from(new Set([...a, ...b])).sort();
          if (merged.length !== k + 1) continue;
          const kk = key(merged);
          if (seen.has(kk)) continue;
          seen.add(kk);
          candidates.push(merged);
        }
      }
      const next = [];
      candidates.forEach((items) => {
        const c = countOf(items);
        if (c >= minCount) {
          supportMap.set(key(items), c);
          allFrequent.push({ items, count: c });
          next.push(items);
        }
      });
      current = next;
      k++;
    }

    // Generate rules
    const rules = [];
    allFrequent
      .filter((f) => f.items.length >= 2)
      .forEach((f) => {
        const subs = powersetSubsets(f.items);
        subs.forEach((ante) => {
          const cons = f.items.filter((x) => !ante.includes(x));
          if (!cons.length) return;
          const anteCount = supportMap.get(key(ante));
          if (!anteCount) return;
          const conf = f.count / anteCount;
          if (conf >= minConfidence) {
            const consCount = countOf(cons);
            const lift = conf / (consCount / N);
            rules.push({
              antecedent: ante,
              consequent: cons,
              support: f.count / N,
              supportCount: f.count,
              confidence: conf,
              lift,
            });
          }
        });
      });

    rules.sort(
      (a, b) => b.confidence - a.confidence || b.support - a.support
    );

    return {
      rules,
      frequentItemsets: allFrequent.sort((a, b) => b.count - a.count),
      transactionCount: N,
    };
  }

  // Recommendations for a given product id from a set of rules
  function recommendFor(productId, rules, limit = 3) {
    const scored = new Map();
    rules.forEach((r) => {
      if (r.antecedent.includes(productId)) {
        r.consequent.forEach((cid) => {
          if (cid === productId) return;
          const prev = scored.get(cid);
          if (!prev || r.confidence > prev.confidence)
            scored.set(cid, { confidence: r.confidence, lift: r.lift });
        });
      }
    });
    return Array.from(scored.entries())
      .sort((a, b) => b[1].confidence - a[1].confidence)
      .slice(0, limit)
      .map(([id, meta]) => ({ product: productMap[id], ...meta }));
  }

  // Recommendations based on a whole cart (any item in cart matches antecedent)
  function recommendForCart(cartIds, rules, limit = 3) {
    const cartSet = new Set(cartIds);
    const scored = new Map();
    rules.forEach((r) => {
      if (r.antecedent.every((a) => cartSet.has(a))) {
        r.consequent.forEach((cid) => {
          if (cartSet.has(cid)) return;
          const prev = scored.get(cid);
          if (!prev || r.confidence > prev.confidence)
            scored.set(cid, { confidence: r.confidence, lift: r.lift });
        });
      }
    });
    return Array.from(scored.entries())
      .sort((a, b) => b[1].confidence - a[1].confidence)
      .slice(0, limit)
      .map(([id, meta]) => ({ product: productMap[id], ...meta }));
  }

  // ---------- Orders (admin) ----------
  const orderSeed = [
    { id: "ORD-2051", name: "Bu Sari Wijaya", items: ["nila", "bumbu"], status: "baru", date: "4 Jun 2026", total: 43000 },
    { id: "ORD-2050", name: "Pak Hendra", items: ["bibit", "pakan"], status: "diproses", date: "4 Jun 2026", total: 143000 },
    { id: "ORD-2049", name: "Warung Mbak Tin", items: ["nila", "fillet", "bumbu"], status: "diproses", date: "3 Jun 2026", total: 75000 },
    { id: "ORD-2048", name: "Bu Dewi", items: ["bundling"], status: "selesai", date: "3 Jun 2026", total: 40000 },
    { id: "ORD-2047", name: "Pak Joko", items: ["nila", "bumbu"], status: "selesai", date: "2 Jun 2026", total: 43000 },
    { id: "ORD-2046", name: "Rumah Makan Sederhana", items: ["fillet", "fillet", "bumbu"], status: "baru", date: "2 Jun 2026", total: 72000 },
  ].map((o) => ({ ...o }));

  // Sales mini-series for dashboard chart (last 7 days, in thousands)
  const salesSeries = [
    { day: "Sen", value: 420 },
    { day: "Sel", value: 510 },
    { day: "Rab", value: 480 },
    { day: "Kam", value: 640 },
    { day: "Jum", value: 720 },
    { day: "Sab", value: 910 },
    { day: "Min", value: 680 },
  ];

  window.KI = {
    rupiah,
    pct,
    products,
    productMap,
    transactions,
    apriori,
    recommendFor,
    recommendForCart,
    orderSeed,
    salesSeries,
    DEFAULT_SUPPORT: 0.1,
    DEFAULT_CONFIDENCE: 0.3,
  };
})();
