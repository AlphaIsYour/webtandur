import prisma from "@/lib/prisma";
import ProjectCover from "@/components/ProjectCover";
import ProjectPhase from "@/components/ProjectPhase";
import {
  CircleDashed,
  Handshake,
  MapPin,
  Phone,
  Sprout,
  User,
  Wheat,
  AlertCircle,
  Droplets,
  Package,
  Calendar,
  ArrowRight,
  Clock,
  Leaf,
} from "lucide-react";
import HandleShare from "@/components/HandleShare";
import Providers from "@/components/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const getProyekDetail = async (id: string) => {
  try {
    const proyek = await prisma.proyekTani.findUnique({
      where: { id },
      select: {
        id: true,
        namaProyek: true,
        deskripsi: true,
        lokasiLahan: true,
        status: true, // default: "PERSIAPAN"
        petani: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true, // URL of the profile picture
            lokasi: true,
            linkWhatsapp: true,
          },
        },
        produk: {
          select: {
            id: true,
            namaProduk: true,
            harga: true,
            unit: true,
            fotoUrl: true, // array of image URLs
          },
        },
        fase: {
          select: {
            id: true,
            nama: true,
            cerita: true,
            gambar: true, // array of image URLs
            urutan: true,
            slug: true,
          },
        },
        updates: {
          select: {
            id: true,
            judul: true,
            fotoUrl: true, // array of image URLs
            deskripsi: true,
            createdAt: true,
          },
        },
      },
    });

    if (!proyek) {
      throw new Error("Proyek tidak ditemukan");
    }

    return proyek;
  } catch (error) {
    console.error("Error fetching proyek data:", error);
    throw error;
  }
};

export default async function ProyekDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proyek = await getProyekDetail(id);

  const getStatusIcon = () => {
    switch (proyek.status) {
      case "PERSIAPAN":
        return <CircleDashed className="w-4 h-4 mr-1" />;
      case "PENANAMAN":
        return <Sprout className="w-4 h-4 mr-1" />;
      case "PERAWATAN":
        return <Droplets className="w-4 h-4 mr-1" />;
      case "PANEN":
        return <Wheat className="w-4 h-4 mr-1" />;
      case "SELESAI":
        return <Handshake className="w-4 h-4 mr-1" />;
      default:
        return <AlertCircle className="w-4 h-4 mr-1" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <Providers>
        <Navbar />
      </Providers>
      <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
        {/* Project Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Project Cover */}
          <ProjectCover proyek={proyek} />

          {/* Project Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                    proyek.status === "PERSIAPAN"
                      ? "bg-yellow-100 text-yellow-800"
                      : proyek.status === "PENANAMAN"
                      ? "bg-green-100 text-green-800"
                      : proyek.status === "PERAWATAN"
                      ? "bg-blue-100 text-blue-800"
                      : proyek.status === "PANEN"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {getStatusIcon()}
                  {proyek.status}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {proyek.namaProyek}
                </h1>
              </div>
              <HandleShare
                title={`Bagikan Proyek ${proyek.namaProyek}`}
                text={`Lihat proyek ${proyek.namaProyek} di Tandur`}
              />
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="w-5 h-5" />
              <span>{proyek.lokasiLahan}</span>
            </div>

            <div className="prose max-w-none text-gray-700 mb-6">
              <p>{proyek.deskripsi}</p>
            </div>

            {/* Farmer Info */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4">Petani Pengelola</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  {proyek.petani.image ? (
                    <img
                      src={proyek.petani.image}
                      alt={proyek.petani.name || "Petani"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-full h-full text-gray-400 p-2" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{proyek.petani.name}</h3>
                  <p className="text-sm text-gray-600">
                    @{proyek.petani.username}
                  </p>
                  {proyek.petani.lokasi && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {proyek.petani.lokasi}
                    </p>
                  )}
                </div>
                {proyek.petani.linkWhatsapp && (
                  <a
                    href={`https://wa.me/${proyek.petani.linkWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Hubungi
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Project Phases */}
        <ProjectPhase proyek={proyek} />

        {/* Project Products */}
        {proyek.produk.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="w-6 h-6 mr-2 text-green-600" />
              Produk dari Proyek Ini
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {proyek.produk.map((produk) => (
                <div
                  key={produk.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  <div className="h-48 bg-gray-100 relative">
                    {produk.fotoUrl.length > 0 ? (
                      <img
                        src={produk.fotoUrl[0]}
                        alt={produk.namaProduk}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {produk.namaProduk}
                    </h3>
                    <p className="text-green-600 font-bold mb-2">
                      Rp{produk.harga.toLocaleString("id-ID")}/{produk.unit}
                    </p>
                    <a
                      href={`/produk/${produk.id}`}
                      className="inline-flex items-center text-sm text-green-600 hover:text-green-800"
                    >
                      Lihat detail <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Project Updates */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-green-600" />
            Update Terbaru
          </h2>
          {proyek.updates.length > 0 ? (
            <div className="space-y-6">
              {proyek.updates.map((update) => (
                <div
                  key={update.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-lg">{update.judul}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(update.createdAt)}
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="whitespace-pre-line mb-4">
                      {update.deskripsi}
                    </p>
                    {update.fotoUrl.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {update.fotoUrl.slice(0, 6).map((foto, index) => (
                          <div
                            key={index}
                            className="aspect-square bg-gray-100 rounded overflow-hidden"
                          >
                            <img
                              src={foto}
                              alt={`Update ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">Belum ada update untuk proyek ini</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
