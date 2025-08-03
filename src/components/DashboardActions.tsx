// src/components/DashboardActions.tsx

"use client"; // Komponen ini butuh state, jadi harus client component

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormProyekBaru from "./FormProyekBaru"; // Asumsi path ini benar

export default function DashboardActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setIsModalOpen(false);
    // Cara paling efisien untuk refresh data di Server Component
    router.refresh();
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Proyek Anda</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
        >
          + Buat Proyek Baru
        </button>
      </div>

      {isModalOpen && (
        <FormProyekBaru
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
