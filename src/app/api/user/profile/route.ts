import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        lokasi: true,
        linkWhatsapp: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, username, email, bio, lokasi, linkWhatsapp } = body;

    // Check if username is taken by another user
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: session.user.id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Username sudah digunakan" },
          { status: 400 }
        );
      }
    }

    // Check if email is taken by another user
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: session.user.id },
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "Email sudah digunakan" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || null,
        username: username || null,
        email: email || null,
        bio: bio || null,
        lokasi: lokasi || null,
        linkWhatsapp: linkWhatsapp || null,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        lokasi: true,
        linkWhatsapp: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
