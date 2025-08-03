// src/app/dashboard/proyek/[id]/edit/components/ProdukEditorModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Upload, X, Calendar, Package, DollarSign, Scale } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";

export interface ProdukFormData {
  id?: string;
  namaProduk: string;
  deskripsi: string;
  fotoUrl: string[];
  harga: number;
  unit: string;
  stokTersedia: number;
  status: "TERSEDIA" | "PREORDER" | "HABIS";
  estimasiPanen: string | null; // ISO string format for datetime-local input
  proyekTaniId: string;
}

interface ProdukEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (produkData: ProdukFormData) => void;
  initialData: ProdukFormData | null;
  onImageUpload: (files: FileList) => Promise<string[]>;
  proyekId: string;
}

const statusOptions = [
  {
    value: "TERSEDIA",
    label: "Tersedia",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "PREORDER",
    label: "Pre-order",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "HABIS", label: "Habis", color: "bg-red-100 text-red-800" },
];

const unitOptions = [
  "kg",
  "gram",
  "ton",
  "liter",
  "ml",
  "pcs",
  "ikat",
  "karung",
  "dus",
  "pack",
];

export const ProdukEditorModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  onImageUpload,
  proyekId,
}: ProdukEditorModalProps) => {
  const [produkData, setProdukData] = useState<ProdukFormData>({
    namaProduk: "",
    deskripsi: "",
    fotoUrl: [],
    harga: 0,
    unit: "kg",
    stokTersedia: 0,
    status: "TERSEDIA",
    estimasiPanen: null,
    proyekTaniId: proyekId,
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProdukData(initialData);
    } else {
      setProdukData({
        namaProduk: "",
        deskripsi: "",
        fotoUrl: [],
        harga: 0,
        unit: "kg",
        stokTersedia: 0,
        status: "TERSEDIA",
        estimasiPanen: null,
        proyekTaniId: proyekId,
      });
    }
  }, [initialData, proyekId]);

  if (!isOpen) return null;

  const handleInputChange = (
    field: keyof ProdukFormData,
    value: string | number
  ) => {
    setProdukData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const urls = await onImageUpload(files);
      if (urls.length > 0) {
        setProdukData((prev) => ({
          ...prev,
          fotoUrl: [...prev.fotoUrl, ...urls],
        }));
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setProdukData((prev) => ({
      ...prev,
      fotoUrl: prev.fotoUrl.filter((img) => img !== imageUrl),
    }));
  };

  const handleSaveClick = () => {
    // Basic validation
    if (!produkData.namaProduk.trim()) {
      alert("Nama produk harus diisi");
      return;
    }
    if (!produkData.deskripsi.trim()) {
      alert("Deskripsi produk harus diisi");
      return;
    }
    if (produkData.harga <= 0) {
      alert("Harga harus lebih dari 0");
      return;
    }
    if (produkData.stokTersedia < 0) {
      alert("Stok tidak boleh negatif");
      return;
    }

    onSave(produkData);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {produkData.id ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Nama Produk */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="inline w-4 h-4 mr-1" />
                Nama Produk
              </label>
              <input
                type="text"
                value={produkData.namaProduk}
                onChange={(e) =>
                  handleInputChange("namaProduk", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Contoh: Beras Organik Premium"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Produk
              </label>
              <textarea
                value={produkData.deskripsi}
                onChange={(e) => handleInputChange("deskripsi", e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Jelaskan detail produk, kualitas, dan keunggulannya..."
              />
            </div>

            {/* Harga dan Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Harga
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={produkData.harga}
                    onChange={(e) =>
                      handleInputChange("harga", parseInt(e.target.value) || 0)
                    }
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
                {produkData.harga > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatRupiah(produkData.harga)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Scale className="inline w-4 h-4 mr-1" />
                  Satuan
                </label>
                <select
                  value={produkData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {unitOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stok dan Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok Tersedia
                </label>
                <input
                  type="number"
                  value={produkData.stokTersedia}
                  onChange={(e) =>
                    handleInputChange(
                      "stokTersedia",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={produkData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusOptions.find((s) => s.value === produkData.status)
                        ?.color
                    }`}
                  >
                    {
                      statusOptions.find((s) => s.value === produkData.status)
                        ?.label
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Estimasi Panen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Estimasi Panen (Opsional)
              </label>
              <input
                type="datetime-local"
                value={produkData.estimasiPanen || ""}
                onChange={(e) =>
                  handleInputChange("estimasiPanen", e.target.value || "")
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Upload Foto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Produk
              </label>
              <FileDropzone
               onFilesDrop={handleFileUpload}
               id="produk-images"
              />

              {produkData.fotoUrl.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Foto yang diupload ({produkData.fotoUrl.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {produkData.fotoUrl.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Produk ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => handleRemoveImage(imageUrl)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSaveClick}
              disabled={isUploading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? "Mengupload..." : "Simpan Produk"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
