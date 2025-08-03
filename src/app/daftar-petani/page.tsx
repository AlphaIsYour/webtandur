"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface FormData {
  nama: string;
  email: string;
  username: string;
  bio: string;
  lokasi: string;
  linkWhatsapp: string;
  alasanMenjadi: string;
  pengalamanBertani: string;
  jenisKomoditas: string;
  luasLahan: string;
  lokasiLahan: string;
  sertifikatLahan?: File[];
  fotoKTP?: File;
  fotoProfil?: File;
}

export default function DaftarPetaniPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nama: session?.user?.name || "",
    email: session?.user?.email || "",
    username: "",
    bio: "",
    lokasi: "",
    linkWhatsapp: "",
    alasanMenjadi: "",
    pengalamanBertani: "",
    jenisKomoditas: "",
    luasLahan: "",
    lokasiLahan: "",
  });

  const [files, setFiles] = useState<{
    sertifikatLahan: File[];
    fotoKTP?: File;
    fotoProfil?: File;
  }>({
    sertifikatLahan: [],
  });

  // Redirect jika belum login
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setFiles((prev) => ({
        ...prev,
        sertifikatLahan: filesArray,
      }));
    }
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      return result.url;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Upload files first
      const uploadedFiles: any = {};

      if (files.fotoProfil) {
        const urls = await uploadFiles([files.fotoProfil]);
        uploadedFiles.fotoProfil = urls[0];
      }

      if (files.fotoKTP) {
        const urls = await uploadFiles([files.fotoKTP]);
        uploadedFiles.fotoKTP = urls[0];
      }

      if (files.sertifikatLahan.length > 0) {
        uploadedFiles.sertifikatLahan = await uploadFiles(
          files.sertifikatLahan
        );
      }

      // Submit form data
      const response = await fetch("/api/daftar-petani", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...uploadedFiles,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Terjadi kesalahan");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pendaftaran Berhasil!
            </h2>
            <p className="text-gray-600">
              Terima kasih telah mendaftar sebagai petani. Pendaftaran Anda
              sedang dalam proses review oleh admin. Kami akan menghubungi Anda
              melalui email dalam 1-3 hari kerja.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Daftar Sebagai Petani
            </h1>
            <p className="text-gray-600">
              Bergabunglah dengan komunitas petani kami dan mulai berbagi hasil
              panen Anda
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data Pribadi */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Data Pribadi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
                    required
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link WhatsApp *
                  </label>
                  <input
                    type="url"
                    name="linkWhatsapp"
                    value={formData.linkWhatsapp}
                    onChange={handleInputChange}
                    placeholder="https://wa.me/628123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi *
                  </label>
                  <input
                    type="text"
                    name="lokasi"
                    value={formData.lokasi}
                    onChange={handleInputChange}
                    placeholder="Contoh: Surabaya, Jawa Timur"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio/Deskripsi Diri *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Ceritakan tentang diri Anda..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Data Pertanian */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Data Pertanian
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alasan Ingin Menjadi Petani *
                  </label>
                  <textarea
                    name="alasanMenjadi"
                    value={formData.alasanMenjadi}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Jelaskan motivasi Anda..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pengalaman Bertani *
                  </label>
                  <textarea
                    name="pengalamanBertani"
                    value={formData.pengalamanBertani}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Ceritakan pengalaman bertani Anda (jika ada)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Komoditas yang akan ditanam *
                  </label>
                  <input
                    type="text"
                    name="jenisKomoditas"
                    value={formData.jenisKomoditas}
                    onChange={handleInputChange}
                    placeholder="Contoh: Padi, Jagung, Sayuran"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Luas Lahan (m²) *
                  </label>
                  <input
                    type="text"
                    name="luasLahan"
                    value={formData.luasLahan}
                    onChange={handleInputChange}
                    placeholder="Contoh: 1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi Lahan *
                  </label>
                  <input
                    type="text"
                    name="lokasiLahan"
                    value={formData.lokasiLahan}
                    onChange={handleInputChange}
                    placeholder="Alamat lengkap lokasi lahan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Upload Dokumen */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Dokumen
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Profil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "fotoProfil")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG. Maksimal 5MB
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto KTP *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "fotoKTP")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG. Maksimal 5MB
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sertifikat/Dokumen Lahan
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handleMultipleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG, PDF. Maksimal 5MB per file
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agreement"
                required
                className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="agreement" className="text-sm text-gray-700">
                Saya menyetujui bahwa data yang saya berikan adalah benar dan
                dapat dipertanggungjawabkan. Saya juga menyetujui{" "}
                <a href="/terms" className="text-green-600 hover:underline">
                  syarat dan ketentuan
                </a>{" "}
                yang berlaku.
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Memproses..." : "Daftar Sebagai Petani"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
