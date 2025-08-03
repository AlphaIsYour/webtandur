// src/app/dashboard/proyek/[id]/edit/components/FaseEditorModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { FaseFormData } from "../page";
import FileDropzone from "@/components/FileDropzone";

interface FaseEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faseData: FaseFormData) => void;
  initialData: FaseFormData | null;
  onImageUpload: (files: FileList) => Promise<string[]>;
}

export const FaseEditorModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  onImageUpload,
}: FaseEditorModalProps) => {
  const [faseData, setFaseData] = useState<FaseFormData | null>(initialData);

  useEffect(() => {
    // Sync state internal dengan props saat modal dibuka atau initialData berubah
    setFaseData(initialData);
  }, [initialData]);

  if (!isOpen || !faseData) return null;

  const handleInputChange = (
    field: keyof Omit<FaseFormData, "gambar">,
    value: string | number
  ) => {
    setFaseData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const generateSlug = (nama: string) => {
    return nama
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (nama: string) => {
    setFaseData((prev) =>
      prev ? { ...prev, nama, slug: generateSlug(nama) } : null
    );
  };

  const handleFileUpload = async (files: FileList) => {
    const urls = await onImageUpload(files);
    if (urls.length > 0) {
      setFaseData((prev) =>
        prev ? { ...prev, gambar: [...prev.gambar, ...urls] } : null
      );
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setFaseData((prev) =>
      prev
        ? { ...prev, gambar: prev.gambar.filter((img) => img !== imageUrl) }
        : null
    );
  };

  const handleSaveClick = () => {
    if (faseData) {
      onSave(faseData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {faseData.id ? "Edit Fase" : "Tambah Fase"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Fase
                </label>
                <input
                  type="text"
                  value={faseData.nama}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Contoh: Persiapan Lahan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urutan
                </label>
                <input
                  type="number"
                  value={faseData.urutan}
                  onChange={(e) =>
                    handleInputChange("urutan", parseInt(e.target.value) || 1)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  min="1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cerita
              </label>
              <textarea
                value={faseData.cerita}
                onChange={(e) => handleInputChange("cerita", e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Ceritakan apa yang dilakukan pada fase ini..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Fase
              </label>
              <FileDropzone
                onFilesDrop={handleFileUpload}
                id="fase-images"
              />
              {faseData.gambar.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {faseData.gambar.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Fase ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveImage(imageUrl)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleSaveClick}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Simpan Fase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
