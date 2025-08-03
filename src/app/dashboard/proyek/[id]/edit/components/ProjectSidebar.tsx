// src/app/dashboard/proyek/[id]/edit/components/ProjectSidebar.tsx
"use client";

import { useRouter } from "next/navigation";
import { Eye, Plus } from "lucide-react";
import { StatusProyek } from "@prisma/client";
import { FaseFormData } from "../page"; // Tipe diimpor dari page

interface ProjectSidebarProps {
  proyekId: string;
  faseList: FaseFormData[];
  status: StatusProyek;
}

export const ProjectSidebar = ({
  proyekId,
  faseList,
  status,
}: ProjectSidebarProps) => {
  const router = useRouter();

  const totalFoto = faseList.reduce(
    (total, fase) => total + fase.gambar.length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Aksi Cepat</h3>
        <div className="space-y-3">
          <button
            onClick={() => router.push(`/dashboard/proyek/${proyekId}`)}
            className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 flex items-center gap-3"
          >
            <Eye size={16} className="text-gray-600" />
            <span>Lihat Halaman Proyek</span>
          </button>
          <button
            onClick={() => router.push(`/dashboard/proyek/${proyekId}/produk`)}
            className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 flex items-center gap-3"
          >
            <Plus size={16} className="text-gray-600" />
            <span>Kelola Produk</span>
          </button>
        </div>
      </div>

      {/* Statistik */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Statistik</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Fase</span>
            <span className="font-medium">{faseList.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Foto</span>
            <span className="font-medium">{totalFoto}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span
              className={`px-2 py-1 text-xs rounded-full capitalize ${
                status === StatusProyek.PANEN
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {status.toLowerCase().replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
