// src/components/DisplaySemuaProyek.tsx

"use client";

import React, { useState } from "react";
import DisplayProyek from "./DisplayProyek";
import { ProyekTani, FaseProyek } from "@prisma/client";
import Link from "next/link";

// Tipe untuk ProyekTani yang sudah include relasi fase (dengan gambar)
type ProyekWithFaseGambar = ProyekTani & {
  fase: { gambar: string[] }[];
};

// Tipe untuk ProyekTani lengkap dengan semua data fase
type ProyekWithFaseLengkap = ProyekTani & {
  fase: FaseProyek[];
};

// Props untuk komponen utama
interface DisplayProyekProps {
  proyek: ProyekWithFaseGambar[];
}

// Sub-komponen untuk satu kartu pratinjau
const KartuProyekPratinjau = ({ proyek }: { proyek: ProyekWithFaseGambar }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailProyekData, setDetailProyekData] =
    useState<ProyekWithFaseLengkap | null>(null);

  // Ambil gambar asli dari fase, dengan fallback ke gambar default
  const getDisplayImages = () => {
    // 1. Ambil semua URL gambar dari semua fase menjadi satu array
    // Gunakan optional chaining (?.) dan nullish coalescing (||) agar aman jika 'fase' tidak ada
    const projectImages = proyek.fase?.flatMap((fase) => fase.gambar) || [];

    // 2. Siapkan gambar default sebagai fallback
    const defaultImages = [
      "/images/placeholder-proyek.svg",
      "/images/placeholder-proyek.svg",
      "/images/placeholder-proyek.svg",
      "/images/placeholder-proyek.svg",
      "/images/placeholder-proyek.svg",
    ];

    // 3. Gabungkan gambar proyek dengan gambar default, dan ambil 5 yang pertama.
    // Ini memastikan kita selalu punya 5 gambar untuk ditampilkan.
    return [...projectImages, ...defaultImages].slice(0, 5);
  };

  const displayImages = getDisplayImages();

  const handleOpenDetail = async () => {
    try {
      const res = await fetch(`/api/proyek/${proyek.id}`);
      if (!res.ok) throw new Error("Gagal mengambil detail proyek");
      const data: ProyekWithFaseLengkap = await res.json();
      setDetailProyekData(data);
      setShowDetail(true);
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("Error fetching project details:", error);
      alert("Tidak dapat memuat detail proyek.");
    }
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailProyekData(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="w-full p-2 max-w-10xl mx-auto bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden">
        <div
          className="relative h-80 cursor-pointer group"
          onClick={handleOpenDetail}
        >
          <div className="grid grid-cols-3 grid-rows-2 gap-1 h-full">
            {/* Gambar 1 */}
            <div className="row-span-2 relative rounded-l-lg overflow-hidden">
              <img
                src={displayImages[0]}
                alt={`${proyek.namaProyek} - Gambar 1`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder-proyek.svg"; // Ganti dengan gambar default jika gagal
                }}
              />
            </div>
            {/* Gambar 2 */}
            <div className="relative overflow-hidden">
              <img
                src={displayImages[1]}
                alt={`${proyek.namaProyek} - Gambar 2`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/iamges/placeholder-proyek.svg"; // Ganti dengan gambar default jika gagal
                }}
              />
            </div>
            {/* Gambar 3 */}
            <div className="relative rounded-tr-lg overflow-hidden">
              <img
                src={displayImages[2]}
                alt={`${proyek.namaProyek} - Gambar 3`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/proyek/3.jpg";
                }}
              />
            </div>
            {/* Gambar 4 */}
            <div className="relative overflow-hidden">
              <img
                src={displayImages[3]}
                alt={`${proyek.namaProyek} - Gambar 4`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/proyek/4.jpg";
                }}
              />
            </div>
            {/* Gambar 5 */}
            <div className="relative rounded-br-lg overflow-hidden">
              <img
                src={displayImages[4]}
                alt={`${proyek.namaProyek} - Gambar 5`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/proyek/5.jpg";
                }}
              />
            </div>
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-medium px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Lihat Detail
            </span>
          </div>

          <div className="absolute bottom-4 right-4 bg-white rounded-lg p-4 shadow-lg max-w-xs">
            <h3 className="font-bold text-lg text-slate-900 line-clamp-1 mb-2">
              {proyek.namaProyek}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
              {proyek.deskripsi}
            </p>
            <div className="flex flex-col gap-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full self-start ${
                  proyek.status === "PANEN"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {proyek.status}
              </span>
              <Link
                href={`/dashboard/proyek/${proyek.id}/edit`}
                className="text-center bg-slate-800 text-white py-2 px-4 rounded-md hover:bg-slate-900 transition text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                Kelola Proyek
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showDetail && detailProyekData && (
        <DisplayProyek proyek={detailProyekData} onClose={handleCloseDetail} />
      )}
    </>
  );
};

// Komponen Utama: DisplaySemuaProyek dengan Pagination
export default function DisplaySemuaProyek({ proyek }: DisplayProyekProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(proyek.length / itemsPerPage);
  const currentProyek = proyek.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (proyek.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">Anda belum memiliki proyek.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        {currentProyek.map((item) => (
          <KartuProyekPratinjau key={item.id} proyek={item} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 py-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md bg-white text-gray-600 hover:bg-gray-50 border disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && goToPage(page)}
              disabled={typeof page === "string"}
              className={`px-3 py-2 rounded-md ${
                page === currentPage
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border"
              } disabled:bg-transparent disabled:text-gray-400 disabled:cursor-default`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md bg-white text-gray-600 hover:bg-gray-50 border disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      )}

      <div className="text-center text-sm text-gray-500">
        Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
        {Math.min(currentPage * itemsPerPage, proyek.length)} dari{" "}
        {proyek.length} proyek
      </div>
    </div>
  );
}
