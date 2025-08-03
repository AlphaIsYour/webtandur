import Footer from "@/components/Footer";
import Providers from "@/components/providers";
import Navbar from "@/components/Navbar";
import { Target, Users, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <>
    <Providers>
      <Navbar />
    </Providers>
      <div className="max-w-6xl mx-auto px-4 py-12 mt-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Tentang Tandur
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platform digital yang menghubungkan petani langsung dengan konsumen,
            menciptakan rantai pasok yang lebih adil dan transparan
          </p>
        </div>

        {/* Our Mission */}
        <section className="mb-20 bg-green-50 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Misi Kami</h2>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                Memberdayakan petani lokal melalui teknologi untuk menciptakan
                sistem pertanian yang berkelanjutan dan berkeadilan.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <span>Memangkas rantai distribusi yang panjang</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <span>Meningkatkan pendapatan petani secara signifikan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  <span>Membangun kepercayaan konsumen</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img
                src="/images/farmer-empowerment.jpg"
                alt="Petani bahagia"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* For Farmers */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/2">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Untuk Petani
                </h2>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                Tandur memberikan alat untuk mengelola usaha tani secara
                digital:
              </p>
              <div className="grid gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-green-700 mb-2">
                    Etalase Digital
                  </h3>
                  <p className="text-gray-600">
                    Tampilkan produk dengan foto dan deskripsi menarik
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-green-700 mb-2">
                    Harga yang Adil
                  </h3>
                  <p className="text-gray-600">
                    Tetapkan harga langsung tanpa perantara
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-green-700 mb-2">
                    Branding Pribadi
                  </h3>
                  <p className="text-gray-600">
                    Ceritakan kisah dibalik produk Anda
                  </p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/images/farmer-using-phone.jpg"
                alt="Petani menggunakan Tandur"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* For Consumers */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Untuk Konsumen
                </h2>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                Tandur memberikan pengalaman berbelanja yang transparan dan
                bermakna:
              </p>
              <div className="grid gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-green-700 mb-2">
                    Produk Segar
                  </h3>
                  <p className="text-gray-600">
                    Langsung dari kebun ke meja Anda
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-green-700 mb-2">
                    Transparansi
                  </h3>
                  <p className="text-gray-600">
                    Ketahui asal-usul dan proses produksi
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-green-700 mb-2">
                    Dampak Langsung
                  </h3>
                  <p className="text-gray-600">
                    Dukung petani lokal secara nyata
                  </p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/images/fresh-produce.jpg"
                alt="Produk segar Tandur"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="mb-20 bg-green-800 text-white rounded-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Dampak Kami</h2>
            <p className="text-green-200 max-w-2xl mx-auto">
              Berkontribusi pada pembangunan pertanian yang berkelanjutan
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-700 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">40-60%</div>
              <p>Peningkatan pendapatan petani</p>
            </div>
            <div className="bg-green-700 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">100%</div>
              <p>Transparansi rantai pasok</p>
            </div>
            <div className="bg-green-700 p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">SDG 1</div>
              <p>Mendukung Tanpa Kemiskinan</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bergabunglah dengan Gerakan Kami
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Baik Anda petani yang ingin menjual langsung atau konsumen yang
            peduli dengan asal-usul makanan, Tandur adalah platform untuk Anda.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/sign-in"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Daftar sebagai Petani
            </a>
            <a
              href="/produk"
              className="border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium"
            >
              Lihat Produk
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
