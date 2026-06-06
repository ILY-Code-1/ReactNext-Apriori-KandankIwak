import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./client";
import { COL } from "./collections";

const productsRef = () => collection(db, COL.PRODUCTS);
const productDoc = (id) => doc(db, COL.PRODUCTS, id);

const mapSnap = (snap) => ({ id: snap.id, ...snap.data() });

export async function getAllProducts({ onlyActive = false } = {}) {
  const q = query(productsRef(), orderBy("created_at", "desc"));
  const snap = await getDocs(q);
  const all = snap.docs.map(mapSnap);
  return onlyActive ? all.filter((p) => p.active !== false) : all;
}

export async function getProductById(id) {
  const snap = await getDoc(productDoc(id));
  return snap.exists() ? mapSnap(snap) : null;
}

export async function addProduct(data) {
  const ref = await addDoc(productsRef(), {
    name: data.name,
    price: data.price,
    category: data.category,
    stock: data.stock,
    unit: data.unit,
    description: data.description,
    image_url: data.image_url,
    active: data.active ?? true,
    created_at: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id, patch) {
  await updateDoc(productDoc(id), patch);
}

export async function deactivateProduct(id) {
  await updateDoc(productDoc(id), { active: false });
}
