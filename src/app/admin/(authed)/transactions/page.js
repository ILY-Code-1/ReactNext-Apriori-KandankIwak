import Icon from "@/components/ui/Icon";

export default function TransactionsPlaceholderPage() {
  return (
    <div className="col gap-18 kiup" style={{ minHeight: "calc(100vh - 130px)" }}>
      <div
        className="card"
        style={{
          padding: "18px 22px",
          display: "flex",
          gap: 14,
          alignItems: "center",
          background: "var(--sky-50)",
          border: "1px solid var(--sky-100)",
        }}
      >
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: "#fff",
            color: "var(--sky-600)",
            display: "grid",
            placeItems: "center",
            flex: "0 0 auto",
          }}
        >
          <Icon name="info" size={20} />
        </span>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--body)", fontWeight: 600 }}>
          Halaman ini menjadi <b style={{ color: "var(--navy)" }}>sumber data Apriori</b>. Setiap
          baris berisi item yang dibeli bersama dalam satu transaksi. Akan diisi otomatis setelah
          checkout pelanggan terhubung ke Firestore.
        </p>
      </div>

      <div
        className="card"
        style={{
          padding: "80px 20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          flex: 1,
        }}
      >
        <span
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "var(--bg-2)",
            color: "var(--navy)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name="chart" size={32} />
        </span>
        <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 16 }}>
          Belum ada data transaksi
        </span>
        <span className="mut" style={{ fontSize: 13.5, maxWidth: 420 }}>
          Tabel akan menampilkan ID, tanggal, item, dan kode pesanan untuk setiap transaksi
          checkout. Slicing UI tahap berikutnya.
        </span>
      </div>
    </div>
  );
}
