// src/components/FarmerCard.tsx

import Image from "next/image";
import Link from "next/link";
import { User2, MapPin, Sprout, MessageCircle } from "lucide-react";

export default function FarmerCard({ petani }: any) {
  const { id, name, username, bio, lokasi, image, linkWhatsapp, _count } =
    petani || {};

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-lg bg-white">
      <Link href={`/petani/${username}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={image || "/default-avatar.jpg"}
            alt={name || "Petani"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <User2 className="w-5 h-5 text-green-600" />
            {name || "Unknown"}
          </h3>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4 text-slate-400" />
            {lokasi || "Lokasi tidak diketahui"}
          </p>
          <p className="text-sm text-slate-600 mt-2 line-clamp-2">
            {bio || "Petani berpengalaman"}
          </p>
          <p className="mt-3 text-sm font-medium text-green-600 flex items-center gap-1">
            <Sprout className="w-4 h-4" />
            {_count?.proyekTani || 0} Proyek Pertanian
          </p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <a
          href={`https://wa.me/${linkWhatsapp || ""}?text=${encodeURIComponent(
            `Halo ${
              name || "Petani"
            }, saya tertarik dengan proyek pertanian Anda.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-600 text-white text-center py-2 rounded-md font-medium hover:bg-green-700 transition"
        >
          <MessageCircle className="w-5 h-5" />
          Hubungi via WhatsApp
        </a>
      </div>
    </div>
  );
}
