import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";


// / POST /api/fase-proyek
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PETANI") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    proyekTaniId,
    nama,
    slug,
    cerita,
    gambar,
    urutan,
  } = body;

  if (
    !proyekTaniId || !nama || !slug || !cerita ||
    !Array.isArray(gambar) || typeof urutan !== "number"
  ) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  // Pastikan proyek itu milik petani yang login
  const proyek = await prisma.proyekTani.findFirst({
    where: {
      id: proyekTaniId,
      petaniId: session.user.id,
    },
  });

  if (!proyek) {
    return NextResponse.json({ error: "Proyek tidak ditemukan atau bukan milik Anda" }, { status: 403 });
  }

  const fase = await prisma.faseProyek.create({
    data: {
      nama,
      slug,
      cerita,
      gambar,
      urutan,
      proyekTaniId,
    },
  });

  return NextResponse.json({ message: "Fase berhasil ditambahkan", data: fase });
}

// / GET /api/fase-proyek?proyekTaniId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const proyekTaniId = searchParams.get("proyekTaniId");

  if (!proyekTaniId) {
    return NextResponse.json({ error: "proyekTaniId diperlukan" }, { status: 400 });
  }

  const fase = await prisma.faseProyek.findMany({
    where: { proyekTaniId },
    orderBy: { urutan: "asc" },
  });

  return NextResponse.json({ data: fase });
}
