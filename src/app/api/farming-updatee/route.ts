import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const updates = await prisma.farmingUpdate.findMany({
      select: {
        id: true,
        createdAt: true,
        judul: true,
        deskripsi: true,
        fotoUrl: true,
        proyekTani: {
          select: {
            id: true,
            namaProyek: true,
            petani: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error("Error fetching farming updates:", error);
    return NextResponse.json(
      { message: "Gagal mengambil pembaruan pertanian" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const proyekTaniId = formData.get("proyekTaniId") as string;
    const judul = formData.get("judul") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const images = formData.getAll("images") as File[];

    if (!proyekTaniId || !deskripsi) {
      return NextResponse.json(
        { error: "Proyek dan deskripsi harus diisi" },
        { status: 400 }
      );
    }

    // Verify project ownership
    const project = await prisma.proyekTani.findFirst({
      where: {
        id: proyekTaniId,
        petaniId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Proyek tidak ditemukan atau bukan milik Anda" },
        { status: 404 }
      );
    }

    // Process images (you'll need to implement actual image upload to cloud storage)
    const imageUrls: string[] = [];

    // For now, we'll just create placeholder URLs
    // In real implementation, upload to CloudFlare R2, AWS S3, etc.
    for (let i = 0; i < images.length; i++) {
      // const uploadedUrl = await uploadImage(images[i])
      imageUrls.push(`/placeholder-image-${Date.now()}-${i}.jpg`);
    }

    const farmingUpdate = await prisma.farmingUpdate.create({
      data: {
        judul: judul || "",
        deskripsi,
        fotoUrl: imageUrls,
        proyekTaniId,
      },
      include: {
        proyekTani: {
          include: {
            petani: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(farmingUpdate);
  } catch (error) {
    console.error("Error creating farming update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
