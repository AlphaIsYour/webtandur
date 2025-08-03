// src/app/dashboard/produk/baru/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProyekTani, StatusProduk } from "@prisma/client";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

const TambahProdukPage = () => {
  const router = useRouter();
  const [proyekList, setProyekList] = useState<ProyekTani[]>([]);
  const [formData, setFormData] = useState({
    namaProduk: "",
    deskripsi: "",
    harga: 0,
    unit: "kg",
    stokTersedia: 0,
    status: StatusProduk.TERSEDIA,
    estimasiPanen: "",
    fotoUrl: [] as string[],
    proyekTaniId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch proyek tani milik user untuk dropdown
    const fetchProyek = async () => {
      try {
        const res = await fetch("/api/proyek");
        const responseData = await res.json();
        // Pastikan yang di-set ke state adalah sebuah array
        setProyekList(Array.isArray(responseData) ? responseData : []);
      } catch (error) {
        console.error("Gagal mengambil daftar proyek:", error);
      }
    };
    fetchProyek();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const isNumber = name === "harga" || name === "stokTersedia";
    setFormData((prev) => ({
      ...prev,
      [name]: isNumber ? Number(value) : value,
    }));
  };

  const handleImageUpload = async (files: FileList) => {
    const uploadData = new FormData();
    Array.from(files).forEach((file) => uploadData.append("images", file));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      if (!res.ok) throw new Error("Upload gagal");
      const { urls } = await res.json();
      setFormData((prev) => ({ ...prev, fotoUrl: [...prev.fotoUrl, ...urls] }));
    } catch (error) {
      console.error("Error upload gambar:", error);
      alert("Gagal upload gambar.");
    }
  };

  const handleRemoveImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      fotoUrl: prev.fotoUrl.filter((img) => img !== url),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.proyekTaniId) {
      alert("Pilih proyek tani asal produk.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/produk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menyimpan produk");
      }

      alert("Produk berhasil ditambahkan!");
      router.push("/dashboard/produk");
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Tambah Produk Baru
            </h1>
            <p className="text-gray-500">
              Isi detail produk yang akan Anda jual.
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Save size={16} />
          {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </div>

      {/* Form Fields */}
      <div className="bg-white p-6 border rounded-xl space-y-4">
        {/* Proyek Asal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proyek Asal Produk*
          </label>
          <select
            name="proyekTaniId"
            value={formData.proyekTaniId}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="" disabled>
              -- Pilih Proyek Tani --
            </option>
            {proyekList.map((proyek) => (
              <option key={proyek.id} value={proyek.id}>
                {proyek.namaProyek}
              </option>
            ))}
          </select>
        </div>

        {/* Nama & Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Produk*
          </label>
          <input
            type="text"
            name="namaProduk"
            value={formData.namaProduk}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi*
          </label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg"
          ></textarea>
        </div>

        {/* Harga, Stok, Unit */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga (Rp)*
            </label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stok Tersedia*
            </label>
            <input
              type="number"
              name="stokTersedia"
              value={formData.stokTersedia}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit*
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="kg, ikat, buah"
            />
          </div>
        </div>

        {/* Status & Estimasi Panen */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Produk
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {Object.values(StatusProduk).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimasi Panen (jika pre-order)
            </label>
            <input
              type="date"
              name="estimasiPanen"
              value={formData.estimasiPanen}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Upload Foto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto Produk
          </label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              id="file-upload"
              className="hidden"
              onChange={(e) =>
                e.target.files && handleImageUpload(e.target.files)
              }
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-600">Klik untuk upload</span>
            </label>
          </div>
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {formData.fotoUrl.map((url, i) => (
              <div key={i} className="relative">
                <img
                  src={url}
                  alt={`Preview ${i}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default TambahProdukPage;
