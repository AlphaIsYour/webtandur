// app/api/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get basic counts
    const [
      totalFarmers,
      totalProducts,
      totalProjects,
      newFarmersThisWeek,
      newProductsThisWeek,
      activeProjects,
      availableProducts,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "PETANI" } }),
      prisma.produk.count(),
      prisma.proyekTani.count(),
      prisma.user.count({
        where: {
          role: "PETANI",
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.produk.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.proyekTani.count({
        where: {
          status: {
            in: ["PENANAMAN", "PERAWATAN", "PANEN"],
          },
        },
      }),
      prisma.produk.count({
        where: {
          status: "TERSEDIA",
          stokTersedia: { gt: 0 },
        },
      }),
    ]);

    // Get top categories (simplified)
    const topProductTypes = await prisma.produk.groupBy({
      by: ["namaProduk"],
      _count: {
        namaProduk: true,
      },
      orderBy: {
        _count: {
          namaProduk: "desc",
        },
      },
      take: 5,
    });

    // Get locations with most farmers
    const topLocations = await prisma.user.groupBy({
      by: ["lokasi"],
      where: {
        role: "PETANI",
        lokasi: { not: null },
      },
      _count: {
        lokasi: true,
      },
      orderBy: {
        _count: {
          lokasi: "desc",
        },
      },
      take: 5,
    });

    const stats = {
      totals: {
        farmers: totalFarmers,
        products: totalProducts,
        projects: totalProjects,
      },
      recent: {
        newFarmersThisWeek,
        newProductsThisWeek,
      },
      active: {
        activeProjects,
        availableProducts,
      },
      insights: {
        topProductTypes: topProductTypes.map((item) => ({
          name: item.namaProduk,
          count: item._count.namaProduk,
        })),
        topLocations: topLocations.map((item) => ({
          location: item.lokasi,
          count: item._count.lokasi,
        })),
      },
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil statistik" },
      { status: 500 }
    );
  }
}
