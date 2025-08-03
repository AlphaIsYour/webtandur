// app/api/proyek/[id]/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// --- FUNGSI GET (DIPERBAIKI) ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Updated to Promise
) {
  const { id } = await params;

  try {
    const proyek = await prisma.proyekTani.findUnique({
      where: { id },
      include: {
        petani: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        produk: true,
        fase: {
          orderBy: {
            urutan: "asc",
          },
        },
      },
    });

    if (!proyek) {
      return NextResponse.json(
        { message: "Proyek tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(proyek, { status: 200 });
  } catch (error) {
    console.error("Error GET /api/proyek/[id]:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

// --- FUNGSI PUT (DIPERBAIKI) ---
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Updated to Promise
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PETANI") {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const proyekToUpdate = await prisma.proyekTani.findUnique({
      where: { id },
    });

    if (!proyekToUpdate) {
      return NextResponse.json(
        { message: "Proyek tidak ditemukan" },
        { status: 404 }
      );
    }

    if (proyekToUpdate.petaniId !== session.user.id) {
      return NextResponse.json(
        { message: "Anda tidak punya izin untuk mengubah proyek ini" },
        { status: 403 }
      );
    }

    const updatedProyek = await prisma.proyekTani.update({
      where: { id },
      data: {
        namaProyek: body.namaProyek,
        deskripsi: body.deskripsi,
        lokasiLahan: body.lokasiLahan,
        status: body.status,
      },
    });

    return NextResponse.json(updatedProyek, { status: 200 });
  } catch (error) {
    console.error("Error PUT /api/proyek/[id]:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

// --- FUNGSI DELETE (DIPERBAIKI) ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Updated to Promise
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PETANI") {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const proyekToDelete = await prisma.proyekTani.findUnique({
      where: { id },
    });

    if (!proyekToDelete) {
      return NextResponse.json(
        { message: "Proyek tidak ditemukan" },
        { status: 404 }
      );
    }

    if (proyekToDelete.petaniId !== session.user.id) {
      return NextResponse.json(
        { message: "Anda tidak punya izin untuk menghapus proyek ini" },
        { status: 403 }
      );
    }

    await prisma.proyekTani.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Proyek berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error DELETE /api/proyek/[id]:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
