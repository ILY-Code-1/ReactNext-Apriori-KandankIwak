import { rupiah } from "@/lib/utils/format";

export function buildOrderMessage({
  orderCode,
  customerName,
  contact,
  items,
  total,
  notes,
}) {
  const lines = [
    "Halo Admin Kandank Iwak,",
    "Saya ingin konfirmasi pesanan berikut:",
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
  if (notes && notes.trim()) {
    lines.push("", `*Catatan*: ${notes.trim()}`);
  }
  lines.push(
    "",
    "Saya akan mengirim bukti transfer di chat ini. Terima kasih!",
  );
  return lines.join("\n");
}

export function buildWhatsAppUrl(message) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
