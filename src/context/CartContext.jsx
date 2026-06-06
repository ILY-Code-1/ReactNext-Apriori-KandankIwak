"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "ki_cart_v1";

const CartContext = createContext({
  items: {},
  hydrated: false,
  count: 0,
  add: () => {},
  setQty: () => {},
  remove: () => {},
  clear: () => {},
});

export function CartProvider({ children }) {
  const [items, setItems] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setItems(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const add = (productId, qty = 1) =>
    setItems((c) => ({ ...c, [productId]: (c[productId] || 0) + qty }));

  const setQty = (productId, qty) =>
    setItems((c) => {
      if (!qty || qty <= 0) {
        const next = { ...c };
        delete next[productId];
        return next;
      }
      return { ...c, [productId]: qty };
    });

  const remove = (productId) =>
    setItems((c) => {
      const next = { ...c };
      delete next[productId];
      return next;
    });

  const clear = () => setItems({});

  const count = Object.values(items).reduce((s, q) => s + q, 0);

  return (
    <CartContext.Provider
      value={{ items, hydrated, count, add, setQty, remove, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
