// app/api/like/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, farmingUpdateId } = body;

  try {
    const like = await prisma.like.create({
      data: { userId, farmingUpdateId },
    });

    return NextResponse.json({ success: true, like });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Already liked' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Failed to like' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { userId, farmingUpdateId } = body;

  try {
    await prisma.like.delete({
      where: {
        userId_farmingUpdateId: {
          userId,
          farmingUpdateId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to unlike' }, { status: 500 });
  }
}
