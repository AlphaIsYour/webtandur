// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'new', 'available', 'preorder', 'all'
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category"); // 'sayuran', 'buah', etc from namaProduk

    let whereClause: any = {};

    // Filter by status
    switch (type) {
      case "new":
        whereClause.createdAt = {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        };
        break;
      case "available":
        whereClause.status = "TERSEDIA";
        whereClause.stokTersedia = { gt: 0 };
        break;
      case "preorder":
        whereClause.status = "PREORDER";
        break;
    }

    // Filter by category (simple text search)
    if (category) {
      whereClause.namaProduk = {
        contains: category,
        mode: "insensitive",
      };
    }

    const products = await prisma.produk.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        namaProduk: true,
        deskripsi: true,
        fotoUrl: true,
        harga: true,
        unit: true,
        stokTersedia: true,
        status: true,
        estimasiPanen: true,
        createdAt: true,
        proyekTani: {
          select: {
            id: true,
            namaProyek: true,
            petani: {
              select: {
                id: true,
                name: true,
                username: true,
                lokasi: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data produk" },
      { status: 500 }
    );
  }
}
