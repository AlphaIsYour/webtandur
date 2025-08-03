// src/components/DisplayProyek.tsx

"use client";

import React, { useState, useMemo } from "react";
import { ProyekTani, FaseProyek } from "@prisma/client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Gabungkan tipe data untuk props
type ProyekWithFase = ProyekTani & {
  fase: FaseProyek[];
};

interface DisplayProyekProps {
  proyek: ProyekWithFase;
  onClose: () => void;
}

// Komponen untuk PopupGambar
const PopupGambar = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-75 z-50 flex items-center justify-center">
      {/* Tombol Close */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 text-white hover:text-gray-300 z-10"
      >
        <X size={32} />
      </button>

      {/* Tombol Previous */}
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50 z-10"
      >
        <ChevronLeft size={40} />
      </button>

      {/* Gambar */}
      <div className="max-w-4xl max-h-[80vh] mx-4">
        <img
          src={images[currentIndex]}
          alt={`Gambar ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Tombol Next */}
      <button
        onClick={onNext}
        disabled={currentIndex === images.length - 1}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50 z-10"
      >
        <ChevronRight size={40} />
      </button>

      {/* Indikator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

// Komponen untuk Grid Gambar
const ImageGrid = ({
  images,
  onImageClick,
  onShowAll,
}: {
  images: string[];
  onImageClick: (img: string) => void;
  onShowAll?: () => void;
}) => {
  const displayImages = images.slice(0, 5);
  const hasMore = images.length > 5;

  if (displayImages.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Tidak ada gambar</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayImages.length === 1 && (
        <div
          className="cursor-pointer"
          onClick={() => onImageClick(displayImages[0])}
        >
          <img
            src={displayImages[0]}
            alt="Gambar fase"
            className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {displayImages.length === 2 && (
        <div className="grid grid-cols-2 gap-2">
          {displayImages.map((img, index) => (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => onImageClick(img)}
            >
              <img
                src={img}
                alt={`Gambar fase ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {displayImages.length >= 3 && (
        <div className="grid grid-cols-2 gap-2">
          {/* Gambar pertama - lebih besar */}
          <div
            className="row-span-2 cursor-pointer"
            onClick={() => onImageClick(displayImages[0])}
          >
            <img
              src={displayImages[0]}
              alt="Gambar fase 1"
              className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Gambar sisanya */}
          <div className="space-y-2">
            {displayImages.slice(1, 5).map((img, index) => (
              <div
                key={index + 1}
                className="cursor-pointer relative"
                onClick={() => onImageClick(img)}
              >
                <img
                  src={img}
                  alt={`Gambar fase ${index + 2}`}
                  className="w-full h-15 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay untuk gambar terakhir jika ada lebih banyak */}
                {index === 3 && hasMore && (
                  <div
                    className="absolute inset-0 bg-black/30 bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowAll?.();
                    }}
                  >
                    <span className="text-white font-medium">
                      +{images.length - 5}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tombol Show All jika ada lebih dari 5 gambar */}
      {hasMore && (
        <button
          onClick={onShowAll}
          className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Lihat Semua Foto ({images.length})
        </button>
      )}
    </div>
  );
};

const DisplayProyek = ({ proyek, onClose }: DisplayProyekProps) => {
  const data = proyek;

  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    index: number;
    images: string[];
  }>({ isOpen: false, index: 0, images: [] });

  const semuaGambar = useMemo(() => {
    if (!data?.fase) return [];
    return data.fase.flatMap((f) => f.gambar || []);
  }, [data]);

  const handleImageClick = (imageUrl: string, faseImages?: string[]) => {
    const imagesToShow = faseImages || semuaGambar;
    const imageIndex = imagesToShow.findIndex((img) => img === imageUrl);
    if (imageIndex !== -1) {
      setPopupState({ isOpen: true, index: imageIndex, images: imagesToShow });
    }
  };

  const handleShowAllImages = (faseImages: string[]) => {
    if (faseImages.length > 0) {
      setPopupState({ isOpen: true, index: 0, images: faseImages });
    }
  };

  const handleClosePopup = () => {
    setPopupState({ isOpen: false, index: 0, images: [] });
  };

  const handleNextImage = () => {
    setPopupState((prev) => ({
      ...prev,
      index: Math.min(prev.index + 1, prev.images.length - 1),
    }));
  };

  const handlePrevImage = () => {
    setPopupState((prev) => ({ ...prev, index: Math.max(prev.index - 1, 0) }));
  };

  return (
    <div className="fixed inset-0 bg-white z-40 overflow-y-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Header dengan Tombol Close dan Judul */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm py-4 mb-6 z-10 flex items-center border-b">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 mr-4"
          >
            <X size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{data.namaProyek}</h1>
        </div>

        {/* Navigasi Fase (Thumbnail) */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-4">
            {data.fase.map((fase) => (
              <a
                key={fase.id}
                href={`#${fase.slug}`}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-green-500 transition-all">
                  {fase.gambar.length > 0 ? (
                    <img
                      src={fase.gambar[0]}
                      alt={fase.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                <span className="mt-1 text-xs font-medium text-gray-600 group-hover:text-green-600 max-w-16 line-clamp-2">
                  {fase.nama}
                </span>
              </a>
            ))}
          </div>
        </nav>

        {/* Konten Utama: Cerita dan Galeri per Fase */}
        <main className="space-y-12">
          {data.fase.map((fase) => (
            <section key={fase.id} id={fase.slug} className="scroll-mt-24">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Kolom Kiri: Cerita */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-green-700">
                    {fase.nama}
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {fase.cerita}
                    </p>
                  </div>
                </div>

                {/* Kolom Kanan: Galeri Gambar */}
                <div>
                  <ImageGrid
                    images={fase.gambar}
                    onImageClick={(img) => handleImageClick(img, fase.gambar)}
                    onShowAll={() => handleShowAllImages(fase.gambar)}
                  />
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>

      {/* Popup Gambar */}
      {popupState.isOpen && (
        <PopupGambar
          images={popupState.images}
          currentIndex={popupState.index}
          onClose={handleClosePopup}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}
    </div>
  );
};

export default DisplayProyek;
