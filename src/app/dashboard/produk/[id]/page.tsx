// src/app/dashboard/produk/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Calendar, MapPin, Package } from "lucide-react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

// Definisikan tipe data untuk kejelasan
interface Petani {
  name: string;
  lokasi: string;
}
interface ProyekTani {
  petani: Petani;
}
interface Product {
  id: string;
  namaProduk: string;
  deskripsi: string;
  harga: number;
  stokTersedia: number;
  unit: string;
  status: "TERSEDIA" | "PREORDER" | "HABIS";
  estimasiPanen?: string | null;
  fotoUrl: string[];
  proyekTani?: ProyekTani;
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { id } = params; // Ambil id langsung dari params

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/produk/${id}`);
        if (!response.ok) {
          throw new Error("Produk tidak ditemukan atau gagal dimuat");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error(
          error instanceof Error ? error.message : "Produk tidak ditemukan"
        );
        router.push("/dashboard/produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleDelete = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Yakin ingin menghapus produk ini?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete();
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  const confirmDelete = async () => {
    if (deleting) return;
    setDeleting(true);

    const deletePromise = fetch(`/api/produk/${id}`, {
      method: "DELETE",
    });

    toast.promise(deletePromise, {
      loading: "Menghapus produk...",
      success: () => {
        router.push("/dashboard/produk");
        return "Produk berhasil dihapus!";
      },
      error: "Gagal menghapus produk.",
    });

    try {
      await deletePromise;
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/produk/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p>Produk tidak dapat ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster position="top-center" />
      {/* Header dengan tombol aksi */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {product.namaProduk}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            {deleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galeri Gambar Produk */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100">
            {product.fotoUrl && product.fotoUrl.length > 0 ? (
              <Image
                src={product.fotoUrl[0]}
                alt={product.namaProduk}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package size={64} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Detail Produk */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Deskripsi
            </h2>
            <p className="text-gray-600">
              {product.deskripsi || "Tidak ada deskripsi."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Harga</span>
              <p className="text-2xl font-bold text-green-600">
                Rp {product.harga?.toLocaleString("id-ID") ?? 0}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Stok</span>
              <p className="text-lg font-semibold">
                {product.stokTersedia} {product.unit}
              </p>
            </div>
          </div>

          <div>
            <span className="text-sm text-gray-500">Status</span>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ml-2 ${
                product.status === "TERSEDIA"
                  ? "bg-green-100 text-green-800"
                  : product.status === "PREORDER"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.status}
            </span>
          </div>

          {product.estimasiPanen && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-500">Estimasi Panen:</span>
              <span>
                {new Date(product.estimasiPanen).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          )}

          {product.proyekTani && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Informasi Petani
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  {product.proyekTani.petani?.name ?? "Nama tidak tersedia"}
                </p>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-gray-600">
                    {product.proyekTani.petani?.lokasi ??
                      "Lokasi tidak tersedia"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
