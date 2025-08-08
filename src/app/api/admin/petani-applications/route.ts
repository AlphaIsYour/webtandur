// src/app/api/admin/petani-applications/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const where: Prisma.PetaniApplicationWhereInput = {};
    if (status && status !== "all") {
      where.status = status as any;
    }

    // Step 1: Get applications without includes to avoid the panic
    const [applications, total] = await Promise.all([
      prisma.petaniApplication.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.petaniApplication.count({ where }),
    ]);

    // Step 2: Manually fetch related data with error handling
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        try {
          // Fetch user data
          const user = await prisma.user
            .findUnique({
              where: { id: app.userId },
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            })
            .catch(() => null); // Return null if user not found

          // Fetch reviewer data if reviewedBy exists
          let reviewer = null;
          if (app.reviewedBy) {
            reviewer = await prisma.user
              .findUnique({
                where: { id: app.reviewedBy },
                select: {
                  name: true,
                  email: true,
                },
              })
              .catch(() => null); // Return null if reviewer not found
          }

          return {
            ...app,
            user,
            reviewer,
          };
        } catch (error) {
          console.error(
            `Error fetching relations for application ${app.id}:`,
            error
          );
          return {
            ...app,
            user: null,
            reviewer: null,
          };
        }
      })
    );

    return NextResponse.json({
      applications: enrichedApplications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching petani applications:", error);

    // Check if it's a specific Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (adminUser?.role !== "ADMIN") {
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

    const validStatuses = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedApplication = await prisma.$transaction(async (tx) => {
      // Update status aplikasi
      const application = await tx.petaniApplication.update({
        where: { id: applicationId },
        data: {
          status,
          adminNotes: adminNotes || null,
          reviewedBy: session.user.id,
          reviewedAt: new Date(),
        },
      });

      // Jika disetujui, update role user dan data profilnya
      if (status === "APPROVED") {
        // Cek dulu apakah user ada
        const userExists = await tx.user.findUnique({
          where: { id: application.userId },
        });

        if (userExists) {
          await tx.user.update({
            where: { id: application.userId },
            data: {
              role: "PETANI",
              // Hanya update field yang ada di schema User
              ...(application.nama && { name: application.nama }),
              ...(application.username && { username: application.username }),
              ...(application.bio && { bio: application.bio }),
              ...(application.fotoProfil && { image: application.fotoProfil }),
              // Remove fields yang mungkin tidak ada di schema User
              // lokasi dan linkWhatsapp mungkin tidak ada di schema User
            },
          });
          console.log(`User ${application.userId} role updated to PETANI`);
        } else {
          console.error(`User with ID ${application.userId} not found`);
        }
      }

      // Get updated application without includes to avoid potential issues
      const result = await tx.petaniApplication.findUniqueOrThrow({
        where: { id: applicationId },
      });

      // Manually fetch relations
      const [user, reviewer] = await Promise.all([
        tx.user
          .findUnique({
            where: { id: result.userId },
            select: { id: true, name: true, email: true },
          })
          .catch(() => null),
        result.reviewedBy
          ? tx.user
              .findUnique({
                where: { id: result.reviewedBy },
                select: { name: true, email: true },
              })
              .catch(() => null)
          : null,
      ]);

      return {
        ...result,
        user,
        reviewer,
      };
    });

    return NextResponse.json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application status:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
