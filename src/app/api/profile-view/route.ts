import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petaniId } = body;

    if (!petaniId) {
      return NextResponse.json(
        { message: "petaniId diperlukan" },
        { status: 400 }
      );
    }

    // Get current session (could be null for guests)
    const session = await getServerSession(authOptions);
    const viewerId = session?.user?.id || null;

    // Don't track if user views their own profile
    if (viewerId === petaniId) {
      return NextResponse.json({ message: "Self view ignored" });
    }

    // Create profile view record
    await prisma.profileView.create({
      data: {
        petaniId,
        viewerId,
      },
    });

    if (Math.random() < 0.01) {
      await prisma.profileView.deleteMany({
        where: {
          createdAt: {
            lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });
    }

    return NextResponse.json({ message: "View recorded" });
  } catch (error) {
    console.error("Error recording profile view:", error);
    return NextResponse.json(
      { message: "Gagal merekam kunjungan profil" },
      { status: 500 }
    );
  }
}
