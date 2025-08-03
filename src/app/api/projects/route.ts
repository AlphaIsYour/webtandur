// app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'new', 'active', 'harvest', 'all'
    const limit = parseInt(searchParams.get("limit") || "10");

    let whereClause: any = {};

    switch (type) {
      case "new":
        whereClause.createdAt = {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        };
        break;
      case "active":
        whereClause.status = {
          in: ["PENANAMAN", "PERAWATAN"],
        };
        break;
      case "harvest":
        whereClause.status = "PANEN";
        break;
    }

    const projects = await prisma.proyekTani.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        namaProyek: true,
        deskripsi: true,
        lokasiLahan: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        petani: {
          select: {
            id: true,
            name: true,
            username: true,
            lokasi: true,
          },
        },
        updates: {
          orderBy: { createdAt: "desc" },
          take: 3,
          select: {
            id: true,
            judul: true,
            createdAt: true,
            fotoUrl: true,
          },
        },
        produk: {
          select: {
            id: true,
            namaProduk: true,
            status: true,
            harga: true,
            unit: true,
          },
          take: 5,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data proyek" },
      { status: 500 }
    );
  }
}
