export const rupiah = (n) => "Rp" + Math.round(n || 0).toLocaleString("id-ID");
export const pct = (n) => (n * 100).toFixed(1) + "%";

function toDate(d) {
  if (!d) return null;
  if (d.toDate) return d.toDate();
  if (d instanceof Date) return d;
  return new Date(d);
}

export function formatDate(d) {
  const date = toDate(d);
  if (!date) return "—";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(d) {
  const date = toDate(d);
  if (!date) return "—";
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function rupiahShort(n) {
  const v = n || 0;
  if (v >= 1_000_000) return `Rp${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")} jt`;
  if (v >= 1_000) return `Rp${(v / 1_000).toFixed(0)} rb`;
  return rupiah(v);
}
