// app/admin/petani-applications/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  MapPin,
  Wheat,
  Phone,
} from "lucide-react";

interface Application {
  id: string;
  nama: string;
  username: string;
  bio: string;
  lokasi: string;
  linkWhatsapp: string;
  alasanMenjadi: string;
  pengalamanBertani: string;
  jenisKomoditas: string;
  luasLahan: string;
  lokasiLahan: string;
  fotoProfil?: string;
  fotoKTP: string;
  sertifikatLahan: string[];
  status: "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";
  adminNotes?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  reviewer?: {
    name: string;
    email: string;
  };
}

export default function AdminPetaniApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        `/api/admin/petani-applications?status=${selectedStatus}`
      );
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, status: string) => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/admin/petani-applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          status,
          adminNotes,
        }),
      });

      if (response.ok) {
        fetchApplications();
        setShowModal(false);
        setAdminNotes("");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "UNDER_REVIEW":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "APPROVED":
        return "bg-green-50 text-green-600 border-green-200";
      case "REJECTED":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Menunggu";
      case "UNDER_REVIEW":
        return "Review";
      case "APPROVED":
        return "Disetujui";
      case "REJECTED":
        return "Ditolak";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "UNDER_REVIEW":
        return <Eye className="w-4 h-4" />;
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const openModal = (app: Application) => {
    setSelectedApp(app);
    setAdminNotes(app.adminNotes || "");
    setShowModal(true);
  };

  const getStats = () => {
    const pending = applications.filter(
      (app) => app.status === "PENDING"
    ).length;
    const approved = applications.filter(
      (app) => app.status === "APPROVED"
    ).length;
    const rejected = applications.filter(
      (app) => app.status === "REJECTED"
    ).length;
    const underReview = applications.filter(
      (app) => app.status === "UNDER_REVIEW"
    ).length;

    return { pending, approved, rejected, underReview };
  };

  const stats = getStats();

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<any>;
    color?: "blue" | "green" | "orange" | "red";
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      orange: "bg-orange-50 text-orange-600",
      red: "bg-red-50 text-red-600",
    };

    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border shadow-sm p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Aplikasi Pendaftaran Petani
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola pendaftaran petani baru dan review aplikasi mereka.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Menunggu Review"
          value={stats.pending}
          subtitle="Perlu perhatian"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Sedang Review"
          value={stats.underReview}
          subtitle="Dalam proses"
          icon={Eye}
          color="blue"
        />
        <StatCard
          title="Disetujui"
          value={stats.approved}
          subtitle="Diterima"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Ditolak"
          value={stats.rejected}
          subtitle="Tidak memenuhi"
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Filter and Applications */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Aplikasi
            </h3>
            <div className="mt-4 sm:mt-0">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="PENDING">Menunggu</option>
                <option value="UNDER_REVIEW">Review</option>
                <option value="APPROVED">Disetujui</option>
                <option value="REJECTED">Ditolak</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {applications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Tidak ada aplikasi ditemukan</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="h-12 w-12 flex-shrink-0">
                      <Image
                        className="h-12 w-12 rounded-full object-cover"
                        src={
                          app.fotoProfil ||
                          app.user.image ||
                          "/default-avatar.png"
                        }
                        alt=""
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <p className="text-lg font-medium text-gray-900">
                          {app.nama}
                        </p>
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {getStatusIcon(app.status)}
                          <span>{getStatusText(app.status)}</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{app.lokasi}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Wheat className="w-4 h-4" />
                          <span>{app.jenisKomoditas}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(app.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(app)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Detail
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Detail */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Detail Aplikasi Petani
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Data Pribadi
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Nama:</span>{" "}
                      {selectedApp.nama}
                    </p>
                    <p>
                      <span className="font-medium">Username:</span>{" "}
                      {selectedApp.username}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedApp.user.email}
                    </p>
                    <p>
                      <span className="font-medium">Lokasi:</span>{" "}
                      {selectedApp.lokasi}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">WhatsApp:</span>{" "}
                      <a
                        href={selectedApp.linkWhatsapp}
                        target="_blank"
                        className="text-blue-600 ml-1 flex items-center"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        {selectedApp.linkWhatsapp}
                      </a>
                    </p>
                    <p>
                      <span className="font-medium">Bio:</span>{" "}
                      {selectedApp.bio}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Wheat className="w-5 h-5 mr-2" />
                    Data Pertanian
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Alasan:</span>{" "}
                      {selectedApp.alasanMenjadi}
                    </p>
                    <p>
                      <span className="font-medium">Pengalaman:</span>{" "}
                      {selectedApp.pengalamanBertani}
                    </p>
                    <p>
                      <span className="font-medium">Komoditas:</span>{" "}
                      {selectedApp.jenisKomoditas}
                    </p>
                    <p>
                      <span className="font-medium">Luas Lahan:</span>{" "}
                      {selectedApp.luasLahan} m²
                    </p>
                    <p>
                      <span className="font-medium">Lokasi Lahan:</span>{" "}
                      {selectedApp.lokasiLahan}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Dokumen</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedApp.fotoProfil && (
                    <div>
                      <p className="text-sm font-medium mb-2">Foto Profil</p>
                      <Image
                        src={selectedApp.fotoProfil}
                        alt="Foto Profil"
                        width={150}
                        height={150}
                        className="rounded-lg object-cover border"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium mb-2">Foto KTP</p>
                    <Image
                      src={selectedApp.fotoKTP}
                      alt="Foto KTP"
                      width={150}
                      height={150}
                      className="rounded-lg object-cover border"
                    />
                  </div>
                  {selectedApp.sertifikatLahan.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Sertifikat Lahan
                      </p>
                      <div className="space-y-2">
                        {selectedApp.sertifikatLahan.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            className="block text-blue-600 text-sm hover:underline p-2 bg-white rounded border"
                          >
                            📄 Dokumen {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Admin
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tambahkan catatan untuk pendaftar..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                {selectedApp.status !== "APPROVED" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedApp.id, "APPROVED")
                    }
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{actionLoading ? "Loading..." : "Setujui"}</span>
                  </button>
                )}
                {selectedApp.status !== "REJECTED" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedApp.id, "REJECTED")
                    }
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{actionLoading ? "Loading..." : "Tolak"}</span>
                  </button>
                )}
                {selectedApp.status === "PENDING" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedApp.id, "UNDER_REVIEW")
                    }
                    disabled={actionLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{actionLoading ? "Loading..." : "Mulai Review"}</span>
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
