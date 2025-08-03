// src/app/api/proyek/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client"; // <- 1. Import tipe Prisma

// =================================================================
// FUNGSI POST TIDAK PERLU DIUBAH
// =================================================================
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "PETANI") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const body = await request.json();
    const { namaProyek, deskripsi, lokasiLahan } = body;

    if (!namaProyek || !deskripsi || !lokasiLahan) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }
    if (namaProyek.length > 100) {
      return NextResponse.json(
        { message: "Nama proyek maksimal 100 karakter" },
        { status: 400 }
      );
    }
    if (deskripsi.length > 500) {
      return NextResponse.json(
        { message: "Deskripsi maksimal 500 karakter" },
        { status: 400 }
      );
    }
    if (lokasiLahan.length > 200) {
      return NextResponse.json(
        { message: "Lokasi lahan maksimal 200 karakter" },
        { status: 400 }
      );
    }

    const proyekBaru = await prisma.proyekTani.create({
      data: {
        namaProyek: namaProyek.trim(),
        deskripsi: deskripsi.trim(),
        lokasiLahan: lokasiLahan.trim(),
        petaniId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Proyek berhasil dibuat",
        data: proyekBaru,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saat membuat proyek:", error);
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { message: "Nama proyek sudah digunakan" },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

// =================================================================
// FUNGSI GET DIPERBARUI DI SINI
// =================================================================
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "PETANI") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    // 2. Baca parameter 'include' dari URL
    const { searchParams } = new URL(request.url);
    const includeParam = searchParams.get("include");

    // 3. Siapkan opsi kueri Prisma secara dinamis
    const queryOptions: Prisma.ProyekTaniFindManyArgs = {
      where: {
        petaniId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    // 4. Jika frontend meminta data 'fase', tambahkan 'include' ke opsi
    if (includeParam === "fase") {
      queryOptions.include = {
        fase: {
          select: {
            gambar: true, // Hanya ambil data gambar agar lebih efisien
          },
        },
      };
    }

    // 5. Jalankan kueri dengan opsi yang sudah disiapkan
    const proyekList = await prisma.proyekTani.findMany(queryOptions);

    // 6. Kembalikan data proyek
    return NextResponse.json(
      {
        message: "Data proyek berhasil diambil",
        data: proyekList,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saat mengambil proyek:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
