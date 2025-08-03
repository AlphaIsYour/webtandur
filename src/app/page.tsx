import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, ShieldCheck, Users, Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import FarmerCard from "@/components/FarmerCard";
import prisma from "@/lib/prisma";
import FAQCard from "@/components/FAQCard";

export default async function HomePage() {
  const produks = await prisma.produk.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      namaProduk: true,
      harga: true,
      unit: true,
      fotoUrl: true,
      proyekTani: {
        select: {
          petani: {
            select: {
              name: true,
              lokasi: true,
              linkWhatsapp: true,
            },
          },
        },
      },
    },
  });

  const petani = await prisma.user.findMany({
    where: { role: "PETANI" },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      lokasi: true,
      image: true,
      linkWhatsapp: true,
      _count: {
        select: {
          proyekTani: true,
        },
      },
    },
    take: 3, // Ambil 2 petani untuk ditampilkan
  });

  return (
    <div className="bg-white">
      <main>
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-background.jpg"
              alt="Lahan pertanian yang subur"
              fill
              style={{ objectFit: "cover" }}
              className="scale-110"
              priority
            />
          </div>

          <div className="absolute inset-0 bg-black/50 z-10"></div>

          <div className="relative z-20 text-center text-white px-4 max-w-5xl">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              Dari Lahan, Langsung ke Tangan Anda.
            </h1>
            <p
              className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-200 leading-relaxed"
              style={{ fontFamily: "mona-sans" }}
            >
              Dukung petani lokal mendapatkan harga yang adil. Nikmati hasil
              tani segar berkualitas dengan cerita yang transparan.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                asChild
              >
                <Link href="/produk">
                  Jelajahi Hasil Tani <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="hover:border"
                asChild
              >
                <Link href="/tentang">Pelajari Lebih Lanjut</Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="tentang"
          className="py-20 bg-slate-50"
          style={{ fontFamily: "mona-sans" }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Mewujudkan Kesejahteraan Petani
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600">
              Kami memotong rantai pasok yang tidak adil, menghubungkan Anda
              langsung dengan pahlawan pangan Indonesia.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold text-slate-900">
                  Harga Adil
                </h3>
                <div className="mt-4 flex h-24 w-24 items-center justify-center">
                  <img
                    src="/images/harga.svg"
                    alt="Harga Adil"
                    className="h-24 w-24"
                  />
                </div>
                <p className="mt-4 text-slate-500">
                  Petani menentukan harganya sendiri. Keuntungan maksimal
                  kembali ke mereka, bukan tengkulak.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold text-slate-900">
                  Kualitas Terjamin
                </h3>
                <div className="mt-4 flex h-24 w-24 items-center justify-center">
                  <img
                    src="/images/kualitas.svg"
                    alt="Kualitas Terjamin"
                    className="h-24 w-24"
                  />
                </div>
                <p className="mt-4 text-slate-500">
                  Dapatkan produk paling segar langsung dari sumbernya, dipanen
                  sesaat sebelum dikirim.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold text-slate-900">
                  Transparansi Penuh
                </h3>
                <div className="mt-4 flex h-24 w-24 items-center justify-center">
                  <img
                    src="/images/transparansi.svg"
                    alt="Transparansi Penuh"
                    className="h-24 w-24"
                  />
                </div>
                <p className="mt-4 text-slate-500">
                  Ikuti perjalanan tanam lewat update rutin dari petani. Anda
                  tahu persis apa yang Anda konsumsi.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="produk"
          className="py-20 bg-white"
          style={{ fontFamily: "mona-sans" }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight text-center text-slate-900 sm:text-4xl">
              Panen Terbaru dari Petani Hebat
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-lg text-slate-600">
              Pesan sekarang atau pre-order untuk panen berikutnya. Kesegaran
              terjamin!
            </p>
            <div className="relative mt-8 max-w-md mx-auto">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 transition bg-white shadow-sm"
              />
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {produks.map((product: any) => (
                <ProductCard key={product.id} produk={product} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/produk">Lihat Semua Produk</Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          className="py-20 bg-slate-50"
          style={{ fontFamily: "mona-sans" }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight text-center text-slate-900 sm:text-4xl">
              Kenali Pahlawan Pangan Kita
            </h2>
            <div
              id="petani"
              className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              {petani.map((farmer) => (
                <FarmerCard key={farmer.id} petani={farmer} />
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 bg-white" style={{ fontFamily: "mona-sans" }}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight text-center text-slate-900 sm:text-4xl mb-8">
              Pertanyaan Yang Sering Diajukan
            </h2>
            <div className="max-w-2xl mx-auto space-y-4">
              <FAQCard
                question="Bagaimana cara memesan produk?"
                answer="Anda bisa langsung menghubungi petani melalui tombol WhatsApp yang tersedia di halaman produk."
                className="border-green-500"
              />
              <FAQCard
                question="Apakah ada minimal pembelian?"
                answer="Minimal pembelian tergantung kebijakan masing-masing petani. Biasanya tercantum di deskripsi produk."
                className="border-green-500"
              />
              <FAQCard
                question="Bagaimana sistem pengiriman produk?"
                answer="Pengiriman bisa dilakukan melalui jasa ekspedisi atau diambil langsung sesuai kesepakatan dengan petani."
                className="border-green-500"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
