import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./client";
import { COL, ORDER_STATUS, TRANSACTION_SOURCE } from "./collections";

const ordersRef = () => collection(db, COL.ORDERS);
const orderDoc = (code) => doc(db, COL.ORDERS, code);

export async function getAllOrders() {
  const q = query(ordersRef(), orderBy("created_at", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ code: d.id, ...d.data() }));
}

export async function addOrder(orderCode, data) {
  await setDoc(orderDoc(orderCode), {
    items: data.items,
    total: data.total,
    customer_name: data.customer_name,
    contact: data.contact,
    status: data.status ?? ORDER_STATUS.ORDERED,
    notes: data.notes ?? "",
    created_at: serverTimestamp(),
  });
  return orderCode;
}

export async function getOrderByCode(code) {
  const snap = await getDoc(orderDoc(code));
  return snap.exists() ? { code: snap.id, ...snap.data() } : null;
}

export async function updateOrderStatus(code, status) {
  await updateDoc(orderDoc(code), { status });
}

export async function addOrderAndTransaction(orderCode, orderData, transactionData) {
  const batch = writeBatch(db);
  const orderRef = orderDoc(orderCode);
  const txnRef = doc(collection(db, COL.TRANSACTIONS));

  batch.set(orderRef, {
    items: orderData.items,
    total: orderData.total,
    customer_name: orderData.customer_name,
    contact: orderData.contact,
    address: orderData.address ?? null,
    payment_method: orderData.payment_method ?? null,
    status: orderData.status ?? ORDER_STATUS.ORDERED,
    notes: orderData.notes ?? "",
    created_at: serverTimestamp(),
  });

  batch.set(txnRef, {
    items: transactionData.items,
    order_code: orderCode,
    source: transactionData.source ?? TRANSACTION_SOURCE.CHECKOUT,
    date: serverTimestamp(),
  });

  await batch.commit();
  return orderCode;
}
