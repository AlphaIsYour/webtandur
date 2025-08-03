import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { messageId, reply, adminEmail } = await req.json();

    await prisma.csMessage.update({
      where: { id: messageId },
      data: {
        adminReply: reply,
        adminEmail,
        status: "REPLIED",
        repliedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Balasan berhasil dikirim",
    });
  } catch (error) {
    console.error("Admin Reply Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirim balasan" },
      { status: 500 }
    );
  }
}
