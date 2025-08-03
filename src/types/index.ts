// types.ts
export interface ProductWithFarmer {
  id: string;
  namaProduk: string;
  harga: number;
  unit: string;
  fotoUrl: string[];
  proyekTani: {
    petani: {
      name: string;
      lokasi: string;
      linkWhatsapp: string;
    };
  };
}