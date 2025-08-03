// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Impor konfigurasi dari lib

// Inisialisasi handler NextAuth dengan konfigurasi yang sudah kita buat
const handler = NextAuth(authOptions);

// Ini adalah bagian pentingnya!
// Kita ekspor handler yang sama untuk metode GET dan POST
export { handler as GET, handler as POST };
