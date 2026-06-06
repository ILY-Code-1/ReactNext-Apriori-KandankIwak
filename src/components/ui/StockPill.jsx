export default function StockPill({ stock }) {
  if (stock <= 0) {
    return (
      <span className="badge badge-red">
        <span className="dot" />
        Stok habis
      </span>
    );
  }
  if (stock < 20) {
    return (
      <span className="badge badge-amber">
        <span className="dot" />
        Sisa {stock}
      </span>
    );
  }
  return (
    <span className="badge badge-green">
      <span className="dot" />
      Stok {stock}
    </span>
  );
}
