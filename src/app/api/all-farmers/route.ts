// app/api/all-farmers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  try {
    const petanis = await prisma.user.findMany({
      where: {
        role: "PETANI",
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            lokasi: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 30,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        lokasi: true,
        image: true,
        linkWhatsapp: true,
        _count: {
          select: {
            proyekTani: true,
          },
        },
      },
    });

    return NextResponse.json(petanis);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch farmers" },
      { status: 500 }
    );
  }
}
