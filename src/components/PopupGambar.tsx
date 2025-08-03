// src/components/PopupGambar.tsx

"use client";

import React from "react";

interface PopupGambarProps {
  images: string[]; // Semua gambar dalam proyek
  currentIndex: number; // Index gambar yang sedang ditampilkan
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const PopupGambar = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: PopupGambarProps) => {
  const isFirstImage = currentIndex === 0;
  const isLastImage = currentIndex === images.length - 1;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
    >
      {/* Tombol Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
      >
        ×
      </button>

      {/* Tombol Navigasi Kiri (Chevron Left) */}
      {!isFirstImage && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Kontainer Gambar */}
      <div className="relative p-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentIndex]}
          alt={`Tampilan Proyek ${currentIndex + 1}`}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
        />
      </div>

      {/* Tombol Navigasi Kanan (Chevron Right) */}
      {!isLastImage && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PopupGambar;
