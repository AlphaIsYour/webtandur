// app/api/auth/verify-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (
      !email ||
      !code ||
      typeof email !== "string" ||
      typeof code !== "string"
    ) {
      return NextResponse.json(
        { error: "Email dan kode verifikasi diperlukan." },
        { status: 400 }
      );
    }

    const verificationRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: code,
      },
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { error: "Kode verifikasi salah atau tidak ditemukan." },
        { status: 400 }
      );
    }

    if (new Date() > verificationRecord.expires) {
      await prisma.verificationToken.delete({
        where: {
          token: verificationRecord.token,
          identifier: verificationRecord.identifier,
        },
      });
      return NextResponse.json(
        {
          error: "Kode verifikasi sudah kedaluwarsa. Silakan minta kode baru.",
        },
        { status: 400 }
      );
    }

    await prisma.verificationToken.delete({
      where: {
        token: verificationRecord.token,
        identifier: verificationRecord.identifier,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email berhasil diverifikasi.",
    });
  } catch (error) {
    console.error("[VERIFY_CODE_ERROR]", error);
    return NextResponse.json(
      { error: "Gagal memverifikasi kode." },
      { status: 500 }
    );
  }
}
