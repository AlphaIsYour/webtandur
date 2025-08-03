"use client";
import { Share2 } from "lucide-react";

export default function HandleShare({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: text,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link produk telah disalin ke clipboard");
      });
    }
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="flex items-center gap-1 p-2 text-gray-500 hover:text-green-600 rounded-full transition-colors"
        aria-label="Bagikan proyek"
        onClick={handleShare}
      >
        <Share2 className="w-5 h-5" />
        <span className="hidden sm:inline">Bagikan</span>
      </button>
    </div>
  );
}
