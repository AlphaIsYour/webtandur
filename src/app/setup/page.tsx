"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  BookOpenText,
  MapPin,
  Phone,
  Loader2,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function SetupPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !session?.user) {
      router.push("/sign-in");
    }
  }, [session, router, mounted]);

  if (!mounted || !session?.user) {
    return null;
  }

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    lokasi: "",
    linkWhatsapp: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`/api/setup-akun/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || "Terjadi kesalahan saat memperbarui profil"
        );
      } else {
        const data = await response.json();
        setSuccess(data.message);
        await update({
          user: {
            ...session.user,
            username: formData.username,
            bio: formData.bio,
            lokasi: formData.lokasi,
            linkWhatsapp: formData.linkWhatsapp,
          },
        });
        router.refresh();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Terjadi kesalahan saat memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Setup Profil Petani
            </h2>
            <p className="text-green-100 mt-1">
              Lengkapi informasi profil Anda untuk mulai menggunakan Tandur
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-2 bg-green-50 text-green-600 p-3 rounded-lg mb-4">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="username"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="contoh: petani_organik"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="bio"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <BookOpenText className="w-4 h-4 text-gray-500" />
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="Ceritakan tentang diri dan pertanian Anda"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="lokasi"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Lokasi
                </label>
                <input
                  type="text"
                  id="lokasi"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="Contoh: Desa Sukamaju, Jawa Barat"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="linkWhatsapp"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <Phone className="w-4 h-4 text-gray-500" />
                  Link WhatsApp
                </label>
                <input
                  type="text"
                  id="linkWhatsapp"
                  name="linkWhatsapp"
                  value={formData.linkWhatsapp}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="contoh: +6281234567890"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 px-4 py-3 flex items-center justify-center gap-2 font-medium rounded-lg transition-colors ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <span>Simpan Profil</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
