// app/api/comment/[jejakId]

import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, { params}: { params: Promise<{jejakId: string}>}) {
    const {jejakId} = await params;

    try {
        const comments = await prisma.comment.findMany({
            where: { farmingUpdateId: jejakId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ message: "Failed to fetch comments" }, { status: 500 });
    }

}