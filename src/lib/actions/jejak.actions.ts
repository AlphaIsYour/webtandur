// lib/actions/jejak.actions.ts

"use server";

import prisma from "@/lib/prisma";

export async function getJejakTaniUpdates() {
  try {
    const updates = await prisma.farmingUpdate.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { likes: true, comments: true },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
        likes: true,
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
      },
      take: 20,
    });
    return updates;

  } catch (error) {
    console.error("Gagal mengambil data Jejak Tani:", error);
    return [];
  }
}

export type JejakTaniUpdateWithRelations = NonNullable<
  Awaited<ReturnType<typeof getJejakTaniUpdates>>
>[0];
