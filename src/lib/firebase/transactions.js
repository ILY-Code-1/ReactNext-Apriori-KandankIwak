import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./client";
import { COL, ORDER_STATUS, TRANSACTION_SOURCE } from "./collections";
import { getOrderByCode } from "./orders";

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

export async function getValidTransactions() {
  const allTransactions = await getAllTransactions();
  const valid = [];

  for (const tx of allTransactions) {
    if (tx.source === TRANSACTION_SOURCE.SEED) {
      valid.push(tx);
    } else if (tx.source === TRANSACTION_SOURCE.CHECKOUT) {
      const order = await getOrderByCode(tx.order_code);
      if (order && order.status === ORDER_STATUS.COMPLETED) {
        valid.push(tx);
      }
    }
  }

  return valid;
}
