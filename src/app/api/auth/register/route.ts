// app/api/auth/register/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const completeRegistrationSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("REGISTER API - Received body:", body);

    const validation = completeRegistrationSchema.safeParse(body);
    if (!validation.success) {
      const formattedErrors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Data registrasi tidak valid.", details: formattedErrors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          select: { provider: true },
        },
      },
    });

    if (existingUser) {
      // Jika user sudah ada tapi hanya dengan OAuth dan belum punya password
      const hasOAuthOnly =
        existingUser.accounts.length > 0 && !existingUser.password;

      if (hasOAuthOnly) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            password: hashedPassword,
            emailVerified: new Date(), // Ensure email is verified
          },
        });

        console.log("User updated with credentials:", existingUser.id);
        return NextResponse.json(
          {
            message:
              "Password berhasil ditambahkan ke akun yang sudah ada. Silakan login dengan email dan password.",
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Email sudah terdaftar. Silakan login." },
          { status: 409 }
        );
      }
    }

    // Buat user baru
    const hashedPassword = await bcrypt.hash(password, 10);
    const userName = email.split("@")[0];

    const user = await prisma.user.create({
      data: {
        email,
        name: userName,
        password: hashedPassword,
        role: "PEMBELI",
        emailVerified: new Date(),
        provider: "credentials",
      },
    });

    console.log("New user created successfully:", user.id);
    return NextResponse.json(
      {
        message:
          "Pendaftaran berhasil! Silakan login dengan email dan password Anda.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[ERROR_COMPLETE_REGISTER]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat registrasi." },
      { status: 500 }
    );
  }
}
