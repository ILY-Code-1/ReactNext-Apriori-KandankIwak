import {
  collection,
  documentId,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COL } from "@/lib/firebase/collections";

function todayPrefix() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `KI-${y}${m}${d}-`;
}

export async function generateOrderCode() {
  const prefix = todayPrefix();
  const q = query(
    collection(db, COL.ORDERS),
    where(documentId(), ">=", prefix),
    where(documentId(), "<", `${prefix}`),
  );
  const snap = await getCountFromServer(q);
  const seq = snap.data().count + 1;
  return `${prefix}${String(seq).padStart(3, "0")}`;
}
