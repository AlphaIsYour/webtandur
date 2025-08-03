// src/data/proyekData.ts

export interface FaseProyek {
  nama: string; // "Bulan Pertama: Penanaman"
  id: string; // "bulan-1" (untuk anchor link)
  cerita: string; // Teks cerita untuk fase ini
  gambar: string[]; // Array path gambar untuk fase ini
}

export interface DataProyek {
  judul: string;
  fase: FaseProyek[];
}

// CONTOH DATA
export const proyekKacang: DataProyek = {
  judul: "Perjalanan Tumbuh Kembang Kacang Tanah",
  fase: [
    {
      nama: "Bulan Pertama: Penanaman Benih",
      id: "bulan-1",
      cerita:
        "Perjalanan dimulai dengan pemilihan benih unggul dan persiapan lahan yang gembur. Benih ditanam dengan jarak yang ideal untuk memastikan setiap tanaman mendapatkan nutrisi yang cukup. Ini adalah fase kritis yang menentukan pondasi pertumbuhan selanjutnya.",
      gambar: ["/proyek/1.jpg", "/proyek/2.jpg"],
    },
    {
      nama: "Bulan Kedua: Fase Pertumbuhan",
      id: "bulan-2",
      cerita:
        "Memasuki bulan kedua, tunas-tunas mulai tumbuh menjadi tanaman muda yang rimbun. Penyiraman rutin dan pemupukan organik dilakukan untuk mendorong pertumbuhan daun dan batang yang sehat. Kami juga mulai melakukan penyiangan untuk menghilangkan gulma.",
      gambar: ["/proyek/3.jpg", "/proyek/4.jpg", "/proyek/5.jpg"],
    },
    {
      nama: "Bulan Ketiga: Masa Panen",
      id: "bulan-3",
      cerita:
        "Inilah saat yang ditunggu-tunggu! Tanaman telah mencapai kematangan penuh dan siap untuk dipanen. Kacang tanah yang berkualitas tinggi dicabut dari tanah, dibersihkan, dan dijemur untuk proses pengeringan. Hasil panen yang melimpah adalah buah dari kerja keras selama berbulan-bulan.",
      gambar: [
        "/proyek/3.jpg", // Ganti dengan nama file gambar panen Anda
        "/proyek/2.jpg",
        "/proyek/5.jpg",
        "/proyek/1.jpg",
      ],
    },
  ],
};
