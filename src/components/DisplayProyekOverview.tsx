"use client";

import { ProyekTani } from "@prisma/client";
import Link from "next/link";

// Tipe untuk ProyekTani yang sudah include relasi fase (dengan gambar)
type ProyekWithFaseGambar = ProyekTani & {
  fase: { gambar: string[] }[];
};

// Props untuk komponen utama
interface DisplayProyekOverviewProps {
  proyek: ProyekWithFaseGambar[]; // Menerima proyek dengan fase gambar
  maxItems?: number; // Maksimal item yang ditampilkan
}

// Sub-komponen untuk satu kartu pratinjau overview
const KartuProyekOverview = ({ proyek }: { proyek: ProyekWithFaseGambar }) => {
  // Logika untuk mendapatkan satu gambar pratinjau
  const getPreviewImage = () => {
    const defaultImage = "/proyek/1.jpg";

    // Cek jika proyek punya fase dan fase pertama punya gambar
    if (
      proyek.fase &&
      proyek.fase.length > 0 &&
      proyek.fase[0].gambar.length > 0
    ) {
      return proyek.fase[0].gambar[0];
    }

    // Jika tidak ada gambar sama sekali, pakai default
    return defaultImage;
  };

  const previewImage = getPreviewImage();

  return (
    <Link href={`/dashboard/proyek/${proyek.id}/edit`} className="block">
      <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        {/* Thumbnail Gambar */}
        <div className="w-full h-32 rounded-lg bg-gray-200 overflow-hidden mb-3">
          <img
            src={previewImage}
            alt={proyek.namaProyek}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "/proyek/1.jpg";
            }}
          />
        </div>

        {/* Info Proyek */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 line-clamp-1">
            {proyek.namaProyek}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {proyek.deskripsi}
          </p>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                proyek.status === "PANEN"
                  ? "bg-green-100 text-green-800"
                  : proyek.status === "PENANAMAN"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {proyek.status}
            </span>

            {/* Jumlah Fase */}
            <span className="text-xs text-gray-500">
              {proyek.fase?.length || 0} fase
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Komponen Utama: DisplayProyekOverview
export default function DisplayProyekOverview({
  proyek,
  maxItems = 6,
}: DisplayProyekOverviewProps) {
  // Ambil proyek sesuai dengan maxItems
  const displayedProyek = proyek.slice(0, maxItems);

  if (proyek.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-500 mb-4">Belum ada proyek</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Proyek Terbaru</h2>
        {proyek.length > maxItems && (
          <Link
            href="/dashboard/proyek"
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Lihat Semua →
          </Link>
        )}
      </div>

      {/* Grid Proyek */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedProyek.map((item) => (
          <KartuProyekOverview key={item.id} proyek={item} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Link
          href="/dashboard/proyek"
          className="flex-1 py-2 text-center border bg-green-600 border-gray-300 rounded-lg hover:bg-green-700 transition-colors text-white font-medium"
        >
          Kelola Proyek
        </Link>
      </div>
    </div>
  );
}
