import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COL } from "@/lib/firebase/collections";

// Alfabet "Crockford-like" — exclude karakter mirip (0/O, 1/I/L, dst.)
// supaya pelanggan tidak salah baca/ketik saat lacak pesanan.
const SAFE_CHARS = "ACDEFGHJKLMNPQRTUVWXY2345679";

function randomSuffix(length = 4) {
  let s = "";
  for (let i = 0; i < length; i++) {
    s += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)];
  }
  return s;
}

function todayPrefix() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `KI-${y}${m}${d}-`;
}

export async function generateOrderCode() {
  const prefix = todayPrefix();

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = `${prefix}${randomSuffix()}`;
    const snap = await getDoc(doc(db, COL.ORDERS, code));
    if (!snap.exists()) return code;
  }

  throw new Error("Gagal generate kode pesanan unik. Coba lagi.");
}
