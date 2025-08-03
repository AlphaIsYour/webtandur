import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Mendapatkan detail aplikasi spesifik
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params first
    const { id } = await params;

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

    const application = await prisma.petaniApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
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

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Error fetching application detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Menghapus aplikasi
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params first
    const { id } = await params;

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

    const application = await prisma.petaniApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    await prisma.petaniApplication.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
