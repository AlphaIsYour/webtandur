// src/app/api/proyek/[id]/produk/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const produk = await prisma.produk.findMany({
      where: {
        proyekTaniId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(produk);
  } catch (error) {
    console.error("Error fetching produk:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data produk" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const {
      namaProduk,
      deskripsi,
      fotoUrl,
      harga,
      unit,
      stokTersedia,
      status,
      estimasiPanen,
    } = body;

    const produk = await prisma.produk.create({
      data: {
        namaProduk,
        deskripsi,
        fotoUrl,
        harga: parseInt(harga),
        unit,
        stokTersedia: parseFloat(stokTersedia),
        status,
        estimasiPanen: estimasiPanen ? new Date(estimasiPanen) : null,
        proyekTaniId: id,
      },
    });

    return NextResponse.json(produk);
  } catch (error) {
    console.error("Error creating produk:", error);
    return NextResponse.json(
      { error: "Gagal membuat produk" },
      { status: 500 }
    );
  }
}
