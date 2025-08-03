// src/app/(dashboard)/dashboard/page.tsx
"use client";
import { Leaf, Package, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { ProyekTani } from "@prisma/client";
import FormProyekBaru from "@/components/FormProyekBaru";
import DisplaySemuaProyek from "@/components/DisplayProyekOverview";

type ProyekWithFaseGambar = ProyekTani & {
  fase: {
    gambar: string[];
  }[];
};

const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-xs md:text-sm font-medium text-slate-500">{title}</p>
      <div className={`rounded-full p-1.5 md:p-2 ${colorClass}`}>
        <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
      </div>
    </div>
    <p className="mt-2 text-xl md:text-3xl font-bold text-slate-800">{value}</p>
  </div>
);

export default function DashboardOverviewPage() {
  const [proyek, setProyek] = useState<ProyekWithFaseGambar[]>([]);
  const [stats, setStats] = useState({ proyekAktif: 0, totalProduk: 0 });
  const [aktivitasTerbaru, setAktivitasTerbaru] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/proyek?include=fase");
      if (!res.ok) throw new Error("Gagal mengambil data");

      const data = await res.json();

      const proyekData =
        data.data?.map((p: any) => ({
          ...p,
          fase: p.fase || [],
        })) || [];

      setProyek(proyekData);
      setStats({
        proyekAktif:
          proyekData.filter((p: any) => p.status !== "SELESAI").length || 0,
        totalProduk: 0,
      });
      setAktivitasTerbaru([]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setProyek([]);
      setStats({ proyekAktif: 0, totalProduk: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSuccess = () => {
    fetchData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-slate-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 md:space-y-8 p-5 lg:p-5 sm:p-6">
        {/* Grid untuk Kartu Statistik */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          <StatCard
            title="Proyek Aktif"
            value={stats.proyekAktif}
            icon={Leaf}
            colorClass="bg-green-500"
          />
          <StatCard
            title="Total Produk"
            value={stats.totalProduk}
            icon={Package}
            colorClass="bg-sky-500"
          />
          <StatCard
            title="Pengunjung Profil (30 hari)"
            value="-"
            icon={BarChart3}
            colorClass="bg-amber-500"
          />
        </div>

        {/* Area Aktivitas Terbaru */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800">
            Aktivitas Proyek Terbaru
          </h2>
          {aktivitasTerbaru.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {aktivitasTerbaru.map((update) => (
                <li key={update.id} className="flex flex-col">
                  <span className="font-semibold text-slate-700">
                    {update.judul}
                  </span>
                  <span className="text-sm text-slate-500">
                    di Proyek '{update.proyekTani.namaProyek}' -{" "}
                    {new Date(update.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-slate-500">
              Belum ada aktivitas terbaru yang bisa ditampilkan.
            </p>
          )}
        </div>

        {/* Header Section dengan Tombol Buat Proyek */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            Proyek Anda
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold transition-colors text-sm md:text-base"
          >
            + Buat Proyek Baru
          </button>
        </div>
        <DisplaySemuaProyek proyek={proyek} />
      </div>

      {/* Modal Form Proyek Baru */}
      {isModalOpen && (
        <FormProyekBaru
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
