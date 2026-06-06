import { rupiah } from "@/lib/utils/format";

export function buildOrderMessage({
  orderCode,
  customerName,
  contact,
  items,
  total,
  address,
  paymentMethod,
  notes,
}) {
  const lines = [
    "Halo Admin Kandank Iwak,",
    "Saya konfirmasi pesanan & lampirkan bukti transfer.",
    "",
    `*Kode Pesanan*: ${orderCode}`,
    `*Nama*: ${customerName}`,
    `*Kontak*: ${contact}`,
    "",
    "*Item*:",
    ...items.map(
      (it) => `- ${it.name} x${it.qty} = ${rupiah(it.price * it.qty)}`,
    ),
    "",
    `*Total*: ${rupiah(total)}`,
  ];

  if (paymentMethod) {
    lines.push(
      "",
      "*Pembayaran*:",
      `${(paymentMethod.payment_method || "").toUpperCase()} ${paymentMethod.account_number}`,
      `a.n. ${paymentMethod.account_name}`,
    );
  }

  if (address) {
    const parts = [];
    if (address.kelurahan_name) parts.push(`Kel. ${address.kelurahan_name}`);
    if (address.kecamatan_name) parts.push(`Kec. ${address.kecamatan_name}`);
    parts.push("Kabupaten Tangerang");
    lines.push("", "*Alamat Pengiriman*:", parts.join(", "));
    if (address.detail) lines.push(address.detail);
  }

  if (notes && notes.trim()) {
    lines.push("", `*Catatan*: ${notes.trim()}`);
  }

  lines.push("", "Bukti transfer terlampir di chat ini. Terima kasih!");
  return lines.join("\n");
}

export function buildWhatsAppUrl(message) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
