import { getProductById } from "@/lib/firebase/products";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan — Kandank Iwak",
    };
  }

  return {
    title: `${product.name} — Kandank Iwak`,
    description: product.description || `Beli ${product.name} (${product.unit}) seharga Rp${(product.price || 0).toLocaleString("id-ID")} di Kandank Iwak.`,
    openGraph: {
      title: `${product.name} — Kandank Iwak`,
      description: product.description || `Beli ${product.name} di Kandank Iwak.`,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default function ProductDetailLayout({ children }) {
  return children;
}
