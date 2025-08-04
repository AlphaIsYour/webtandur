// src/app/dashboard/produk/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatusProduk } from "@prisma/client";
import { ArrowLeft, Save, Trash2, Upload, X } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import toast from "react-hot-toast";

const EditProdukPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [productId, setProductId] = useState<string>("");

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
    const initParams = async () => {
      const resolvedParams = await params;
      setProductId(resolvedParams.id);
    };
    initParams();
  }, [params]);

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
        toast.error("Gagal memuat data produk");
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
    const uploadData = new FormData();
    Array.from(files).forEach((file) => uploadData.append("images", file));

    const uploadPromise = fetch("/api/upload", {
      method: "POST",
      body: uploadData,
    });

    toast.promise(uploadPromise, {
      loading: "Uploading gambar...",
      success: "Gambar berhasil diupload!",
      error: "Gagal upload gambar",
    });

    try {
      const res = await uploadPromise;
      if (!res.ok) throw new Error("Upload gagal");
      const { urls } = await res.json();
      setFormData((prev) => ({ ...prev, fotoUrl: [...prev.fotoUrl, ...urls] }));
    } catch (error) {
      console.error(error);
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

    const updatePromise = fetch(`/api/produk/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    toast.promise(updatePromise, {
      loading: "Memperbarui produk...",
      success: "Produk berhasil diperbarui!",
      error: "Gagal memperbarui produk",
    });

    try {
      const res = await updatePromise;
      if (!res.ok) throw new Error("Gagal memperbarui produk");
      router.push("/dashboard/produk");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = await new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col gap-2">
            <p className="font-medium">Yakin ingin menghapus produk ini?</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        ),
        { duration: Infinity }
      );
    });

    if (!confirmDelete) return;

    const deletePromise = fetch(`/api/produk/${productId}`, {
      method: "DELETE",
    });

    toast.promise(deletePromise, {
      loading: "Menghapus produk...",
      success: "Produk berhasil dihapus!",
      error: "Gagal menghapus produk",
    });

    try {
      const res = await deletePromise;
      if (!res.ok) throw new Error("Gagal menghapus produk");
      router.push("/dashboard/produk");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );

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

      {/* Form Fields */}
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
          <FileDropzone onFilesDrop={handleImageUpload} id="file-upload" />
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
