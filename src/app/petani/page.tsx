"use client";

import FarmerCard from "@/components/FarmerCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Providers from "@/components/providers";
import { Search, Loader2 } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface FarmerData {
  id: string;
  name: string;
  username: string;
  bio: string;
  lokasi: string;
  image: string;
  _count: {
    proyekTani: number;
  };
}

export default function PetaniPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [petanis, setPetanis] = useState<FarmerData[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const fetchFarmers = async () => {
      setIsLoading(true);
      try {
        const query = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : "";
        const response = await fetch(`/api/all-farmers${query}`);
        if (!response.ok) throw new Error("Failed to fetch farmers");
        const data = await response.json();
        setPetanis(data);
      } catch (error) {
        console.error("Error fetching farmers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchFarmers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

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
  };

  return (
    <>
      <Providers>
        <Navbar />
      </Providers>
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-8 pt-28 min-h-screen">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-7 text-center tracking-tight">
          Petani Terpercaya
        </h1>

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
              placeholder="Cari petani..."
              className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 transition bg-white shadow-sm"
            />
          </div>
        </form>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {petanis.length > 0 ? (
              petanis.map((petani) => (
                <FarmerCard key={petani.id} petani={petani} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 text-lg mb-2">
                  {searchTerm
                    ? "Petani tidak ditemukan"
                    : "Tidak ada petani tersedia"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Tampilkan semua petani
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
