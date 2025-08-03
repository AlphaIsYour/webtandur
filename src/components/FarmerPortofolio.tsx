import { 
  MapPin, Phone, Mail, User, Leaf, ShoppingBag, 
  Calendar, CheckCircle, Clock, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

const FarmerPortfolio = ({ petani }: { petani: any }) => {
  if (!petani) return <div className="text-center py-20">Petani tidak ditemukan</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
      {/* Header Section */}
      <header className="bg-green-50 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
            {petani.image ? (
              <img 
                src={petani.image} 
                alt={`Foto ${petani.name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-green-100 flex items-center justify-center">
                <User className="w-16 h-16 text-green-600" />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-green-800">{petani.name}</h1>
            <p className="text-green-600 mb-2">@{petani.username}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              {petani.lokasi && (
                <div className="flex items-center text-green-700">
                  <MapPin className="w-5 h-5 mr-1" />
                  <span>{petani.lokasi}</span>
                </div>
              )}
              
              {petani.linkWhatsapp && (
                <a 
                  href={`https://wa.me/${petani.linkWhatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  <span>Hubungi via WhatsApp</span>
                </a>
              )}
              
              {petani.email && (
                <Link 
                  href={`mailto:${petani.email}`}
                  className="flex items-center text-green-700 hover:text-green-900"
                >
                  <Mail className="w-5 h-5 mr-1" />
                  <span>Email</span>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {petani.bio && (
          <div className="mt-6 bg-white p-4 rounded-lg border border-green-100">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Tentang Saya</h2>
            <p className="text-gray-700">{petani.bio}</p>
          </div>
        )}
      </header>

      {/* Proyek Tani Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
          <Leaf className="w-6 h-6 mr-2" />
          Proyek Pertanian
        </h2>
        
        {petani.proyekTani.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">Petani ini belum memiliki proyek pertanian</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {petani.proyekTani.map((proyek: any) => (
              <div key={proyek.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="h-48 bg-green-100 relative overflow-hidden">
                  {proyek.updates.length > 0 ? (
                    <img 
                      src={proyek.updates[0].fotoUrl[0]} 
                      alt={proyek.namaProyek}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Leaf className="w-12 h-12 text-green-600" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">{proyek.namaProyek}</h3>
                    <div className="flex items-center text-white/90">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{proyek.lokasiLahan}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      proyek.status === 'Aktif' 
                        ? 'bg-green-100 text-green-800' 
                        : proyek.status === 'Selesai' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {proyek.status === 'Aktif' ? (
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> {proyek.status}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" /> {proyek.status}
                        </span>
                      )}
                    </span>
                    
                    <span className="text-sm text-gray-500">
                      {proyek.updates.length} update
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{proyek.deskripsi}</p>
                  
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/proyek/${proyek.id}`} 
                      className="text-green-600 hover:text-green-800 flex items-center text-sm font-medium"
                    >
                      Lihat detail <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                    
                    {proyek.produk.length > 0 && (
                      <span className="text-sm text-gray-500 flex items-center">
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        {proyek.produk.length} produk
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Produk Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
          <ShoppingBag className="w-6 h-6 mr-2" />
          Produk Tersedia
        </h2>
        
        {petani.proyekTani.some((proyek: any) => proyek.produk.length > 0) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {petani.proyekTani.flatMap((proyek: any) => 
              proyek.produk.map((produk: any) => (
                <div key={produk.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
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
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">{produk.namaProduk}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">Dari proyek: {proyek.namaProyek}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-700">
                        Rp{produk.harga.toLocaleString('id-ID')}/{produk.unit}
                      </span>
                      
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Pesan
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">Belum ada produk yang tersedia</p>
          </div>
        )}
      </section>

      {/* Updates Section */}
      <section>
        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2" />
          Update Terbaru
        </h2>
        
        {petani.proyekTani.some((proyek: any) => proyek.updates.length > 0) ? (
          <div className="space-y-6">
            {petani.proyekTani.flatMap((proyek: any) => 
              proyek.updates.map((update: any) => (
                <div key={update.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <span className="text-sm font-medium text-gray-500">Proyek: {proyek.namaProyek}</span>
                    </div>
                    
                    {update.fotoUrl.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {update.fotoUrl.map((foto: string, index: number) => (
                          <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
              ))
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">Belum ada update terbaru</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default FarmerPortfolio;