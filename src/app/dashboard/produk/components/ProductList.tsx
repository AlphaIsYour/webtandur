// src/app/dashboard/produk/components/ProductList.tsx
"use client";

import ProductCard from "@/components/ProductCard"; // Menggunakan komponen yang sudah kamu buat
import { Package } from "lucide-react";

// Menggunakan tipe data dari Prisma untuk type safety
import type { Produk, ProyekTani, User } from "@prisma/client";

type ProdukWithRelations = Produk & {
  proyekTani: ProyekTani & {
    petani: Pick<User, "name" | "lokasi" | "linkWhatsapp">;
  };
};

interface ProductListProps {
  products: ProdukWithRelations[];
}

export const ProductList = ({ products }: ProductListProps) => {
  // Handle jika tidak ada produk
  if (products.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-xl">
        <Package size={48} className="mx-auto text-gray-400" />
        <h3 className="mt-4 text-xl font-medium text-gray-800">
          Belum Ada Produk
        </h3>
        <p className="mt-1 text-gray-500">
          Anda belum menambahkan produk apapun.
        </p>
      </div>
    );
  }

  // Tampilkan grid produk
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} produk={product} />
      ))}
    </div>
  );
};
