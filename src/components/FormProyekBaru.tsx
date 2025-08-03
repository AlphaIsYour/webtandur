// src/components/FormProyekBaru.tsx

"use client";

import { useState } from "react";

// Props: fungsi untuk menutup modal dan fungsi untuk memberitahu parent bahwa ada data baru
interface FormProyekBaruProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function FormProyekBaru({
  onClose,
  onSuccess,
}: FormProyekBaruProps) {
  const [namaProyek, setNamaProyek] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [lokasiLahan, setLokasiLahan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/proyek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namaProyek, deskripsi, lokasiLahan }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat proyek");
      }

      // Jika sukses
      onSuccess(); // Panggil fungsi sukses (untuk refresh data di parent)
      onClose(); // Tutup modal
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Background Overlay
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-40 flex items-center justify-center">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Buat Proyek Baru
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="namaProyek"
              className="block text-sm font-medium text-slate-700"
            >
              Nama Proyek
            </label>
            <input
              id="namaProyek"
              type="text"
              value={namaProyek}
              onChange={(e) => setNamaProyek(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="deskripsi"
              className="block text-sm font-medium text-slate-700"
            >
              Deskripsi Singkat
            </label>
            <textarea
              id="deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="lokasiLahan"
              className="block text-sm font-medium text-slate-700"
            >
              Lokasi Lahan
            </label>
            <input
              id="lokasiLahan"
              type="text"
              value={lokasiLahan}
              onChange={(e) => setLokasiLahan(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-slate-400"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Proyek"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
