import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma"; // Sesuaikan dengan path prisma client Anda
import { authOptions } from "@/lib/auth"; // Sesuaikan dengan path auth options Anda

interface PetaniRegistrationData {
  nama: string;
  username: string;
  email: string;
  bio: string;
  lokasi: string;
  linkWhatsapp: string;
  alasanMenjadi: string;
  pengalamanBertani: string;
  jenisKomoditas: string;
  luasLahan: string;
  lokasiLahan: string;
  fotoProfil?: string;
  fotoKTP: string;
  sertifikatLahan?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Anda harus login terlebih dahulu." },
        { status: 401 }
      );
    }

    const data: PetaniRegistrationData = await request.json();

    // Validasi data required
    const requiredFields = [
      "nama",
      "username",
      "email",
      "bio",
      "lokasi",
      "linkWhatsapp",
      "alasanMenjadi",
      "pengalamanBertani",
      "jenisKomoditas",
      "luasLahan",
      "lokasiLahan",
      "fotoKTP",
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof PetaniRegistrationData]) {
        return NextResponse.json(
          { error: `Field ${field} wajib diisi.` },
          { status: 400 }
        );
      }
    }

    // Cek apakah user sudah pernah mendaftar sebagai petani
    const existingApplication = await prisma.petaniApplication.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          error:
            "Anda sudah pernah mendaftar sebagai petani. Silakan tunggu proses review.",
        },
        { status: 400 }
      );
    }

    // Cek apakah user sudah menjadi petani
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role === "PETANI") {
      return NextResponse.json(
        { error: "Anda sudah terdaftar sebagai petani." },
        { status: 400 }
      );
    }

    // Cek apakah username sudah digunakan (kecuali oleh user sendiri)
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: data.username,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username sudah digunakan. Silakan pilih username lain." },
        { status: 400 }
      );
    }

    // Validasi format WhatsApp link
    const whatsappRegex = /^https:\/\/wa\.me\/\d+$/;
    if (!whatsappRegex.test(data.linkWhatsapp)) {
      return NextResponse.json(
        {
          error:
            "Format link WhatsApp tidak valid. Gunakan format: https://wa.me/628123456789",
        },
        { status: 400 }
      );
    }

    // Buat aplikasi pendaftaran petani
    const application = await prisma.petaniApplication.create({
      data: {
        userId: session.user.id,
        nama: data.nama,
        username: data.username,
        bio: data.bio,
        lokasi: data.lokasi,
        linkWhatsapp: data.linkWhatsapp,
        alasanMenjadi: data.alasanMenjadi,
        pengalamanBertani: data.pengalamanBertani,
        jenisKomoditas: data.jenisKomoditas,
        luasLahan: data.luasLahan,
        lokasiLahan: data.lokasiLahan,
        fotoProfil: data.fotoProfil,
        fotoKTP: data.fotoKTP,
        sertifikatLahan: data.sertifikatLahan || [],
        status: "PENDING",
      },
    });

    // Optional: Kirim notifikasi ke admin
    // Anda bisa menambahkan logic untuk mengirim email atau notifikasi ke admin

    return NextResponse.json({
      message:
        "Pendaftaran berhasil dikirim. Kami akan menghubungi Anda dalam 1-3 hari kerja.",
      applicationId: application.id,
    });
  } catch (error) {
    console.error("Error in petani registration:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
