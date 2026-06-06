import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./client";
import { COL, TRANSACTION_SOURCE } from "./collections";

const transactionsRef = () => collection(db, COL.TRANSACTIONS);

export async function addTransaction({
  items,
  order_code,
  source = TRANSACTION_SOURCE.CHECKOUT,
}) {
  const ref = await addDoc(transactionsRef(), {
    items,
    order_code,
    source,
    date: serverTimestamp(),
  });
  return ref.id;
}

export async function getAllTransactions() {
  const q = query(transactionsRef(), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
