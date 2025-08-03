import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "PETANI") {
        return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
    }
    const { id } = await params;
    const body = await request.json();
    const {username, bio, lokasi, linkWhatsapp} = body;

    if (!username || !bio || !lokasi || !linkWhatsapp) {
        return NextResponse.json(
            { message: "Semua field harus diisi" },
            { status: 400 }
        );
    }

    try {
        const updatedPetani = await prisma.user.update({
            where: { id },
            data: {
                username,
                bio,
                lokasi,
                linkWhatsapp,
            },
        });

        return NextResponse.json(
            { message: "Profil petani berhasil diperbarui", data: updatedPetani },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating petani profile:", error);
        return NextResponse.json(
            { message: "Terjadi kesalahan saat memperbarui profil" },
            { status: 500 }
        );
    }

}