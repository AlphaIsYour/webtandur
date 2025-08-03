"use client";

import {
  User,
  MapPin,
  Phone,
  Image,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ProfileData {
  name: string;
  bio: string;
  lokasi: string;
  linkWhatsapp: string;
  image: string;
  username: string;
}

export default function FarmerSettings() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    bio: "",
    lokasi: "",
    linkWhatsapp: "",
    image: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/petani/${session.user.id}`);
        if (!response.ok) throw new Error("Gagal memuat profil");
        const data = await response.json();
        const petani = {
          name: data.data.name ?? "",
          bio: data.data.bio ?? "",
          lokasi: data.data.lokasi ?? "",
          linkWhatsapp: data.data.linkWhatsapp ?? "",
          image: data.data.image ?? "",
          username: data.data.username ?? "",
        };
        setProfile(petani);
        setImagePreview(data.data.image);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return profile?.image || "";

    const formData = new FormData();
    formData.append("images", selectedImage);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Gagal mengupload gambar");

      const data = await response.json();
      return data.urls[0];
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      let imageUrl = profile.image;

      if (selectedImage) {
        imageUrl = await uploadImage();
      }

      const updatedData = {
        ...profile,
        image: imageUrl,
      };

      const response = await fetch(`/api/petani/${session?.user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Gagal menyimpan perubahan");

      setSuccess("Profil berhasil diperbarui!");
      setProfile(updatedData);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AlertCircle className="w-8 h-8 text-red-500 mr-2" />
        <p>Gagal memuat data profil</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-2 py-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pengaturan Profil
          </h1>
          <p className="text-gray-600">Kelola informasi profil petani Anda</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center bg-red-50 text-red-700 p-4 rounded-lg mb-6 max-w-3xl">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center bg-green-50 text-green-700 p-4 rounded-lg mb-6 max-w-3xl">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture Section */}
          <div className="bg-white py-8 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-900">
                <Image className="w-6 h-6 mr-3 text-green-600" />
                Foto Profil
              </h2>

              <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-full h-full text-gray-400 p-10" />
                    )}
                  </div>
                  {selectedImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(profile.image);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex-1 max-w-md">
                  <label className="block mb-3 text-sm font-medium text-gray-700">
                    Unggah foto baru
                  </label>
                  <label className="flex flex-col items-center px-6 py-8 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-400 hover:bg-green-50 transition">
                    <div className="flex items-center mb-2">
                      <Upload className="w-6 h-6 mr-2 text-green-600" />
                      <span className="text-base font-medium text-green-600">
                        {selectedImage ? "Ganti gambar" : "Pilih gambar"}
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <p className="text-sm text-gray-500 text-center">
                      PNG, JPG (maks. 5MB)
                      <br />
                      Disarankan ukuran 400x400px
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="bg-white py-8">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-900">
                <User className="w-6 h-6 mr-3 text-green-600" />
                Informasi Pribadi
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={profile.username}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lokasi"
                      className="block text-sm font-medium text-gray-700 mb-2 items-center"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Lokasi
                    </label>
                    <input
                      type="text"
                      id="lokasi"
                      name="lokasi"
                      value={profile.lokasi}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Bio/Deskripsi
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profile.bio ?? ""}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="linkWhatsapp"
                      className="block text-sm font-medium text-gray-700 mb-2 items-center"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Nomor WhatsApp
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg">
                        +62
                      </span>
                      <input
                        type="tel"
                        id="linkWhatsapp"
                        name="linkWhatsapp"
                        value={(profile.linkWhatsapp || "").replace("+62", "")}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setProfile({
                            ...profile,
                            linkWhatsapp: "+62" + value,
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Contoh: 81234567890 (tanpa +62)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="bg-white border-t border-gray-200 py-6">
            <div className="max-w-7xl mx-auto px-6 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
