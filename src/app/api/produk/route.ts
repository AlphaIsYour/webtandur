// src/app/api/produk/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Mengambil SEMUA produk milik petani yang sedang login
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "PETANI") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const products = await prisma.produk.findMany({
      where: {
        proyekTani: {
          petaniId: session.user.id,
        },
      },
      include: {
        proyekTani: {
          select: {
            namaProyek: true,
            petani: {
              select: { name: true, lokasi: true, linkWhatsapp: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Gagal mengambil produk" },
      { status: 500 }
    );
  }
}

// POST: Membuat produk BARU
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "PETANI") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const body = await request.json();
    const {
      namaProduk,
      deskripsi,
      harga,
      fotoUrl,
      proyekTaniId,
      unit,
      stokTersedia,
      status,
      estimasiPanen,
    } = body;

    // 1. Validasi Input
    if (
      !namaProduk ||
      !proyekTaniId ||
      !harga ||
      !unit ||
      stokTersedia == null
    ) {
      return NextResponse.json(
        { message: "Data wajib tidak lengkap" },
        { status: 400 }
      );
    }

    // 2. Validasi Kepemilikan Proyek (PENTING!)
    const proyek = await prisma.proyekTani.findFirst({
      where: {
        id: proyekTaniId,
        petaniId: session.user.id,
      },
    });

    if (!proyek) {
      return NextResponse.json(
        { message: "Proyek tidak valid atau bukan milik Anda" },
        { status: 403 }
      );
    }

    // 3. Buat Produk
    const newProduct = await prisma.produk.create({
      data: {
        namaProduk,
        deskripsi,
        harga: Number(harga),
        fotoUrl,
        unit,
        stokTersedia: Number(stokTersedia),
        status,
        estimasiPanen: estimasiPanen ? new Date(estimasiPanen) : null,
        proyekTaniId: proyekTaniId,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Gagal membuat produk" },
      { status: 500 }
    );
  }
}
