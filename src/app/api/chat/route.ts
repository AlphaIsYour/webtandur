/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/chat/route.ts - REPLACE EXISTING FILE
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { PrismaClient } from "@prisma/client";

// export const runtime = "edge";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Ambil pesan terakhir user untuk analisis intent
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    console.log("User message:", lastUserMessage);

    // Analisis intent dan ambil data konteks
    const intent = await analyzeUserIntent(lastUserMessage);
    console.log("Detected intent:", intent);

    const contextData = await getRelevantData(intent, lastUserMessage);
    console.log("Context data:", contextData);

    // Update system message dengan data konteks
    const systemMessage = {
      role: "system" as const,
      content: `Kamu adalah TaniBot, asisten AI untuk platform media sosial petani Indonesia! Misimu membantu pengguna mencari informasi tentang petani, produk pertanian, tips bertani, dan info pasar.

PENTING: 
- SELALU jawab dalam Bahasa Indonesia yang santai dan ramah
- Pakai formatting markdown untuk teks tebal (**bold**) dan list
- Buat pengguna merasa ngobrol sama teman yang paham dunia pertanian
- Fokus pada topik: pertanian, petani, produk hasil tani, tips berkebun
- SELALU jawab dalam Bahasa Indonesia yang santai dan ramah
- JANGAN PERNAH pakai bahasa Inggris
- Buat pengguna merasa ngobrol sama teman yang pintar soal pertanian

DATA KONTEKS TERKINI (gunakan untuk jawab pertanyaan user dengan informasi real dan akurat):
${JSON.stringify(contextData, null, 2)}

INSTRUKSI KHUSUS:
- Kalau ada data produk, sebutkan nama, harga, stok, dan petaninya
- Kalau ada data petani, sebutkan nama, lokasi, dan proyeknya
- Kalau ada statistik, berikan angka yang akurat
- Kalau data kosong, bilang "belum ada" atau "tidak tersedia saat ini"
- Format harga dengan "Rp" dan beri emphasis dengan **bold**
- Format nama produk/petani dengan **bold**

Kalau ada pertanyaan di luar topik pertanian, arahkan kembali dengan cara yang fun.`,
    };

    // Pastikan messages adalah array
    const allMessages = Array.isArray(messages)
      ? [systemMessage, ...messages]
      : [systemMessage];

    const result = await generateText({
      model: groq("llama3-8b-8192"),
      messages: allMessages,
    });

    return new Response(JSON.stringify({ text: result.text }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error dari Groq API:", error);
    return new Response(
      JSON.stringify({ error: "Maaf, terjadi kesalahan di server." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Helper functions untuk intent analysis dan data retrieval
async function analyzeUserIntent(message: string) {
  const lowerMessage = message.toLowerCase();

  // Intent patterns untuk pertanian
  if (
    lowerMessage.includes("produk") &&
    (lowerMessage.includes("terbaru") || lowerMessage.includes("baru"))
  ) {
    return "products_new";
  }
  if (
    lowerMessage.includes("produk") &&
    (lowerMessage.includes("tersedia") || lowerMessage.includes("ada"))
  ) {
    return "products_available";
  }
  if (lowerMessage.includes("beras") || lowerMessage.includes("padi")) {
    return "products_rice";
  }
  if (
    lowerMessage.includes("sayur") ||
    lowerMessage.includes("sayuran") ||
    lowerMessage.includes("kangkung") ||
    lowerMessage.includes("bayam") ||
    lowerMessage.includes("tomat")
  ) {
    return "products_vegetables";
  }
  if (
    lowerMessage.includes("buah") ||
    lowerMessage.includes("jeruk") ||
    lowerMessage.includes("apel") ||
    lowerMessage.includes("pisang")
  ) {
    return "products_fruits";
  }
  if (lowerMessage.includes("murah") || lowerMessage.includes("harga")) {
    return "products_cheap";
  }
  if (
    lowerMessage.includes("petani") &&
    (lowerMessage.includes("baru") || lowerMessage.includes("bergabung"))
  ) {
    return "farmers_new";
  }
  if (
    lowerMessage.includes("petani") &&
    (lowerMessage.includes("aktif") || lowerMessage.includes("terbaik"))
  ) {
    return "farmers_active";
  }
  if (
    lowerMessage.includes("proyek") ||
    lowerMessage.includes("project") ||
    lowerMessage.includes("tanam")
  ) {
    return "projects_info";
  }
  if (
    lowerMessage.includes("statistik") ||
    lowerMessage.includes("data") ||
    lowerMessage.includes("jumlah")
  ) {
    return "stats";
  }
  if (
    lowerMessage.includes("update") ||
    lowerMessage.includes("berita") ||
    lowerMessage.includes("kabar")
  ) {
    return "updates";
  }
  if (
    lowerMessage.includes("lokasi") ||
    lowerMessage.includes("daerah") ||
    lowerMessage.includes("tempat")
  ) {
    return "locations";
  }

  return "general";
}

async function getRelevantData(intent: string, message: string) {
  let data: any = {};

  try {
    switch (intent) {
      case "products_new":
        data.products = await prisma.produk.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 30 hari terakhir
            },
          },
          take: 6,
          orderBy: { createdAt: "desc" },
          include: {
            proyekTani: {
              include: {
                petani: {
                  select: { name: true, lokasi: true },
                },
              },
            },
          },
        });
        break;

      case "products_available":
        data.products = await prisma.produk.findMany({
          where: {
            status: "TERSEDIA",
            stokTersedia: { gt: 0 },
          },
          take: 8,
          orderBy: { createdAt: "desc" },
          include: {
            proyekTani: {
              include: {
                petani: {
                  select: { name: true, lokasi: true },
                },
              },
            },
          },
        });
        break;

      case "products_rice":
        data.products = await prisma.produk.findMany({
          where: {
            OR: [
              { namaProduk: { contains: "beras", mode: "insensitive" } },
              { namaProduk: { contains: "padi", mode: "insensitive" } },
            ],
          },
          take: 5,
          include: {
            proyekTani: {
              include: {
                petani: {
                  select: { name: true, lokasi: true },
                },
              },
            },
          },
        });
        break;

      case "products_vegetables":
        data.products = await prisma.produk.findMany({
          where: {
            OR: [
              { namaProduk: { contains: "sayur", mode: "insensitive" } },
              { namaProduk: { contains: "tomat", mode: "insensitive" } },
              { namaProduk: { contains: "cabai", mode: "insensitive" } },
              { namaProduk: { contains: "kangkung", mode: "insensitive" } },
              { namaProduk: { contains: "bayam", mode: "insensitive" } },
              { namaProduk: { contains: "wortel", mode: "insensitive" } },
            ],
          },
          take: 8,
          include: {
            proyekTani: {
              include: {
                petani: {
                  select: { name: true, lokasi: true },
                },
              },
            },
          },
        });
        break;

      case "products_fruits":
        data.products = await prisma.produk.findMany({
          where: {
            OR: [
              { namaProduk: { contains: "buah", mode: "insensitive" } },
              { namaProduk: { contains: "jeruk", mode: "insensitive" } },
              { namaProduk: { contains: "apel", mode: "insensitive" } },
              { namaProduk: { contains: "pisang", mode: "insensitive" } },
              { namaProduk: { contains: "mangga", mode: "insensitive" } },
            ],
          },
          take: 8,
          include: {
            proyekTani: {
              include: {
                petani: {
                  select: { name: true, lokasi: true },
                },
              },
            },
          },
        });
        break;

      case "products_cheap":
        data.products = await prisma.produk.findMany({
          where: {
            harga: { lt: 50000 },
            status: "TERSEDIA",
          },
          take: 8,
          orderBy: { harga: "asc" },
          include: {
            proyekTani: {
              include: {
                petani: {
                  select: { name: true, lokasi: true },
                },
              },
            },
          },
        });
        break;

      case "farmers_new":
        data.farmers = await prisma.user.findMany({
          where: {
            role: "PETANI",
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 hari terakhir
            },
          },
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            name: true,
            lokasi: true,
            createdAt: true,
            proyekTani: {
              select: { namaProyek: true, status: true },
              take: 3,
            },
          },
        });
        break;

      case "farmers_active":
        data.farmers = await prisma.user.findMany({
          where: {
            role: "PETANI",
            proyekTani: {
              some: {
                status: {
                  in: ["PENANAMAN", "PERAWATAN", "PANEN"],
                },
              },
            },
          },
          take: 5,
          orderBy: { updatedAt: "desc" },
          select: {
            name: true,
            lokasi: true,
            proyekTani: {
              where: {
                status: { in: ["PENANAMAN", "PERAWATAN", "PANEN"] },
              },
              select: { namaProyek: true, status: true },
              take: 3,
            },
          },
        });
        break;

      case "projects_info":
        data.projects = await prisma.proyekTani.findMany({
          where: {
            status: {
              in: ["PENANAMAN", "PERAWATAN", "PANEN"],
            },
          },
          take: 6,
          orderBy: { updatedAt: "desc" },
          include: {
            petani: {
              select: { name: true, lokasi: true },
            },
            produk: {
              select: { namaProduk: true, status: true, harga: true },
            },
          },
        });
        break;

      case "stats":
        const [totalFarmers, totalProducts, activeProjects, availableProducts] =
          await Promise.all([
            prisma.user.count({ where: { role: "PETANI" } }),
            prisma.produk.count(),
            prisma.proyekTani.count({
              where: { status: { in: ["PENANAMAN", "PERAWATAN", "PANEN"] } },
            }),
            prisma.produk.count({
              where: { status: "TERSEDIA", stokTersedia: { gt: 0 } },
            }),
          ]);
        data.stats = {
          totalFarmers,
          totalProducts,
          activeProjects,
          availableProducts,
        };
        break;

      case "updates":
        data.updates = await prisma.farmingUpdate.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            proyekTani: {
              include: {
                petani: {
                  select: { name: true, lokasi: true },
                },
              },
            },
          },
        });
        break;

      case "locations":
        data.locations = await prisma.user.groupBy({
          by: ["lokasi"],
          where: {
            role: "PETANI",
            lokasi: { not: null },
          },
          _count: {
            lokasi: true,
          },
          orderBy: {
            _count: {
              lokasi: "desc",
            },
          },
          take: 8,
        });
        break;
    }
  } catch (error) {
    console.error("Database error:", error);
    data.error = "Database tidak tersedia saat ini";
  }

  return data;
}
