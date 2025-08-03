// app/dashboard/proyek/page.tsx

"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import FormProyekBaru from "@/components/FormProyekBaru";
import DisplaySemuaProyek from "@/components/DisplaySemuaProyek";

export default function ProyekDashboardPage() {
  const [proyek, setProyek] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Placeholder modal
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch proyek dengan include fase
      const res = await fetch("/api/proyek?include=fase");
      if (!res.ok) throw new Error("Gagal mengambil data");

      const data = await res.json();

      // Transform data jika perlu untuk memastikan struktur yang tepat
      const proyekData =
        data.data?.map((p: any) => ({
          ...p,
          fase: p.fase || [], // Pastikan fase selalu ada, minimal array kosong
        })) || [];

      setProyek(proyekData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set data kosong jika error
      setProyek([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-slate-500">Memuat proyek...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-5 lg:p-4 sm:p-6 ">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-3xl font-bold text-slate-800">
          Proyek Tani Anda
        </h1>
        <Button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          onClick={() => setIsModalOpen(true)}
        >
          + Tambah Proyek
        </Button>
      </div>

      <div className="">
        <DisplaySemuaProyek proyek={proyek} />
      </div>

      {isModalOpen && (
        <div className="p-4 bg-white rounded shadow mt-6 text-sm text-slate-500">
          <FormProyekBaru
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              // Placeholder for success handling
              setIsModalOpen(false);
              alert("Proyek berhasil dibuat!");
              fetchData(); // Refresh data after success
            }}
          />
        </div>
      )}
    </div>
  );
}
