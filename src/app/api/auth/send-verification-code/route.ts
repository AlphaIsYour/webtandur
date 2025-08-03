// app/api/auth/send-verification-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

const EMAIL_SERVER_HOST = process.env.EMAIL_SERVER_HOST;
const EMAIL_SERVER_PORT = process.env.EMAIL_SERVER_PORT;
const EMAIL_SERVER_USER = process.env.EMAIL_SERVER_USER;
const EMAIL_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD;
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM;

let transporter: nodemailer.Transporter | null = null;
if (
  EMAIL_SERVER_HOST &&
  EMAIL_SERVER_PORT &&
  EMAIL_SERVER_USER &&
  EMAIL_SERVER_PASSWORD &&
  EMAIL_FROM_ADDRESS
) {
  transporter = nodemailer.createTransport({
    host: EMAIL_SERVER_HOST,
    port: Number(EMAIL_SERVER_PORT),
    secure: Number(EMAIL_SERVER_PORT) === 465,
    auth: {
      user: EMAIL_SERVER_USER,
      pass: EMAIL_SERVER_PASSWORD,
    },
  });
} else {
  console.warn(
    "Konfigurasi Nodemailer/SMTP tidak lengkap. Email tidak akan dikirim. Cek .env.local (EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, EMAIL_FROM)"
  );
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email ini sudah terdaftar. Silakan login." },
        { status: 409 }
      );
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.$transaction([
      prisma.verificationToken.deleteMany({ where: { identifier: email } }),
      prisma.verificationToken.create({
        data: {
          identifier: email,
          token: verificationCode,
          expires,
        },
      }),
    ]);

    if (transporter && EMAIL_FROM_ADDRESS) {
      try {
        const mailOptions = {
          from: `"Web Tandur" <${EMAIL_FROM_ADDRESS}>`,
          to: email,
          subject: "Kode Verifikasi Pendaftaran Akun Tandur Anda",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto; border-radius: 8px;">
              <h2 style="color: #0D9488; text-align: center;">Selamat Datang di Tandur!</h2>
              <p style="font-size: 16px;">Terima kasih telah mendaftar. Gunakan kode berikut untuk memverifikasi alamat email Anda:</p>
              <div style="background-color: #f0fdfa; border: 1px dashed #14b8a6; padding: 15px; text-align: center; margin: 25px 0; border-radius: 4px;">
                <p style="font-size: 28px; font-weight: bold; letter-spacing: 3px; color: #0d9488; margin:0;">
                  ${verificationCode}
                </p>
              </div>
              <p style="font-size: 14px;">Kode ini akan kedaluwarsa dalam <strong>10 menit</strong>. Mohon untuk tidak membagikan kode ini kepada siapapun.</p>
              <p style="font-size: 14px;">Jika Anda tidak merasa melakukan pendaftaran ini, silakan abaikan email ini.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin-top: 25px;" />
              <p style="font-size: 0.85em; text-align: center; color: #777;">Tim Tandur</p>
            </div>
          `,
        };
        await transporter.sendMail(mailOptions);
        console.log(
          `Email verifikasi dikirim ke ${email} via Nodemailer/SMTP.`
        );
      } catch (emailError) {
        console.error("Nodemailer sendMail error:", emailError);
        console.warn(
          "Fallback: Kode verifikasi untuk",
          email,
          ":",
          verificationCode
        );
      }
    } else {
      console.warn(
        "Nodemailer/SMTP tidak dikonfigurasi. Kode verifikasi untuk",
        email,
        ":",
        verificationCode
      );
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          message:
            "Nodemailer tidak aktif. Kode (untuk dev): " + verificationCode,
          codeForDev: verificationCode,
        });
      }
    }

    return NextResponse.json({
      message:
        "Kode verifikasi telah dikirim ke email Anda (atau cek console server jika dev mode).",
    });
  } catch (error) {
    console.error("[SEND_VERIFICATION_CODE_ERROR_MAIN_CATCH]", error);
    let errorMessage = "Gagal mengirim kode verifikasi.";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes("Email ini sudah terdaftar")) {
        statusCode = 409;
      }
    }
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
