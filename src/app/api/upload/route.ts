import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ALLOWED_DOCUMENT_TYPES = ["application/pdf"];

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File terlalu besar. Maksimal 5MB." },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const isImageFile = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isDocumentFile = ALLOWED_DOCUMENT_TYPES.includes(file.type);

    if (!isImageFile && !isDocumentFile) {
      return NextResponse.json(
        {
          error: "Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF.",
        },
        { status: 400 }
      );
    }

    // Generate nama file unik
    const uniqueFilename = `${file.name.split(".")[0]}-${nanoid(8)}.${file.name
      .split(".")
      .pop()}`;

    // Upload ke Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
    });

    return NextResponse.json({
      message: "File berhasil diupload",
      url: blob.url,
      fileName: uniqueFilename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Gagal mengupload file" },
      { status: 500 }
    );
  }
}
