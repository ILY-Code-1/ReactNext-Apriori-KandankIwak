"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductCard from "@/components/store/ProductCard";
import { getAllProducts } from "@/lib/firebase/products";

export default function RelatedProducts({ currentProduct, limit = 4 }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProduct) return;

    getAllProducts({ onlyActive: true })
      .then((all) => {
        const sameCategory = all.filter(
          (p) => p.category === currentProduct.category && p.id !== currentProduct.id
        );

        let result = sameCategory.slice(0, limit);

        if (result.length < limit) {
          const others = all.filter(
            (p) => p.id !== currentProduct.id && !sameCategory.find((s) => s.id === p.id)
          );
          result = [...result, ...others.slice(0, limit - result.length)];
        }

        setProducts(result);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentProduct, limit]);

  if (loading || products.length === 0) return null;

  return (
    <section style={{ marginTop: 40 }}>
      <div className="row" style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 22 }}>Produk Serupa</h2>
        <div className="spacer" />
        <Link href="/products" className="btn btn-ghost btn-sm">
          Lihat semua <Icon name="arrowR" size={15} />
        </Link>
      </div>
      <div
        className="grid-cards-4"
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} compact />
        ))}
      </div>
    </section>
  );
}
