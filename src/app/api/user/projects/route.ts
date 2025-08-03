import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.proyekTani.findMany({
      where: { petaniId: session.user.id },
      select: {
        id: true,
        namaProyek: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
