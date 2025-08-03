// app/api/farmers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'new', 'active', 'all'
    const limit = parseInt(searchParams.get("limit") || "10");

    let farmers;

    switch (type) {
      case "new":
        farmers = await prisma.user.findMany({
          where: { role: "PETANI" },
          orderBy: { createdAt: "desc" },
          take: limit,
          select: {
            id: true,
            name: true,
            username: true,
            lokasi: true,
            createdAt: true,
            proyekTani: {
              select: {
                id: true,
                namaProyek: true,
                status: true,
              },
              take: 3,
            },
          },
        });
        break;

      case "active":
        farmers = await prisma.user.findMany({
          where: {
            role: "PETANI",
            proyekTani: {
              some: {
                status: {
                  in: ["PENANAMAN", "PERAWATAN", "PANEN"],
                },
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          take: limit,
          select: {
            id: true,
            name: true,
            username: true,
            lokasi: true,
            proyekTani: {
              where: {
                status: {
                  in: ["PENANAMAN", "PERAWATAN", "PANEN"],
                },
              },
              select: {
                id: true,
                namaProyek: true,
                status: true,
              },
              take: 3,
            },
          },
        });
        break;

      default:
        farmers = await prisma.user.findMany({
          where: { role: "PETANI" },
          orderBy: { createdAt: "desc" },
          take: limit,
          select: {
            id: true,
            name: true,
            username: true,
            lokasi: true,
            bio: true,
            proyekTani: {
              select: {
                id: true,
                namaProyek: true,
                status: true,
              },
              take: 3,
            },
          },
        });
    }

    return NextResponse.json({
      success: true,
      data: farmers,
      count: farmers.length,
    });
  } catch (error) {
    console.error("Error fetching farmers:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data petani" },
      { status: 500 }
    );
  }
}
