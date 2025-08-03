// app/api/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  try {
    const produks = await prisma.produk.findMany({
      where: {
        namaProduk: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 30,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        namaProduk: true,
        harga: true,
        unit: true,
        fotoUrl: true,
        proyekTani: {
          select: {
            petani: {
              select: {
                name: true,
                lokasi: true,
                linkWhatsapp: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(produks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}