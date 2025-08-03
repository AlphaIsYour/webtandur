import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cek aplikasi pendaftaran user
    const application = await prisma.petaniApplication.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
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
    });

    if (!application) {
      return NextResponse.json({
        hasApplication: false,
        message: "Belum pernah mendaftar sebagai petani",
      });
    }

    return NextResponse.json({
      hasApplication: true,
      application: {
        id: application.id,
        status: application.status,
        adminNotes: application.adminNotes,
        reviewedBy: application.reviewer,
        reviewedAt: application.reviewedAt,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching application status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
