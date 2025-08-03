// src/app/dashboard/proyek/[id]/edit/components/UpdateEditorModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { FarmingUpdate } from "@prisma/client";
import FileDropzone from "@/components/FileDropzone";

// Tipe data form untuk update
type UpdateFormData = Omit<FarmingUpdate, "id" | "proyekTaniId" | "createdAt">;

interface UpdateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateFormData) => void;
}

export const UpdateEditorModal = ({
  isOpen,
  onClose,
  onSave,
}: UpdateEditorModalProps) => {
  const [formData, setFormData] = useState<UpdateFormData>({
    judul: "",
    deskripsi: "",
    fotoUrl: [],
  });

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (files: FileList) => {
    const uploadData = new FormData();
    Array.from(files).forEach((file) => uploadData.append("images", file));
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const { urls } = await res.json();
      setFormData((prev) => ({ ...prev, fotoUrl: [...prev.fotoUrl, ...urls] }));
    } catch (error) {
      alert("Gagal mengupload gambar.");
    }
  };

  const handleRemoveImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      fotoUrl: prev.fotoUrl.filter((img) => img !== url),
    }));
  };

  const handleSaveClick = () => {
    onSave(formData);
    // Reset form setelah simpan
    setFormData({ judul: "", deskripsi: "", fotoUrl: [] });
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tambah Jurnal Tani</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Judul Update</label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Contoh: Penyiraman Pagi Hari"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Deskripsi</label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                rows={4}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Ceritakan kegiatan yang dilakukan..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Foto Dokumentasi
              </label>
              <FileDropzone
                onFilesDrop={handleImageUpload}
                id="file-upload"
              />
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
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg">
              Batal
            </button>
            <button
              onClick={handleSaveClick}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Simpan Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
