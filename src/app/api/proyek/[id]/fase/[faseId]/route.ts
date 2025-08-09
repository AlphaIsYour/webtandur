// src/app/api/proyek/[proyekId]/fase/[faseId]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FaseProyek } from "@prisma/client";

// GET - Mengambil fase tertentu
export async function GET(
  request: Request,
  { params }: { params: Promise<{ proyekId: string; faseId: string }> }
) {
  try {
    const { proyekId, faseId } = await params;

    const fase = await prisma.faseProyek.findFirst({
      where: {
        id: faseId,
        proyekTaniId: proyekId,
      },
    });

    if (!fase) {
      return NextResponse.json(
        { error: "Fase tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(fase);
  } catch (error) {
    console.error("Error fetching fase:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data fase" },
      { status: 500 }
    );
  }
}

// PUT - Update fase
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ proyekId: string; faseId: string }> }
) {
  try {
    const { proyekId, faseId } = await params;
    const body: Omit<FaseProyek, "id" | "proyekTaniId"> = await request.json();

    // Verifikasi bahwa fase exists dan belongs to proyek
    const existingFase = await prisma.faseProyek.findFirst({
      where: {
        id: faseId,
        proyekTaniId: proyekId,
      },
    });

    if (!existingFase) {
      return NextResponse.json(
        { error: "Fase tidak ditemukan" },
        { status: 404 }
      );
    }

    const updatedFase = await prisma.faseProyek.update({
      where: {
        id: faseId,
      },
      data: {
        nama: body.nama,
        slug: body.slug,
        cerita: body.cerita,
        gambar: body.gambar,
        urutan: body.urutan,
      },
    });

    return NextResponse.json(updatedFase);
  } catch (error) {
    console.error("Error updating fase:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui fase" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus fase
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ proyekId: string; faseId: string }> }
) {
  try {
    const { proyekId, faseId } = await params;

    // Verifikasi bahwa fase exists dan belongs to proyek
    const existingFase = await prisma.faseProyek.findFirst({
      where: {
        id: faseId,
        proyekTaniId: proyekId,
      },
    });

    if (!existingFase) {
      return NextResponse.json(
        { error: "Fase tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.faseProyek.delete({
      where: {
        id: faseId,
      },
    });

    return NextResponse.json({ message: "Fase berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting fase:", error);
    return NextResponse.json(
      { error: "Gagal menghapus fase" },
      { status: 500 }
    );
  }
}
