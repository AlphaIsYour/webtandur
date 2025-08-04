import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "PETANI") {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }

    const petaniId = session.user.id;

    // Get stats in parallel
    const [proyekAktif, totalProduk, pengunjungProfil, aktivitasTerbaru] =
      await Promise.all([
        // Proyek aktif count
        prisma.proyekTani.count({
          where: {
            petaniId: petaniId,
            status: { not: "SELESAI" },
          },
        }),

        // Total produk count
        prisma.produk.count({
          where: {
            proyekTani: {
              petaniId: petaniId,
            },
          },
        }),

        // Profile views last 30 days
        prisma.profileView.count({
          where: {
            petaniId: petaniId,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),

        // Aktivitas terbaru (FarmingUpdate)
        prisma.farmingUpdate.findMany({
          where: {
            proyekTani: {
              petaniId: petaniId,
            },
          },
          include: {
            proyekTani: {
              select: { namaProyek: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return NextResponse.json({
      proyekAktif,
      totalProduk,
      pengunjungProfil,
      aktivitasTerbaru,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { message: "Gagal mengambil statistik dashboard" },
      { status: 500 }
    );
  }
}
