// src/app/api/proyek/[id]/update/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Mengambil semua farming update untuk satu proyek
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await prisma.farmingUpdate.findMany({
      where: {
        proyekTaniId: id,
      },
      orderBy: {
        createdAt: "desc", // Tampilkan yang terbaru di atas
      },
    });
    return NextResponse.json(updates);
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil update" },
      { status: 500 }
    );
  }
}

// POST: Membuat farming update baru
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "PETANI") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    // Verifikasi kepemilikan proyek
    const proyek = await prisma.proyekTani.findFirst({
      where: { id: id, petaniId: session.user.id },
    });
    if (!proyek) {
      return NextResponse.json(
        { message: "Proyek tidak ditemukan atau bukan milik Anda" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { judul, deskripsi, fotoUrl } = body;

    if (!judul || !deskripsi) {
      return NextResponse.json(
        { message: "Judul dan deskripsi wajib diisi" },
        { status: 400 }
      );
    }

    const newUpdate = await prisma.farmingUpdate.create({
      data: {
        judul,
        deskripsi,
        fotoUrl: fotoUrl || [],
        proyekTaniId: id,
      },
    });

    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal membuat update baru" },
      { status: 500 }
    );
  }
}
