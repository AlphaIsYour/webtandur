"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";
export default function ProjectCover({ proyek }: { proyek: any }) {
    
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      proyek.updates.length > 0 && proyek.updates[0].fotoUrl.length > 0
        ? prev === proyek.updates[0].fotoUrl.length - 1
          ? 0
          : prev + 1
        : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      proyek.updates.length > 0 && proyek.updates[0].fotoUrl.length > 0
        ? prev === 0
          ? proyek.updates[0].fotoUrl.length - 1
          : prev - 1
        : 0
    );
  };

  return (
    <div className="w-full md:w-1/2 lg:w-2/5 h-64 md:h-80 rounded-xl overflow-hidden bg-green-100 relative">
      {proyek.updates.length > 0 && proyek.updates[0].fotoUrl.length > 0 ? (
        <>
          <img
            src={proyek.updates[0].fotoUrl[currentImageIndex]}
            alt={`Update ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {proyek.updates[0].fotoUrl.length > 1 && (
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
        <div className="w-full h-full flex items-center justify-center">
          <Leaf className="w-16 h-16 text-green-500" />
        </div>
      )}
    </div>
  );
}
