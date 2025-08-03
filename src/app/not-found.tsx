import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Providers from "@/components/providers";
import { Leaf, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Providers>
        <Navbar />
      </Providers>
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-6 text-center">
        <Leaf className="text-green-600 w-16 h-16 mb-4" />

        <h1 className="text-5xl font-bold text-green-800 mb-2">
          404 - Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-700 text-lg max-w-xl">
          Sepertinya ladang yang kamu cari belum ditanami apa pun. Yuk kembali
          ke halaman utama dan mulai menanam ide!
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center text-green-700 hover:text-green-900 font-semibold transition"
        >
          <ArrowLeft className="mr-2" />
          Kembali ke Beranda
        </Link>
      </div>
    </>
  );
}
