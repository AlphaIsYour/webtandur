"use client";

import ProductCard from "@/components/ProductCard";
import { Search, Loader2 } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductWithFarmer } from "@/types";
import Providers from "@/components/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProdukPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [produks, setProduks] = useState<ProductWithFarmer[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  // Fetch products based on search term
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const query = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : "";
        const response = await fetch(`/api/all-product${query}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProduks(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Update URL when search term changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("q", searchTerm);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchTerm, pathname, router, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will handle the actual search
  };

  return (
    <>
      <Providers>
        <Navbar />
      </Providers>
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-8 pt-28 min-h-screen">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-7 text-center tracking-tight">
          Produk Petani
        </h1>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari produk..."
              className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 transition bg-white shadow-sm"
            />
          </div>
        </form>

        {/* Search results */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {produks.length > 0 ? (
              produks.map((produk) => (
                <ProductCard key={produk.id} produk={produk} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 text-lg mb-2">
                  {searchTerm
                    ? "Produk tidak ditemukan"
                    : "Tidak ada produk tersedia"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Tampilkan semua produk
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
