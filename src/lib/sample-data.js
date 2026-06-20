export const SAMPLE_PRODUCTS = [
  {
    id: "nila",
    name: "Nila Segar 1kg",
    category: "Ikan Segar",
    unit: "per kg",
    price: 35000,
    stock: 48,
    illo: "whole",
    tint: "sky",
    description:
      "Ikan nila hasil panen harian dari kolam budidaya Kandank Iwak. Daging tebal, segar, tanpa bau lumpur. Cocok untuk digoreng, dibakar, atau dipecak.",
    tags: ["Panen harian", "Air tawar bersih"],
  },
  {
    id: "fillet",
    name: "Nila Fillet",
    category: "Paket Anti Ribed",
    unit: "per pack 500g",
    price: 32000,
    stock: 26,
    illo: "fillet",
    tint: "navy",
    description:
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
    description:
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
    description:
      "Pelet apung protein 30% untuk pertumbuhan optimal nila. Tidak mudah hancur di air, hemat dan efisien.",
    tags: ["Protein 30%", "Pelet apung"],
  },
  {
    id: "bundling",
    name: "Paket Bundling Nila + Bumbu",
    category: "Paket Anti Ribed",
    unit: "per paket",
    price: 40000,
    stock: 30,
    illo: "bundle",
    tint: "navy",
    description:
      "Hemat! Satu kilo nila segar berpasangan dengan dua sachet bumbu pecak. Langsung masak begitu sampai rumah.",
    tags: ["Hemat Rp3.000", "Siap masak"],
  },
];

export const SAMPLE_PRODUCT_MAP = Object.fromEntries(
  SAMPLE_PRODUCTS.map((p) => [p.id, p]),
);

export const SAMPLE_ORDERS = [
  {
    code: "KI-20260604-001",
    customer_name: "Bu Sari Wijaya",
    contact: "0812 3456 7890",
    items: [
      { product_id: "nila", name: "Nila Segar 1kg", price: 35000, qty: 1 },
      { product_id: "bundling", name: "Paket Bundling Nila + Bumbu", price: 40000, qty: 1 },
    ],
    total: 75000,
    status: "ordered",
    notes: "Titip ke pos satpam",
    created_at: "4 Jun 2026",
  },
  {
    code: "KI-20260604-002",
    customer_name: "Pak Hendra",
    contact: "0813 9876 5432",
    items: [
      { product_id: "bibit", name: "Bibit Nila", price: 65000, qty: 1 },
      { product_id: "pakan", name: "Pakan Ikan", price: 78000, qty: 1 },
    ],
    total: 143000,
    status: "paid",
    notes: "",
    created_at: "4 Jun 2026",
  },
  {
    code: "KI-20260603-003",
    customer_name: "Warung Mbak Tin",
    contact: "0857 1234 4567",
    items: [
      { product_id: "nila", name: "Nila Segar 1kg", price: 35000, qty: 1 },
      { product_id: "fillet", name: "Nila Fillet", price: 32000, qty: 1 },
      { product_id: "bundling", name: "Paket Bundling Nila + Bumbu", price: 40000, qty: 1 },
    ],
    total: 107000,
    status: "shipped",
    notes: "",
    created_at: "3 Jun 2026",
  },
  {
    code: "KI-20260603-004",
    customer_name: "Bu Dewi",
    contact: "0821 5555 1212",
    items: [
      { product_id: "bundling", name: "Paket Bundling Nila + Bumbu", price: 40000, qty: 1 },
    ],
    total: 40000,
    status: "completed",
    notes: "",
    created_at: "3 Jun 2026",
  },
  {
    code: "KI-20260602-005",
    customer_name: "Pak Joko",
    contact: "0878 9090 1212",
    items: [
      { product_id: "nila", name: "Nila Segar 1kg", price: 35000, qty: 1 },
      { product_id: "bundling", name: "Paket Bundling Nila + Bumbu", price: 40000, qty: 1 },
    ],
    total: 75000,
    status: "completed",
    notes: "",
    created_at: "2 Jun 2026",
  },
  {
    code: "KI-20260602-006",
    customer_name: "Rumah Makan Sederhana",
    contact: "0811 2020 3030",
    items: [
      { product_id: "fillet", name: "Nila Fillet", price: 32000, qty: 2 },
      { product_id: "bundling", name: "Paket Bundling Nila + Bumbu", price: 40000, qty: 1 },
    ],
    total: 104000,
    status: "ordered",
    notes: "",
    created_at: "2 Jun 2026",
  },
];

export const SAMPLE_SALES_SERIES = [
  { day: "Sen", value: 420 },
  { day: "Sel", value: 510 },
  { day: "Rab", value: 480 },
  { day: "Kam", value: 640 },
  { day: "Jum", value: 720 },
  { day: "Sab", value: 910 },
  { day: "Min", value: 680 },
];

export const SAMPLE_TOP_PRODUCTS = [
  { id: "nila", sold: 142, pct: 92 },
  { id: "bundling", sold: 118, pct: 76 },
  { id: "fillet", sold: 64, pct: 42 },
  { id: "pakan", sold: 39, pct: 26 },
];

export const SAMPLE_RECOMMENDATIONS = [
  { product_id: "bundling", confidence: 0.78 },
  { product_id: "fillet", confidence: 0.52 },
  { product_id: "nila", confidence: 0.41 },
];

export const SAMPLE_TRANSACTIONS = [
  {
    id: "tx-001",
    items: ["bundling"],
    order_code: "KI-20260603-004",
    source: "seed",
    date: "3 Jun 2026",
  },
  {
    id: "tx-002",
    items: ["nila", "bundling"],
    order_code: "KI-20260602-005",
    source: "seed",
    date: "2 Jun 2026",
  },
];
