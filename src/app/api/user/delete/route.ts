import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        proyekTani: true,
        pesanan: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user account (cascade will handle related data)
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ message: "Akun berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
