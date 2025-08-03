// src/app/dashboard/produk/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { StatusProduk } from "@prisma/client";
import { ArrowLeft, Save, Trash2, Upload, X } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";

const EditProdukPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

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
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/produk/${productId}`);
        if (!res.ok) throw new Error("Gagal memuat produk");
        const data = await res.json();
        setFormData({
          ...data,
          estimasiPanen: data.estimasiPanen
            ? new Date(data.estimasiPanen).toISOString().split("T")[0]
            : "",
        });
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data produk.");
        router.push("/dashboard/produk");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, router]);

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
    /* Logic sama seperti halaman tambah */
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
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/produk/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Gagal memperbarui produk");
      alert("Produk berhasil diperbarui!");
      router.push("/dashboard/produk");
    } catch (error) {
      console.error(error);
      alert("Error: Gagal memperbarui produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm("Apakah Anda yakin ingin menghapus produk ini secara permanen?")
    )
      return;
    try {
      const res = await fetch(`/api/produk/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus produk");
      alert("Produk berhasil dihapus.");
      router.push("/dashboard/produk");
    } catch (error) {
      alert("Gagal menghapus produk.");
    }
  };

  if (loading)
    return <div className="text-center py-10">Memuat data produk...</div>;

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
          <h1 className="text-2xl font-bold">Edit Produk</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 size={16} /> Hapus
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Save size={16} /> {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      {/* Form Fields (Sama seperti halaman tambah) */}
      <div className="bg-white p-6 border rounded-xl space-y-4">
        <div>
          <label className="block text-sm font-medium">Nama Produk*</label>
          <input
            type="text"
            name="namaProduk"
            value={formData.namaProduk}
            onChange={handleInputChange}
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Deskripsi*</label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full p-3 border rounded-lg"
          ></textarea>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Harga (Rp)*</label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stok Tersedia*</label>
            <input
              type="number"
              name="stokTersedia"
              value={formData.stokTersedia}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Unit*</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
            >
              {Object.values(StatusProduk).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Estimasi Panen</label>
            <input
              type="date"
              name="estimasiPanen"
              value={formData.estimasiPanen}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Foto Produk</label>
          <FileDropzone
            onFilesDrop={handleImageUpload}
            id="file-upload"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload gambar produk (maksimal 5 gambar).
          </p>
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
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

export default EditProdukPage;
