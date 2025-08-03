// src/app/dashboard/proyek/[id]/edit/components/FaseManagement.tsx
"use client";

import { Camera, Edit3, Plus, Trash2 } from "lucide-react";
import { FaseFormData } from "../page"; // Tipe diimpor dari page

interface FaseManagementProps {
  faseList: FaseFormData[];
  onAdd: () => void;
  onEdit: (fase: FaseFormData) => void;
  onDelete: (faseId: string) => void;
}

export const FaseManagement = ({
  faseList,
  onAdd,
  onEdit,
  onDelete,
}: FaseManagementProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Fase Proyek</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={16} />
          Tambah Fase
        </button>
      </div>

      {faseList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>
            Belum ada fase. Tambahkan fase pertama untuk memulai dokumentasi
            proyek.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {faseList
            .sort((a, b) => a.urutan - b.urutan)
            .map((fase) => (
              <div
                key={fase.id || fase.nama}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {fase.urutan}
                    </span>
                    <div>
                      <h3 className="font-medium">{fase.nama}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {fase.cerita}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Camera size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {fase.gambar.length} foto
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(fase)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <Edit3 size={16} />
                  </button>
                  {fase.id && (
                    <button
                      onClick={() => onDelete(fase.id!)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
