// src/app/dashboard/produk/components/ProductPageHeader.tsx
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export const ProductPageHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8 border-b pb-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Kelola Produk Anda
        </h1>
        <p className="text-gray-500 mt-1">
          Lihat, tambah, atau edit produk hasil tani Anda.
        </p>
      </div>
      <Link
        href="/dashboard/produk/baru" // Nanti akan kita buat halaman ini
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors"
      >
        <Plus size={18} />
        <span className="hidden md:inline">Tambah Produk</span>
      </Link>
    </div>
  );
};
