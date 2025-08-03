// src/app/api/farming-updatee/[id]/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "PETANI") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { judul, deskripsi } = body;

    // Validasi input
    if (!judul || !deskripsi) {
      return NextResponse.json(
        { message: "Judul dan deskripsi wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah update milik petani yang login
    const existingUpdate = await prisma.farmingUpdate.findFirst({
      where: {
        id,
        proyekTani: {
          petaniId: session.user.id,
        },
      },
    });

    if (!existingUpdate) {
      return NextResponse.json(
        { message: "Update tidak ditemukan atau bukan milik Anda" },
        { status: 404 }
      );
    }

    const updatedUpdate = await prisma.farmingUpdate.update({
      where: { id },
      data: {
        judul: judul.trim(),
        deskripsi: deskripsi.trim(),
      },
    });

    return NextResponse.json(
      {
        message: "Update berhasil diperbarui",
        data: updatedUpdate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error PUT /api/farming-updatee/[id]:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "PETANI") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const { id } = await params;

    // Cek apakah update milik petani yang login
    const existingUpdate = await prisma.farmingUpdate.findFirst({
      where: {
        id,
        proyekTani: {
          petaniId: session.user.id,
        },
      },
    });

    if (!existingUpdate) {
      return NextResponse.json(
        { message: "Update tidak ditemukan atau bukan milik Anda" },
        { status: 404 }
      );
    }

    await prisma.farmingUpdate.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Update berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error DELETE /api/farming-updatee/[id]:", error);

    // Handle foreign key constraint error
    if (
      error instanceof Error &&
      error.message.includes("Foreign key constraint")
    ) {
      return NextResponse.json(
        { message: "Tidak dapat menghapus update yang memiliki data terkait" },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
