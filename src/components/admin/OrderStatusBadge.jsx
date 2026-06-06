const MAP = {
  ordered: ["badge-amber", "Dipesan"],
  paid: ["badge-sky", "Dibayar"],
  shipped: ["badge-navy", "Dikirim"],
  completed: ["badge-green", "Selesai"],
};

export default function OrderStatusBadge({ status }) {
  const [cls, label] = MAP[status] || MAP.ordered;
  return (
    <span className={`badge ${cls}`}>
      <span className="dot" />
      {label}
    </span>
  );
}
