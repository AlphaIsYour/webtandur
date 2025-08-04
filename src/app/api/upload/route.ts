// src/app/api/upload/route.ts

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(request: Request): Promise<NextResponse> {
  // 1. Dapatkan FormData dari request
  const formData = await request.formData();

  // 2. Ambil semua file dari field 'images'
  //    Kita gunakan `getAll` karena frontend mengirim multiple files
  const files = formData.getAll("images") as File[];

  // 3. Validasi dasar: Cek jika ada file yang dikirim
  if (files.length === 0) {
    return NextResponse.json(
      { error: "Tidak ada file yang diupload." },
      { status: 400 }
    );
  }

  // Bungkus logika upload dalam try-catch untuk penanganan error yang baik
  try {
    // 4. Buat array untuk menampung semua promise upload
    const uploadPromises = files.map((file) => {
      // Membuat nama file yang unik untuk menghindari konflik/overwrite
      // Format: [nama-file-asli]-[id-unik].[ekstensi]
      const uniqueFilename = `${file.name.split(".")[0]}-${nanoid(
        8
      )}.${file.name.split(".").pop()}`;

      // 5. Panggil fungsi `put` dari @vercel/blob
      //    - Parameter pertama: nama file di blob storage (kita pakai yang unik)
      //    - Parameter kedua: konten file itu sendiri
      //    - Parameter ketiga (options):
      //      - `access: 'public'`: Agar file bisa diakses secara publik lewat URL
      //      - `token`: SDK secara otomatis akan membaca BLOB_READ_WRITE_TOKEN dari .env
      return put(uniqueFilename, file, {
        access: "public",
      });
    });

    // 6. Tunggu semua proses upload selesai secara paralel
    const blobs = await Promise.all(uploadPromises);

    // 7. Ekstrak URL dari setiap hasil upload
    const urls = blobs.map((blob) => blob.url);

    // 8. Kirim kembali response sukses dengan array URL
    return NextResponse.json({ urls });
  } catch (error) {
    // Jika terjadi error saat proses upload
    console.error("Error uploading files to Vercel Blob:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengupload file." },
      { status: 500 }
    );
  }
}