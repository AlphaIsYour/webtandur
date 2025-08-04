"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  Send,
  Plus,
  Camera,
  X,
  Upload,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import toast, { Toaster } from "react-hot-toast";

type FarmingUpdate = {
  id: string;
  judul: string;
  deskripsi: string;
  fotoUrl: string[];
  createdAt: Date;
  proyekTani: {
    id: string;
    namaProyek: string;
    petani: {
      id: string;
      name: string;
      username: string;
      image: string | null;
    };
  };
  _count: {
    likes: number;
    comments: number;
  };
  likes: {
    userId: string;
  }[];
};

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    username: string;
  };
};

type UserProject = {
  id: string;
  namaProyek: string;
};

function CreateUpdateModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { data: session } = useSession();
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && session) {
      fetchUserProjects();
    }
  }, [isOpen, session]);

  // Cleanup object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  const fetchUserProjects = async () => {
    try {
      const response = await fetch("/api/user/projects");
      const data = await response.json();
      setUserProjects(data);
    } catch (error) {
      console.error("Error fetching user projects:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 4) {
      toast.error("Maksimal 4 foto");
      return;
    }

    // Validate file size (5MB max)
    const invalidFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error("Beberapa file terlalu besar. Maksimal 5MB per file.");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidTypes = files.filter(
      (file) => !validTypes.includes(file.type)
    );
    if (invalidTypes.length > 0) {
      toast.error("Hanya file JPG, PNG, dan WEBP yang diizinkan.");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    // Create object URLs for preview (more reliable than FileReader)
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    const urlToRevoke = imagePreviews[index];
    if (urlToRevoke && urlToRevoke.startsWith("blob:")) {
      URL.revokeObjectURL(urlToRevoke);
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      // Validasi ukuran di frontend
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`File ${file.name} terlalu besar. Maksimal 5MB.`);
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Upload gagal untuk ${file.name}`);
      }

      return result.url;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !deskripsi.trim()) {
      toast.error("Proyek dan deskripsi harus diisi");
      return;
    }

    setSubmitting(true);

    try {
      // Upload images first
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        uploadedImageUrls = await uploadFiles(images);
      }

      // Submit form data
      const response = await fetch("/api/farming-updatee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proyekTaniId: selectedProject,
          judul: judul.trim() || null,
          deskripsi: deskripsi.trim(),
          fotoUrl: uploadedImageUrls,
        }),
      });

      if (response.ok) {
        toast.success("Update berhasil diposting!");
        onSuccess();
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.message || "Gagal memposting update");
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat memposting");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    // Cleanup object URLs
    imagePreviews.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    setSelectedProject("");
    setJudul("");
    setDeskripsi("");
    setImages([]);
    setImagePreviews([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Buat Update Baru</h3>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Proyek
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Pilih proyek...</option>
              {userProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.namaProyek}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul (Opsional)
            </label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Masukkan judul update..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <Textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full min-h-[100px]"
              placeholder="Ceritakan perkembangan terbaru proyek Anda..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto (Maks. 4)
            </label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {images.length < 4 && (
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">Tambah Foto</span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Memposting..." : "Posting"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditUpdateModal({
  isOpen,
  onClose,
  onSuccess,
  update,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  update: FarmingUpdate | null;
}) {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (update) {
      setJudul(update.judul || "");
      setDeskripsi(update.deskripsi);
    }
  }, [update]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!update || !deskripsi.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/farming-updatee/${update.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul: judul.trim() || null,
          deskripsi: deskripsi.trim(),
        }),
      });

      if (response.ok) {
        toast.success("Update berhasil diperbarui!");
        onSuccess();
        onClose();
      } else {
        toast.error("Gagal memperbarui update");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !update) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Edit Update</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul (Opsional)
            </label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <Textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full min-h-[100px]"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function JejakTaniFeed() {
  const { data: session } = useSession();
  const [updates, setUpdates] = useState<FarmingUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loadingComments, setLoadingComments] = useState<
    Record<string, boolean>
  >({});
  const [liking, setLiking] = useState<Record<string, boolean>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [editingUpdate, setEditingUpdate] = useState<FarmingUpdate | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateToDelete, setUpdateToDelete] = useState<string | null>(null);

  // Fetch farming updates
  useEffect(() => {
    fetchUpdates();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  const fetchUpdates = async () => {
    try {
      const response = await fetch("/api/farming-updatee");
      const data = await response.json();
      setUpdates(data);
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete update function
  const deleteUpdate = async (updateId: string) => {
    try {
      const response = await fetch(`/api/farming-updatee/${updateId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUpdates((prev) => prev.filter((update) => update.id !== updateId));
        toast.success("Postingan berhasil dihapus");
      } else {
        toast.error("Gagal menghapus postingan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
    setShowDeleteModal(false);
    setUpdateToDelete(null);
    setDropdownOpen(null);
  };

  // Show delete confirmation
  const showDeleteConfirmation = (updateId: string) => {
    setUpdateToDelete(updateId);
    setShowDeleteModal(true);
    setDropdownOpen(null);
  };

  // Open edit modal function
  const openEditModal = (update: FarmingUpdate) => {
    setEditingUpdate(update);
    setShowEditModal(true);
    setDropdownOpen(null);
  };

  // Toggle like on a farming update
  const toggleLike = async (farmingUpdateId: string) => {
    if (!session) return;

    setLiking((prev) => ({ ...prev, [farmingUpdateId]: true }));

    try {
      const update = updates.find((u) => u.id === farmingUpdateId);
      const isLiked = update?.likes?.some(
        (like) => like.userId === session.user.id
      );

      if (isLiked) {
        await fetch("/api/like", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            farmingUpdateId,
          }),
        });

        setUpdates((prev) =>
          prev.map((update) => {
            if (update.id === farmingUpdateId) {
              return {
                ...update,
                _count: {
                  ...update._count,
                  likes: update._count.likes - 1,
                },
                likes: update.likes.filter(
                  (like) => like.userId !== session.user.id
                ),
              };
            }
            return update;
          })
        );
      } else {
        await fetch("/api/like", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            farmingUpdateId,
          }),
        });

        setUpdates((prev) =>
          prev.map((update) => {
            if (update.id === farmingUpdateId) {
              return {
                ...update,
                _count: {
                  ...update._count,
                  likes: update._count.likes + 1,
                },
                likes: [
                  ...(Array.isArray(update.likes) ? update.likes : []),
                  { userId: session.user.id },
                ],
              };
            }
            return update;
          })
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLiking((prev) => ({ ...prev, [farmingUpdateId]: false }));
    }
  };

  // Load comments for a farming update
  const loadComments = async (farmingUpdateId: string) => {
    if (comments[farmingUpdateId]) return;

    setLoadingComments((prev) => ({ ...prev, [farmingUpdateId]: true }));

    try {
      const response = await fetch(`/api/comment/${farmingUpdateId}`);
      const data = await response.json();
      setComments((prev) => ({ ...prev, [farmingUpdateId]: data }));
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoadingComments((prev) => ({ ...prev, [farmingUpdateId]: false }));
    }
  };

  // Submit a comment
  const submitComment = async (farmingUpdateId: string) => {
    if (!session || !commentContent.trim()) return;

    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentContent,
          farmingUpdateId,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => ({
          ...prev,
          [farmingUpdateId]: [newComment, ...(prev[farmingUpdateId] || [])],
        }));

        // Update comment count
        setUpdates((prev) =>
          prev.map((update) => {
            if (update.id === farmingUpdateId) {
              return {
                ...update,
                _count: {
                  ...update._count,
                  comments: update._count.comments + 1,
                },
              };
            }
            return update;
          })
        );

        setCommentContent("");
        setCommentingOn(null);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleShare = (title: string, url: string, text: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: `Lihat update ${title} di Tandur`,
          text: `Lihat projek ${text} di Tandur`,
          url: `/proyek/${url}`,
        })
        .catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success("Link telah disalin ke clipboard");
      });
    }
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: id,
    });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4 space-y-8">
        {/* Create Button Skeleton */}
        {session && (
          <div className="border border-gray-300 rounded-lg p-4">
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-400 rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-48 w-full rounded" />
              <Skeleton className="h-48 w-full rounded" />
            </div>
            <div className="flex space-x-4 pt-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Create Update Modal */}
      <CreateUpdateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchUpdates}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hapus Postingan
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Yakin ingin menghapus postingan ini? Tindakan ini tidak dapat
                dibatalkan.
              </p>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUpdateToDelete(null);
                  }}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={() => updateToDelete && deleteUpdate(updateToDelete)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Update Modal */}
      <EditUpdateModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUpdate(null);
        }}
        onSuccess={fetchUpdates}
        update={editingUpdate}
      />

      <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
        {/* Create Update Button - Top positioned */}
        {session && (
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Buat Update Baru</span>
            </button>
          </div>
        )}

        {updates.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada jejak tani yang tersedia</p>
          </div>
        ) : (
          updates.map((update) => (
            <div
              key={update.id}
              className="border border-gray-400 rounded-lg overflow-hidden shadow-sm"
            >
              {/* Header with farmer info */}
              <div className="flex items-center justify-between p-4">
                <Link
                  href={`/petani/${update.proyekTani.petani.username}`}
                  className="flex items-center space-x-3 group"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={update.proyekTani.petani.image || undefined}
                      alt={update.proyekTani.petani.name}
                    />
                    <AvatarFallback>
                      {update.proyekTani.petani.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium group-hover:text-green-600 transition-colors">
                      {update.proyekTani.petani.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(update.createdAt)}
                    </p>
                  </div>
                </Link>

                {/* Menu dropdown hanya untuk pemilik postingan */}
                {session?.user.id === update.proyekTani.petani.id && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(
                          dropdownOpen === update.id ? null : update.id
                        );
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {dropdownOpen === update.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => openEditModal(update)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => showDeleteConfirmation(update.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <span>Hapus</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Project link */}
              <Link
                href={`/proyek/${update.proyekTani.id}`}
                className="px-4 pb-2 block hover:underline text-sm font-medium text-green-700"
              >
                {update.proyekTani.namaProyek}
              </Link>

              {/* Update content */}
              <div className="px-4 pb-3">
                <p className="whitespace-pre-line">{update.deskripsi}</p>
              </div>

              {/* Images */}
              {update.fotoUrl && update.fotoUrl.length > 0 && (
                <div className="border-y">
                  <div
                    className={`grid gap-0.5 ${
                      update.fotoUrl.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-2"
                    }`}
                  >
                    {update.fotoUrl.map((image, idx) => (
                      <div
                        key={idx}
                        className="aspect-square bg-gray-100 relative overflow-hidden"
                      >
                        <Image
                          src={image}
                          alt={`Update image ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="px-4 py-2 flex justify-between border-b">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleLike(update.id)}
                    disabled={liking[update.id]}
                    className={`flex items-center space-x-1 ${
                      update.likes?.some(
                        (like) => like.userId === session?.user.id
                      )
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        update.likes?.some(
                          (like) => like.userId === session?.user.id
                        )
                          ? "fill-current"
                          : ""
                      }`}
                    />
                    <span>{update._count.likes}</span>
                  </button>
                  <button
                    onClick={() => {
                      setCommentingOn(
                        commentingOn === update.id ? null : update.id
                      );
                      if (commentingOn !== update.id) {
                        loadComments(update.id);
                      }
                    }}
                    className="flex items-center space-x-1 text-gray-500 hover:text-green-600"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{update._count.comments}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() =>
                      handleShare(
                        update.judul,
                        update.proyekTani.id,
                        update.proyekTani.namaProyek
                      )
                    }
                    className="text-gray-500 hover:text-green-600"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Comment section */}
              {commentingOn === update.id && (
                <div className="bg-gray-50 p-4 space-y-3">
                  {/* Comment form */}
                  {session && (
                    <div className="flex space-x-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={session.user.image || undefined}
                          alt={session.user.name || "User"}
                        />
                        <AvatarFallback>
                          {session.user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex space-x-2">
                        <Textarea
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          placeholder="Tulis komentar..."
                          className="flex-1 min-h-[40px]"
                          rows={1}
                        />
                        <Button
                          onClick={() => submitComment(update.id)}
                          size="sm"
                          className="self-end"
                          disabled={!commentContent.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Comments list */}
                  {loadingComments[update.id] ? (
                    <div className="space-y-4">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex space-x-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    comments[update.id]?.map((comment) => (
                      <div key={comment.id} className="flex space-x-2">
                        <Link
                          href={`/petani/${comment.user.username}`}
                          className="flex-shrink-0"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {comment.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="bg-white p-2 rounded-lg flex-1">
                          <div className="flex items-baseline space-x-2">
                            <Link
                              href={`/petani/${comment.user.username}`}
                              className="text-sm font-medium hover:underline"
                            >
                              {comment.user.name}
                            </Link>
                            <span className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
