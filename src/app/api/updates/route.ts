// app/api/updates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'recent', 'popular', 'all'
    const limit = parseInt(searchParams.get("limit") || "10");

    let orderBy: any = { createdAt: "desc" };

    if (type === "popular") {
      orderBy = { likes: { _count: "desc" } };
    }

    const updates = await prisma.farmingUpdate.findMany({
      orderBy,
      take: limit,
      select: {
        id: true,
        judul: true,
        deskripsi: true,
        fotoUrl: true,
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
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updates,
      count: updates.length,
    });
  } catch (error) {
    console.error("Error fetching updates:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data update" },
      { status: 500 }
    );
  }
}
