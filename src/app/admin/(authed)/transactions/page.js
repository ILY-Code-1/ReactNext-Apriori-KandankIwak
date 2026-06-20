"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { getValidTransactions } from "@/lib/firebase/transactions";
import { getAllProducts } from "@/lib/firebase/products";
import { formatDateTime } from "@/lib/utils/format";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [txData, prodData] = await Promise.all([
        getValidTransactions(),
        getAllProducts(),
      ]);
      setTransactions(txData);
      const prodMap = Object.fromEntries(prodData.map((p) => [p.id, p]));
      setProducts(prodMap);
    } catch {
      setError("Gagal memuat transaksi.");
    } finally {
      setLoading(false);
    }
  }

  function getProductName(productId) {
    return products[productId]?.name || productId;
  }

  return (
    <div className="col gap-18 kiup" style={{ minHeight: "calc(100vh - 130px)" }}>
      <div className="row">
        <div className="col" style={{ gap: 2 }}>
          <span className="mut" style={{ fontSize: 13, fontWeight: 600 }}>
            {loading ? "Memuat…" : `${transactions.length} transaksi valid`}
          </span>
        </div>
        <div className="spacer" />
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={refresh}
          disabled={loading}
        >
          {loading ? <span className="ki-spin" /> : <Icon name="chevR" size={14} />} Refresh
        </button>
      </div>

      {error && (
        <div
          className="row gap-8"
          style={{
            background: "var(--red-50)",
            color: "var(--red)",
            padding: "10px 14px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Icon name="info" size={16} /> {error}
        </div>
      )}

      <div className="card" style={{ overflow: "hidden", flex: 1, display: "flex", flexDirection: "column" }}>
        {loading ? (
          <div
            className="col"
            style={{ alignItems: "center", gap: 12, padding: "60px 0" }}
          >
            <span className="ki-spin ki-spin-lg" />
            <span className="mut" style={{ fontWeight: 600 }}>Memuat transaksi…</span>
          </div>
        ) : transactions.length === 0 ? (
          <div
            className="col"
            style={{ alignItems: "center", gap: 10, padding: "60px 20px", textAlign: "center" }}
          >
            <span
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "var(--sky-50)",
                color: "var(--sky-600)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name="chart" size={28} />
            </span>
            <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 16 }}>
              Belum ada transaksi
            </span>
            <span className="mut" style={{ fontSize: 13.5, maxWidth: 320 }}>
              Transaksi akan muncul setelah pesanan diselesaikan (status completed).
            </span>
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Kode Order</th>
                <th>Produk</th>
                <th>Sumber</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: "var(--navy)", fontFamily: "monospace" }}>
                      {tx.order_code}
                    </span>
                  </td>
                  <td>
                    <div className="col" style={{ gap: 4 }}>
                      {tx.items.map((itemId, idx) => (
                        <span key={idx} className="chip chip-ink">
                          {getProductName(itemId)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: tx.source === "seed" ? "var(--bg-2)" : "var(--sky-50)",
                        color: tx.source === "seed" ? "var(--muted)" : "var(--sky-600)",
                      }}
                    >
                      {tx.source === "seed" ? "Sample" : "Checkout"}
                    </span>
                  </td>
                  <td>
                    <span className="mut" style={{ fontSize: 13 }}>
                      {tx.date ? formatDateTime(tx.date) : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
