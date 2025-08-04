// src/app/dashboard/produk/components/ProductList.tsx
"use client";

import { Package, Eye, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Produk, ProyekTani, User } from "@prisma/client";

type ProdukWithRelations = Produk & {
  proyekTani: ProyekTani & {
    petani: Pick<User, "name" | "lokasi" | "linkWhatsapp">;
  };
};

interface ProductListProps {
  products: ProdukWithRelations[];
}

// Dashboard Product Card Component
const DashboardProductCard = ({
  product,
}: {
  product: ProdukWithRelations;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      {/* Gambar Produk */}
      <div className="aspect-square relative rounded-t-xl overflow-hidden bg-gray-100">
        {product.fotoUrl ? (
          <Image
            src={
              Array.isArray(product.fotoUrl)
                ? product.fotoUrl[0]
                : product.fotoUrl
            }
            alt={product.namaProduk}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package size={48} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Konten Card */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-800 line-clamp-1">
            {product.namaProduk}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.deskripsi || "Tidak ada deskripsi"}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-green-600">
              Rp {product.harga.toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-gray-500">
              {product.stokTersedia} {product.unit}
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.status === "TERSEDIA"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {product.status}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link
            href={`/dashboard/produk/${product.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Eye size={14} />
            Detail
          </Link>
          <Link
            href={`/dashboard/produk/${product.id}/edit`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Edit size={14} />
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ProductList = ({ products }: ProductListProps) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <DashboardProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
