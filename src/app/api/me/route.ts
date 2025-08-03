import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        bio: true,
        lokasi: true,
        linkWhatsapp: true,
        role: true,
        proyekTani: {
            select: {
                id: true,
                namaProyek: true,
                deskripsi: true,
                lokasiLahan: true,
            }
        }
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (err) {
    console.error("GET /api/me error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
