import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const messages = await prisma.csMessage.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Get Messages Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil pesan" },
      { status: 500 }
    );
  }
}
