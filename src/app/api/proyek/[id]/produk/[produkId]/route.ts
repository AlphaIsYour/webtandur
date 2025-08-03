// src/app/api/proyek/[id]/produk/[produkId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; produkId: string }> }
) {
  const { id, produkId } = await params;

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

    const produk = await prisma.produk.update({
      where: {
        id: produkId,
        proyekTaniId: id,
      },
      data: {
        namaProduk,
        deskripsi,
        fotoUrl,
        harga: parseInt(harga),
        unit,
        stokTersedia: parseFloat(stokTersedia),
        status,
        estimasiPanen: estimasiPanen ? new Date(estimasiPanen) : null,
      },
    });

    return NextResponse.json(produk);
  } catch (error) {
    console.error("Error updating produk:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate produk" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; produkId: string }> }
) {
  const { id, produkId } = await params;

  try {
    await prisma.produk.delete({
      where: {
        id: produkId,
        proyekTaniId: id,
      },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting produk:", error);
    return NextResponse.json(
      { error: "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}
