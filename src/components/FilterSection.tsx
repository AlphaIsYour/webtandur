export default function FilterSection() {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Urutkan:</span>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="most-liked">Paling Disukai</option>
              <option value="most-commented">Paling Banyak Komentar</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="all">Semua Status</option>
              <option value="PERSIAPAN">Persiapan</option>
              <option value="PENANAMAN">Penanaman</option>
              <option value="PERAWATAN">Perawatan</option>
              <option value="PANEN">Panen</option>
              <option value="SELESAI">Selesai</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}