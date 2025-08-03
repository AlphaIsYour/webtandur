"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ApplicationStatus {
  hasApplication: boolean;
  application?: {
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";
    adminNotes?: string;
    reviewedBy?: {
      name: string;
      email: string;
    };
    reviewedAt?: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

export default function ApplicationStatus() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchApplicationStatus();
    }
  }, [session]);

  const fetchApplicationStatus = async () => {
    try {
      const response = await fetch("/api/petani-application/status");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Error fetching application status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!status?.hasApplication) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Bergabung Sebagai Petani
          </h3>
          <p className="text-gray-600 mb-4">
            Mulai berbagi hasil panen Anda dan bergabung dengan komunitas petani
            kami
          </p>
          <a
            href="/daftar-petani"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Daftar Sekarang
          </a>
        </div>
      </div>
    );
  }

  const { application } = status;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Menunggu Review";
      case "UNDER_REVIEW":
        return "Sedang Direview";
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
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "UNDER_REVIEW":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        );
      case "APPROVED":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "REJECTED":
        return (
          <svg
            className="w-5 h-5"
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Status Aplikasi Petani
        </h3>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            application!.status
          )}`}
        >
          {getStatusIcon(application!.status)}
          <span className="ml-2">{getStatusText(application!.status)}</span>
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Tanggal Daftar:</span>{" "}
            {new Date(application!.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {application!.reviewedAt && (
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Tanggal Review:</span>{" "}
              {new Date(application!.reviewedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        )}

        {application!.reviewedBy && (
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Direview oleh:</span>{" "}
              {application!.reviewedBy.name}
            </p>
          </div>
        )}

        {application!.adminNotes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Catatan Admin:
            </p>
            <p className="text-sm text-gray-700">{application!.adminNotes}</p>
          </div>
        )}

        {application!.status === "PENDING" && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              Aplikasi Anda sedang menunggu review oleh admin. Kami akan
              menghubungi Anda melalui email dalam 1-3 hari kerja.
            </p>
          </div>
        )}

        {application!.status === "UNDER_REVIEW" && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Aplikasi Anda sedang dalam proses review. Mohon tunggu konfirmasi
              lebih lanjut.
            </p>
          </div>
        )}

        {application!.status === "APPROVED" && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              Selamat! Aplikasi Anda telah disetujui. Anda sekarang dapat mulai
              menggunakan fitur petani.
            </p>
          </div>
        )}

        {application!.status === "REJECTED" && (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                Mohon maaf, aplikasi Anda belum dapat disetujui saat ini.
                Silakan perbaiki sesuai catatan admin dan daftar kembali.
              </p>
            </div>
            <a
              href="/daftar-petani"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Daftar Ulang
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
