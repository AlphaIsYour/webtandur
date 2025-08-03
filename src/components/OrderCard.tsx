'use client';

import { Phone, Share2, Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductInteractionProps {
  whatsappLink: string | null;
  productName: string;
}

const OrderCard = ({ whatsappLink, productName }: ProductInteractionProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: `Lihat produk ${productName} di Tandur`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link produk telah disalin ke clipboard');
      });
    }
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h2 className="text-lg font-semibold mb-4">Hubungi Petani</h2>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {whatsappLink ? (
          <a
            href={`https://wa.me/${whatsappLink}?text=Saya%20tertarik%20dengan%20produk%20${encodeURIComponent(productName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition"
          >
            <Phone className="w-5 h-5 mr-2" />
            Chat via WhatsApp
          </a>
        ) : (
          <div className="bg-gray-100 text-gray-500 py-3 px-6 rounded-lg text-center">
            Kontak WhatsApp tidak tersedia
          </div>
        )}

        <button 
          onClick={() => setIsSaved(!isSaved)}
          className={`p-3 rounded-lg flex items-center justify-center ${
            isSaved 
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'border border-gray-300 hover:bg-gray-50'
          } transition`}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        <button 
          onClick={handleShare}
          className="p-3 border flex items-center justify-center border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default OrderCard;