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

    // Check Content-Type to handle both JSON and FormData
    const contentType = request.headers.get("content-type");

    let proyekTaniId: string;
    let judul: string;
    let deskripsi: string;
    let fotoUrl: string[] = [];

    if (contentType?.includes("application/json")) {
      // Handle JSON request (new approach)
      const body = await request.json();
      proyekTaniId = body.proyekTaniId;
      judul = body.judul;
      deskripsi = body.deskripsi;
      fotoUrl = body.fotoUrl || [];
    } else {
      // Handle FormData request (legacy approach)
      const formData = await request.formData();
      proyekTaniId = formData.get("proyekTaniId") as string;
      judul = formData.get("judul") as string;
      deskripsi = formData.get("deskripsi") as string;
      const images = formData.getAll("images") as File[];

      // Upload images using existing upload API
      if (images.length > 0) {
        const uploadPromises = images.map(async (image) => {
          const imageFormData = new FormData();
          imageFormData.append("file", image);

          const uploadResponse = await fetch(
            `${process.env.NEXTAUTH_URL}/api/upload`,
            {
              method: "POST",
              body: imageFormData,
            }
          );

          if (!uploadResponse.ok) {
            throw new Error(`Upload failed for ${image.name}`);
          }

          const result = await uploadResponse.json();
          return result.url;
        });

        fotoUrl = await Promise.all(uploadPromises);
      }
    }

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

    const farmingUpdate = await prisma.farmingUpdate.create({
      data: {
        judul: judul || "",
        deskripsi,
        fotoUrl,
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
