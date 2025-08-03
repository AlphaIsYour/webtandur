// src/app/dashboard/proyek/[id]/edit/components/ProjectInfoForm.tsx
"use client";

import { StatusProyek } from "@prisma/client";

export interface FormData {
  namaProyek: string;
  deskripsi: string;
  lokasiLahan: string;
  status: StatusProyek;
}

interface ProjectInfoFormProps {
  formData: FormData;
  onFormChange: (field: keyof FormData, value: string | StatusProyek) => void;
}

export const ProjectInfoForm = ({
  formData,
  onFormChange,
}: ProjectInfoFormProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-lg font-semibold mb-4">Informasi Dasar</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Proyek
          </label>
          <input
            type="text"
            value={formData.namaProyek}
            onChange={(e) => onFormChange("namaProyek", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Masukkan nama proyek"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            value={formData.deskripsi}
            onChange={(e) => onFormChange("deskripsi", e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Masukkan deskripsi proyek"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lokasi Lahan
          </label>
          <input
            type="text"
            value={formData.lokasiLahan}
            onChange={(e) => onFormChange("lokasiLahan", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Masukkan lokasi lahan"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Proyek
          </label>
          <select
            value={formData.status}
            onChange={(e) => {
              onFormChange("status", e.target.value as StatusProyek);
            }}
          >
            {Object.values(StatusProyek).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
