import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./client";
import { COL } from "./collections";

const rulesRef = () => collection(db, COL.RULES);

export async function saveRules(rules, parameters) {
  const existing = await getDocs(rulesRef());
  const batch = writeBatch(db);
  const calculated_at = serverTimestamp();

  existing.docs.forEach((d) => batch.delete(d.ref));
  rules.forEach((rule) => {
    const ref = doc(rulesRef());
    batch.set(ref, {
      antecedent: rule.antecedent,
      consequent: rule.consequent,
      support: rule.support,
      confidence: rule.confidence,
      calculated_at,
      parameters,
    });
  });

  await batch.commit();
}

export async function getAllRules() {
  const q = query(rulesRef(), orderBy("confidence", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
