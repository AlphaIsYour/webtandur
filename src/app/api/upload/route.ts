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

    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Validasi ukuran file
    if (file.size === 0) {
      return NextResponse.json(
        { error: "File kosong atau rusak" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File terlalu besar. Maksimal 5MB." },
        { status: 400 }
      );
    }

    // Validasi tipe file - lebih permisif
    const isImageFile =
      ALLOWED_IMAGE_TYPES.includes(file.type) || file.type.startsWith("image/");
    const isDocumentFile = ALLOWED_DOCUMENT_TYPES.includes(file.type);

    if (!isImageFile && !isDocumentFile) {
      return NextResponse.json(
        {
          error: `Tipe file tidak didukung: ${file.type}. Gunakan JPG, PNG, WEBP, atau PDF.`,
        },
        { status: 400 }
      );
    }

    // Generate nama file unik
    const fileExtension = file.name.split(".").pop() || "bin";
    const uniqueFilename = `${file.name.split(".")[0]}-${nanoid(
      8
    )}.${fileExtension}`;

    console.log("Uploading file:", uniqueFilename);

    // Upload ke Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
    });

    console.log("Upload success:", blob.url);

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
      {
        error: `Gagal mengupload file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
