import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params since it's now a Promise in Next.js 15
    const { id } = await params;

    await prisma.csMessage.update({
      where: { id },
      data: { status: "READ" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark as read error:", error);
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}
