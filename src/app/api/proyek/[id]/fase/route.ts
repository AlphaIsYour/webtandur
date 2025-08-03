// src/app/api/proyek/[proyekId]/fase/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Sesuaikan path jika berbeda
import { FaseProyek } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Omit<FaseProyek, "id" | "proyekTaniId"> = await request.json();

    const newFase = await prisma.faseProyek.create({
      data: {
        nama: body.nama,
        slug: body.slug,
        cerita: body.cerita,
        gambar: body.gambar,
        urutan: body.urutan,
        proyekTaniId: id,
      },
    });

    return NextResponse.json(newFase, { status: 201 });
  } catch (error) {
    console.error("Error creating fase:", error);
    return NextResponse.json(
      { error: "Gagal membuat fase baru" },
      { status: 500 }
    );
  }
}
