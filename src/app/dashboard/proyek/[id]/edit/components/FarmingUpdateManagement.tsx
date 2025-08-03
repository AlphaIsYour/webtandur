// src/app/dashboard/proyek/[id]/edit/components/FarmingUpdateManagement.tsx
"use client";

import { Plus, BookOpen, Camera, Edit, Trash2, Save, X } from "lucide-react";
import { FarmingUpdate } from "@prisma/client";
import { useState } from "react";

interface FarmingUpdateManagementProps {
  updates: FarmingUpdate[];
  onAdd: () => void;
  onUpdate?: () => void; // callback untuk refresh data
}

export const FarmingUpdateManagement = ({
  updates,
  onAdd,
  onUpdate,
}: FarmingUpdateManagementProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ judul: "", deskripsi: "" });
  const [loading, setLoading] = useState<string | null>(null);

  const handleEdit = (update: FarmingUpdate) => {
    setEditingId(update.id);
    setEditData({ judul: update.judul, deskripsi: update.deskripsi });
  };

  const handleSave = async (updateId: string) => {
    setLoading(updateId);
    try {
      const response = await fetch(`/api/farming-updatee/${updateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!response.ok) throw new Error("Gagal update");

      setEditingId(null);
      onUpdate?.(); // refresh data
    } catch (error) {
      console.error("Error updating:", error);
      alert("Gagal mengupdate data");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (updateId: string) => {
    if (!confirm("Yakin ingin menghapus update ini?")) return;

    setLoading(updateId);
    try {
      const response = await fetch(`/api/farming-updatee/${updateId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Gagal hapus");

      onUpdate?.(); // refresh data
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Gagal menghapus data");
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ judul: "", deskripsi: "" });
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Jurnal Tani (Log Kegiatan)</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={16} />
          Tambah Update
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {updates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen size={32} className="mx-auto" />
            <p className="mt-2">Belum ada jurnal/update kegiatan.</p>
          </div>
        ) : (
          updates.map((update) => (
            <div key={update.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    {new Date(update.createdAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {editingId === update.id ? (
                    <div className="space-y-2 mt-2">
                      <input
                        type="text"
                        value={editData.judul}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            judul: e.target.value,
                          }))
                        }
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                        placeholder="Judul update"
                      />
                      <textarea
                        value={editData.deskripsi}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            deskripsi: e.target.value,
                          }))
                        }
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 resize-none"
                        rows={3}
                        placeholder="Deskripsi update"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-gray-800 mt-1">
                        {update.judul}
                      </h3>
                      <p className="text-gray-600 mt-2 text-sm">
                        {update.deskripsi}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {editingId === update.id ? (
                    <>
                      <button
                        onClick={() => handleSave(update.id)}
                        disabled={loading === update.id}
                        className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={loading === update.id}
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(update)}
                        disabled={loading === update.id}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(update.id)}
                        disabled={loading === update.id}
                        className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {update.fotoUrl.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <Camera size={14} />
                  <span>{update.fotoUrl.length} foto</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
