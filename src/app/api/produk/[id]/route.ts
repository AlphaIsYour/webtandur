// src/app/api/produk/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper function untuk memeriksa kepemilikan produk
async function checkProductOwnership(
  productId: string,
  userId: string
): Promise<boolean> {
  const product = await prisma.produk.findFirst({
    where: {
      id: productId,
      proyekTani: {
        petaniId: userId,
      },
    },
  });
  return !!product; // Mengembalikan true jika produk ditemukan, false jika tidak
}

// GET: Mengambil detail satu produk (Bisa dibuat publik atau dilindungi)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const produk = await prisma.produk.findUnique({
      where: { id },
      include: {
        proyekTani: {
          select: {
            petani: {
              select: { name: true, lokasi: true, linkWhatsapp: true },
            },
          },
        },
      },
    });

    if (!produk) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(produk);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data produk" },
      { status: 500 }
    );
  }
}

// PUT: Memperbarui produk (Dilindungi + Validasi Kepemilikan)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "PETANI") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const { id } = await params;

    // Validasi kepemilikan produk sebelum update
    const isOwner = await checkProductOwnership(id, session.user.id);
    if (!isOwner) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan atau Anda tidak punya izin" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      namaProduk,
      deskripsi,
      harga,
      fotoUrl,
      unit,
      stokTersedia,
      status,
      estimasiPanen,
    } = body;

    const updatedProduk = await prisma.produk.update({
      where: { id },
      data: {
        namaProduk,
        deskripsi,
        harga: Number(harga),
        fotoUrl,
        unit,
        stokTersedia: Number(stokTersedia),
        status,
        estimasiPanen: estimasiPanen ? new Date(estimasiPanen) : null,
      },
    });

    return NextResponse.json(updatedProduk);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui produk" },
      { status: 500 }
    );
  }
}

// DELETE: Menghapus produk (Dilindungi + Validasi Kepemilikan)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "PETANI") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const { id } = await params;

    // Validasi kepemilikan produk sebelum hapus
    const isOwner = await checkProductOwnership(id, session.user.id);
    if (!isOwner) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan atau Anda tidak punya izin" },
        { status: 404 }
      );
    }

    await prisma.produk.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Produk berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}
