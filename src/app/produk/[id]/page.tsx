import OrderCard from "@/components/OrderCard";
import prisma from "@/lib/prisma";
import {
  MapPin,
  User,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import ProductImages from "@/components/ProductImages";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Providers from "@/components/providers";

const getProdukData = async (id: string) => {
  try {
    const produk = await prisma.produk.findUnique({
      where: { id },
      select: {
        id: true,
        namaProduk: true,
        deskripsi: true,
        harga: true,
        unit: true,
        fotoUrl: true, // array of image URLs
        estimasiPanen: true,
        status: true, //default: "TERSEDIA"
        proyekTani: {
          select: {
            id: true,
            namaProyek: true,
            lokasiLahan: true,
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
          },
        },
      },
    });

    if (!produk) {
      throw new Error("Produk tidak ditemukan");
    }

    return produk;
  } catch (error) {
    console.error("Error fetching produk data:", error);
    throw error;
  }
};

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const produk = await getProdukData(id);

  return (
    <>
      <Providers>
        <Navbar />
      </Providers>
      <main className="max-w-6xl mx-auto px-4 py-8 mt-16">
        {/* Back Button */}
        <Link
          href="/produk"
          className="flex items-center text-green-600 hover:text-green-800 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductImages produk={produk} />
          {/* Product Info - SSR Friendly */}
          <div>
            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  produk.status === "TERSEDIA"
                    ? "bg-green-100 text-green-800"
                    : produk.status === "HABIS"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {produk.status === "TERSEDIA" ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : (
                  <Clock className="w-4 h-4 mr-1" />
                )}
                {produk.status}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {produk.namaProduk}
            </h1>

            {/* Price */}
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-green-700">
                Rp{produk.harga.toLocaleString("id-ID")}
              </span>
              <span className="text-gray-500 ml-2">/ {produk.unit}</span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Deskripsi Produk</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {produk.deskripsi}
              </p>
            </div>

            {/* Harvest Estimation */}
            {produk.estimasiPanen && (
              <div className="flex items-center gap-2 mb-4 text-gray-700">
                <Calendar className="w-5 h-5 text-green-600" />
                <span>
                  Estimasi Panen:{" "}
                  {produk.estimasiPanen instanceof Date
                    ? produk.estimasiPanen.toLocaleDateString("id-ID")
                    : produk.estimasiPanen}
                </span>
              </div>
            )}

            {/* Farmer Info */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4">Informasi Petani</h2>
              <Link
                href={`/petani/${produk.proyekTani.petani.username}`}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  {produk.proyekTani.petani.image ? (
                    <img
                      src={produk.proyekTani.petani.image}
                      alt={produk.proyekTani.petani.name || "Petani"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <User className="w-full h-full text-gray-400 p-2" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">
                    {produk.proyekTani.petani.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {produk.proyekTani.petani.lokasi ||
                        "Lokasi tidak tersedia"}
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Project Info */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4">Dari Proyek</h2>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-green-800">
                  {produk.proyekTani.namaProyek}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{produk.proyekTani.lokasiLahan}</span>
                </div>
                <a
                  href={`/proyek/${produk.proyekTani.id}`}
                  className="inline-flex items-center mt-2 text-sm text-green-600 hover:text-green-800 transition"
                >
                  Lihat detail proyek <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            <OrderCard
              whatsappLink={produk.proyekTani.petani.linkWhatsapp}
              productName={produk.namaProduk}
            />
          </div>
        </div>
      </main>
    </>
  );
}
