// src/app/dashboard/produk/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ProductPageHeader } from "./components/ProductPageHeader";
import { ProductList } from "./components/ProductList";

export default function ProdukPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/produk");
        if (!response.ok) {
          throw new Error("Gagal mengambil data produk");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
        // Di sini bisa ditambahkan state untuk menampilkan pesan error di UI
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <ProductPageHeader />

      {loading ? (
        // Tampilan saat loading
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        // Tampilan setelah data didapatkan
        <ProductList products={products} />
      )}
    </div>
  );
}
