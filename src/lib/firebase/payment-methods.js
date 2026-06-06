import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./client";
import { COL } from "./collections";

const paymentMethodsRef = () => collection(db, COL.PAYMENT_METHODS);
const paymentMethodDoc = (id) => doc(db, COL.PAYMENT_METHODS, id);

const mapSnap = (snap) => ({ id: snap.id, ...snap.data() });

export async function getAllPaymentMethods() {
  const q = query(paymentMethodsRef(), orderBy("created_at", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(mapSnap);
}

export async function addPaymentMethod(data) {
  const ref = await addDoc(paymentMethodsRef(), {
    payment_method: (data.payment_method || "").trim().toLowerCase(),
    account_name: (data.account_name || "").trim(),
    account_number: (data.account_number || "").trim(),
    created_at: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePaymentMethod(id, patch) {
  const normalized = { ...patch };
  if (typeof normalized.payment_method === "string") {
    normalized.payment_method = normalized.payment_method.trim().toLowerCase();
  }
  if (typeof normalized.account_name === "string") {
    normalized.account_name = normalized.account_name.trim();
  }
  if (typeof normalized.account_number === "string") {
    normalized.account_number = normalized.account_number.trim();
  }
  await updateDoc(paymentMethodDoc(id), normalized);
}

export async function deletePaymentMethod(id) {
  await deleteDoc(paymentMethodDoc(id));
}
