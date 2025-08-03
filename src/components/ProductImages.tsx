"use client";
import { useState } from "react";
import { Leaf, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImages({
  produk,
}: {
  produk: { fotoUrl: string[]; namaProduk: string };
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === produk.fotoUrl.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? produk.fotoUrl.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative">
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
        {produk.fotoUrl.length > 0 ? (
          <>
            <img
              src={produk.fotoUrl[currentImageIndex]}
              alt={produk.namaProduk}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Navigation Arrows */}
            {produk.fotoUrl.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-50">
            <Leaf className="w-16 h-16 text-green-400" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {produk.fotoUrl.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto py-2">
          {produk.fotoUrl.map((foto, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                currentImageIndex === index
                  ? "border-green-500"
                  : "border-transparent"
              }`}
            >
              <img
                src={foto}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
