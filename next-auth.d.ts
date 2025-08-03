import { Role } from "@prisma/client"; // Import tipe Role dari Prisma
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      username: string; // <-- Tambahkan properti yang hilang
      role: Role; // <-- Tambahkan properti yang hilang
    } & DefaultSession["user"]; // Gabungkan dengan tipe default
  }

  // Ini untuk memperbarui tipe data User juga
  interface User {
    username: string;
    role: Role;
  }
}
