import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT /api/fase-proyek/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PETANI") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { nama, slug, cerita, gambar, urutan } = body;

  if (
    !nama ||
    !slug ||
    !cerita ||
    !Array.isArray(gambar) ||
    typeof urutan !== "number"
  ) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  // Pastikan fase itu milik proyek yang dimiliki petani yang login
  const fase = await prisma.faseProyek.findFirst({
    where: {
      id,
      proyekTani: {
        petaniId: session.user.id,
      },
    },
  });

  if (!fase) {
    return NextResponse.json(
      { error: "Fase tidak ditemukan atau bukan milik Anda" },
      { status: 403 }
    );
  }

  const updatedFase = await prisma.faseProyek.update({
    where: { id },
    data: {
      nama,
      slug,
      cerita,
      gambar,
      urutan,
    },
  });

  return NextResponse.json({
    message: "Fase berhasil diperbarui",
    data: updatedFase,
  });
}

// DELETE /api/fase-proyek/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PETANI") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Pastikan fase itu milik proyek yang dimiliki petani yang login
  const fase = await prisma.faseProyek.findFirst({
    where: {
      id,
      proyekTani: {
        petaniId: session.user.id,
      },
    },
  });

  if (!fase) {
    return NextResponse.json(
      { error: "Fase tidak ditemukan atau bukan milik Anda" },
      { status: 403 }
    );
  }

  await prisma.faseProyek.delete({ where: { id } });

  return NextResponse.json({ message: "Fase berhasil dihapus" });
}
