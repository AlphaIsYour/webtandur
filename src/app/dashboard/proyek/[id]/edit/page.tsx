// src/app/dashboard/proyek/[id]/edit/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  ProyekTani,
  FaseProyek,
  StatusProyek,
  FarmingUpdate,
} from "@prisma/client";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

// Import komponen anak
import { ProjectInfoForm, type FormData } from "./components/ProjectInfoForm";
import { FaseManagement } from "./components/FaseManagement";
import { ProjectSidebar } from "./components/ProjectSidebar";
import { FaseEditorModal } from "./components/FaseEditorModal";
import {
  ProdukEditorModal,
  type ProdukFormData,
} from "./components/ProdukEditorModal";
import { FarmingUpdateManagement } from "./components/FarmingUpdateManagement";
import { UpdateEditorModal } from "./components/UpdateEditorModal";

// Tipe data
type ProyekWithFase = ProyekTani & { fase: FaseProyek[] };
export interface FaseFormData {
  id?: string;
  nama: string;
  slug: string;
  cerita: string;
  gambar: string[];
  urutan: number;
}

const EditProyekPage = () => {
  const params = useParams();
  const router = useRouter();
  const proyekId = params.id as string;

  // State
  const [proyek, setProyek] = useState<ProyekWithFase | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    namaProyek: "",
    deskripsi: "",
    lokasiLahan: "",
    status: StatusProyek.PERSIAPAN,
  });

  const [faseList, setFaseList] = useState<FaseFormData[]>([]);
  const [editingFase, setEditingFase] = useState<FaseFormData | null>(null);
  const [showFaseModal, setShowFaseModal] = useState(false);

  const [produkList, setProdukList] = useState<ProdukFormData[]>([]);
  const [editingProduk, setEditingProduk] = useState<ProdukFormData | null>(
    null
  );
  const [showProdukModal, setShowProdukModal] = useState(false);

  const [updates, setUpdates] = useState<FarmingUpdate[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Fetch data
  useEffect(() => {
    if (!proyekId) return;
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [proyekRes, updatesRes] = await Promise.all([
          fetch(`/api/proyek/${proyekId}`),
          fetch(`/api/proyek/${proyekId}/update`),
        ]);

        if (!proyekRes.ok) throw new Error("Gagal mengambil data proyek");
        const dataProyek: ProyekWithFase = await proyekRes.json();
        setProyek(dataProyek);
        setFormData({
          namaProyek: dataProyek.namaProyek,
          deskripsi: dataProyek.deskripsi,
          lokasiLahan: dataProyek.lokasiLahan,
          status: dataProyek.status,
        });
        setFaseList(
          dataProyek.fase.map((f) => ({ ...f, gambar: f.gambar || [] }))
        );

        if (updatesRes.ok) {
          const dataUpdates = await updatesRes.json();
          setUpdates(dataUpdates);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data halaman");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [proyekId]);

  useEffect(() => {
    if (!proyekId) return;
    const fetchProduk = async () => {
      try {
        const response = await fetch(`/api/proyek/${proyekId}/produk`);
        if (!response.ok) throw new Error("Gagal mengambil data produk");
        const data: ProdukFormData[] = await response.json();
        setProdukList(data);
      } catch (error) {
        console.error("Error fetching produk:", error);
      }
    };
    fetchProduk();
  }, [proyekId]);

  // Handler
  const handleFormChange = useCallback(
    (field: keyof FormData, value: string | StatusProyek) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSaveProyek = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/proyek/${proyekId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Gagal menyimpan proyek");
      toast.success("Proyek berhasil disimpan!");
    } catch (error) {
      console.error("Error saving proyek:", error);
      toast.error("Gagal menyimpan proyek");
    } finally {
      setSaving(false);
    }
  };

  // Fungsi hapus proyek dengan toast confirmation
  const handleDeleteProyek = async () => {
    toast(
      (t) => (
        <div className="text-center">
          <div className="mb-3">
            <p className="font-semibold text-red-600 mb-2">⚠️ Peringatan!</p>
            <p className="text-sm text-gray-700">
              Menghapus proyek akan menghapus{" "}
              <strong>SEMUA data terkait</strong> (fase, produk, update, dll)
              secara permanen.
            </p>
            <p className="text-sm text-red-600 font-medium mt-1">
              Tindakan ini tidak bisa dibatalkan!
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete();
              }}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Ya, Hapus
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      ),
      {
        duration: 15000,
        style: {
          maxWidth: "400px",
        },
      }
    );
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    const loadingToast = toast.loading("Menghapus proyek...");

    try {
      const response = await fetch(`/api/proyek/${proyekId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus proyek.");
      }

      toast.success("Proyek berhasil dihapus!", { id: loadingToast });
      router.push("/dashboard/proyek");
    } catch (error) {
      console.error("Error deleting proyek:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus proyek.",
        { id: loadingToast }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveFase = async (faseData: FaseFormData) => {
    const isEdit = !!faseData.id;
    const url = isEdit
      ? `/api/proyek/${proyekId}/fase/${faseData.id}`
      : `/api/proyek/${proyekId}/fase`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faseData),
      });
      if (!response.ok) throw new Error("Gagal menyimpan fase");
      const savedFase = await response.json();

      if (isEdit) {
        setFaseList((prev) =>
          prev.map((f) => (f.id === savedFase.id ? savedFase : f))
        );
      } else {
        setFaseList((prev) => [...prev, savedFase]);
      }
      setShowFaseModal(false);
      toast.success("Fase berhasil disimpan!");
    } catch (error) {
      console.error("Error saving fase:", error);
      toast.error("Gagal menyimpan fase");
    }
  };

  const handleDeleteFase = async (faseId: string) => {
    toast((t) => (
      <div className="text-center">
        <p className="mb-3">Apakah Anda yakin ingin menghapus fase ini?</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteFase(faseId);
            }}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded"
          >
            Hapus
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded"
          >
            Batal
          </button>
        </div>
      </div>
    ));
  };

  const deleteFase = async (faseId: string) => {
    try {
      const response = await fetch(`/api/proyek/${proyekId}/fase/${faseId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Gagal menghapus fase");
      setFaseList((prev) => prev.filter((f) => f.id !== faseId));
      toast.success("Fase berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting fase:", error);
      toast.error("Gagal menghapus fase");
    }
  };

  const handleSaveProduk = async (produkData: ProdukFormData) => {
    const isEdit = !!produkData.id;
    const url = isEdit
      ? `/api/proyek/${proyekId}/produk/${produkData.id}`
      : `/api/proyek/${proyekId}/produk`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produkData),
      });
      if (!response.ok) throw new Error("Gagal menyimpan produk");
      const savedProduk = await response.json();

      if (isEdit) {
        setProdukList((prev) =>
          prev.map((p) => (p.id === savedProduk.id ? savedProduk : p))
        );
      } else {
        setProdukList((prev) => [...prev, savedProduk]);
      }
      setShowProdukModal(false);
      toast.success("Produk berhasil disimpan!");
    } catch (error) {
      console.error("Error saving produk:", error);
      toast.error("Gagal menyimpan produk");
    }
  };

  const handleDeleteProduk = async (produkId: string) => {
    toast((t) => (
      <div className="text-center">
        <p className="mb-3">Apakah Anda yakin ingin menghapus produk ini?</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteProduk(produkId);
            }}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded"
          >
            Hapus
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded"
          >
            Batal
          </button>
        </div>
      </div>
    ));
  };

  const deleteProduk = async (produkId: string) => {
    try {
      const response = await fetch(
        `/api/proyek/${proyekId}/produk/${produkId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Gagal menghapus produk");
      setProdukList((prev) => prev.filter((p) => p.id !== produkId));
      toast.success("Produk berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting produk:", error);
      toast.error("Gagal menghapus produk");
    }
  };

  const handleSaveUpdate = async (
    updateData: Omit<FarmingUpdate, "id" | "proyekTaniId" | "createdAt">
  ) => {
    try {
      const response = await fetch(`/api/proyek/${proyekId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error("Gagal menyimpan update");
      const newUpdate = await response.json();
      setUpdates((prev) => [newUpdate, ...prev]);
      setShowUpdateModal(false);
      toast.success("Update berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan update.");
      console.error(error);
    }
  };

  const handleImageUpload = async (files: FileList): Promise<string[]> => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file); // API expects a single 'file'

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengupload gambar.");
      }

      const result = await response.json();
      return result.url; // API returns a single 'url'
    });

    try {
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Satu atau lebih gambar gagal diupload."
      );
      return [];
    }
  };

  const refreshUpdates = async () => {
    const res = await fetch(`/api/proyek/${proyekId}/update`);
    if (res.ok) setUpdates(await res.json());
  };

  // Handler modal
  const handleOpenAddFase = () => {
    setEditingFase({
      nama: "",
      slug: "",
      cerita: "",
      gambar: [],
      urutan: faseList.length + 1,
    });
    setShowFaseModal(true);
  };

  const handleOpenEditFase = (fase: FaseFormData) => {
    setEditingFase(fase);
    setShowFaseModal(true);
  };

  const handleOpenAddProduk = () => {
    setEditingProduk({
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
    setShowProdukModal(true);
  };

  const handleOpenEditProduk = (produk: ProdukFormData) => {
    setEditingProduk(produk);
    setShowProdukModal(true);
  };

  // Render logic
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  if (!proyek)
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Proyek tidak ditemukan</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#333",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Proyek</h1>
            <p className="text-gray-600">{proyek.namaProyek}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDeleteProyek}
            disabled={saving || isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            {isDeleting ? "Menghapus..." : "Hapus Proyek"}
          </button>
          <button
            onClick={handleSaveProyek}
            disabled={saving || isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      {/* Sisa JSX tetap sama... */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProjectInfoForm
            formData={formData}
            onFormChange={handleFormChange}
          />
          <FaseManagement
            faseList={faseList}
            onAdd={handleOpenAddFase}
            onEdit={handleOpenEditFase}
            onDelete={handleDeleteFase}
          />
          <FarmingUpdateManagement
            updates={updates}
            onAdd={() => setShowUpdateModal(true)}
            onUpdate={refreshUpdates}
          />
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Produk</h3>
              <button
                onClick={handleOpenAddProduk}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Tambah Produk
              </button>
            </div>
            {produkList.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Belum ada produk yang ditambahkan
              </p>
            ) : (
              <div className="space-y-3">
                {produkList.map((produk) => (
                  <div
                    key={produk.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {produk.namaProduk}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Rp {produk.harga.toLocaleString("id-ID")} /{" "}
                        {produk.unit}
                      </p>
                      <p className="text-sm text-gray-500">
                        Stok: {produk.stokTersedia} {produk.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          produk.status === "TERSEDIA"
                            ? "bg-green-100 text-green-800"
                            : produk.status === "PREORDER"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {produk.status}
                      </span>
                      <button
                        onClick={() => handleOpenEditProduk(produk)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduk(produk.id!)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <ProjectSidebar
            proyekId={proyekId}
            faseList={faseList}
            status={formData.status}
          />
        </div>
      </div>
      <FaseEditorModal
        isOpen={showFaseModal}
        onClose={() => setShowFaseModal(false)}
        onSave={handleSaveFase}
        initialData={editingFase}
        onImageUpload={handleImageUpload}
      />
      <ProdukEditorModal
        isOpen={showProdukModal}
        onClose={() => setShowProdukModal(false)}
        onSave={handleSaveProduk}
        initialData={editingProduk}
        onImageUpload={handleImageUpload}
        proyekId={proyekId}
      />
      <UpdateEditorModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSave={handleSaveUpdate}
      />
    </div>
  );
};

export default EditProyekPage;
