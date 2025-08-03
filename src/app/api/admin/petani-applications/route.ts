import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - Mendapatkan semua aplikasi pendaftaran petani
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cek apakah user adalah admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    // Get applications with pagination
    const [applications, total] = await Promise.all([
      prisma.petaniApplication.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          reviewer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.petaniApplication.count({ where }),
    ]);

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching petani applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update status aplikasi
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cek apakah user adalah admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const { applicationId, status, adminNotes } = await request.json();

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Application ID and status are required" },
        { status: 400 }
      );
    }

    // Validasi status
    const validStatuses = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get application
    const application = await prisma.petaniApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Update application
    const updatedApplication = await prisma.petaniApplication.update({
      where: { id: applicationId },
      data: {
        status,
        adminNotes,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviewer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Jika disetujui, update role user menjadi PETANI dan update data profile
    if (status === "APPROVED") {
      await prisma.user.update({
        where: { id: application.userId },
        data: {
          role: "PETANI",
          name: application.nama,
          username: application.username,
          bio: application.bio,
          lokasi: application.lokasi,
          linkWhatsapp: application.linkWhatsapp,
          image: application.fotoProfil || undefined,
        },
      });
    }

    // TODO: Kirim email notifikasi ke user tentang status aplikasi
    // sendEmailNotification(application.user.email, status, adminNotes)

    return NextResponse.json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
